/**
 * Product Inventory & SKU Management API
 * Handles per-product inventory, SKU management, and restocking
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

function getUserIdFromToken(request: NextRequest): number | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch {
    return null;
  }
}

// GET - Get inventory for all products or specific product
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const client = await pool.connect();
    try {
      let query = `
        SELECT 
          pi.*,
          p.name as product_name,
          p.cost,
          p.selling_price,
          p.category
        FROM product_inventory pi
        JOIN products p ON p.id = pi.product_id
        WHERE pi.user_id = $1
      `;
      const params: any[] = [userId];

      if (productId) {
        query += ' AND pi.product_id = $2';
        params.push(parseInt(productId));
      }

      query += ' ORDER BY p.name, pi.sku';

      const result = await client.query(query, params);

      const inventory = result.rows.map((row: any) => ({
        id: row.id,
        productId: row.product_id,
        productName: row.product_name,
        sku: row.sku,
        quantity: row.quantity,
        reservedQuantity: row.reserved_quantity,
        availableQuantity: row.quantity - row.reserved_quantity,
        reorderPoint: row.reorder_point,
        reorderQuantity: row.reorder_quantity,
        lastRestockedAt: row.last_restocked_at,
        productCost: parseFloat(row.cost || 0),
        productPrice: parseFloat(row.selling_price || 0),
        category: row.category,
        needsRestock: row.quantity <= row.reorder_point
      }));

      return NextResponse.json({
        success: true,
        inventory
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to get inventory', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Restock inventory or update SKU
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, productId, sku, quantity, reorderPoint, reorderQuantity } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Verify product belongs to user
      const productCheck = await client.query(
        'SELECT id, name, cost FROM products WHERE id = $1 AND user_id = $2',
        [productId, userId]
      );

      if (productCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const product = productCheck.rows[0];
      const productCost = parseFloat(product.cost || 0);

      if (action === 'restock') {
        if (!sku || !quantity || quantity <= 0) {
          return NextResponse.json(
            { error: 'sku and quantity (greater than 0) are required for restocking' },
            { status: 400 }
          );
        }

        // Check user's budget before restocking
        const userResult = await client.query(
          'SELECT budget FROM users WHERE id = $1',
          [userId]
        );
        const userBudget = parseFloat(userResult.rows[0]?.budget || '0');

        // Get or create inventory record
        const inventoryCheck = await client.query(
          'SELECT id, quantity FROM product_inventory WHERE user_id = $1 AND product_id = $2 AND sku = $3',
          [userId, productId, sku]
        );

        const restockCost = quantity * productCost;
        const currentQuantity = inventoryCheck.rows[0]?.quantity || 0;

        // Check if user has enough budget
        if (userBudget < restockCost) {
          return NextResponse.json(
            { 
              error: 'Insufficient budget', 
              details: `You need $${restockCost.toFixed(2)} but only have $${userBudget.toFixed(2)} available.` 
            },
            { status: 400 }
          );
        }

        // Upsert inventory
        await client.query(
          `INSERT INTO product_inventory 
           (user_id, product_id, sku, quantity, reorder_point, reorder_quantity, last_restocked_at)
           VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id, product_id, sku) 
           DO UPDATE SET
             quantity = product_inventory.quantity + EXCLUDED.quantity,
             last_restocked_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
          [
            userId,
            productId,
            sku,
            quantity,
            reorderPoint || 10,
            reorderQuantity || 20
          ]
        );

        // Update product SKU if not set
        await client.query(
          'UPDATE products SET sku = $1 WHERE id = $2 AND (sku IS NULL OR sku = \'\')',
          [sku, productId]
        );

        // Deduct from user budget
        const newBudget = userBudget - restockCost;
        await client.query(
          'UPDATE users SET budget = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newBudget, userId]
        );

        // Log transaction in budget_transactions
        await client.query(
          `INSERT INTO budget_transactions (user_id, transaction_type, amount, description, metadata)
           VALUES ($1, 'spend', $2, $3, $4)`,
          [
            userId,
            restockCost,
            `Restocked ${quantity} units of SKU ${sku} for ${product.name}`,
            JSON.stringify({ productId, sku, quantity, cost: restockCost })
          ]
        );

        return NextResponse.json({
          success: true,
          message: `Restocked ${quantity} units of SKU ${sku}`,
          restockCost,
          newQuantity: currentQuantity + quantity,
          newBudget
        });
      }

      if (action === 'update') {
        // Update SKU settings
        if (!sku) {
          return NextResponse.json(
            { error: 'sku is required' },
            { status: 400 }
          );
        }

        await client.query(
          `INSERT INTO product_inventory 
           (user_id, product_id, sku, quantity, reorder_point, reorder_quantity)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (user_id, product_id, sku) 
           DO UPDATE SET
             reorder_point = COALESCE(EXCLUDED.reorder_point, product_inventory.reorder_point),
             reorder_quantity = COALESCE(EXCLUDED.reorder_quantity, product_inventory.reorder_quantity),
             updated_at = CURRENT_TIMESTAMP`,
          [
            userId,
            productId,
            sku,
            quantity || 0,
            reorderPoint,
            reorderQuantity
          ]
        );

        // Update product SKU
        await client.query(
          'UPDATE products SET sku = $1 WHERE id = $2',
          [sku, productId]
        );

        return NextResponse.json({
          success: true,
          message: 'SKU updated successfully'
        });
      }

      return NextResponse.json(
        { error: 'Invalid action. Use "restock" or "update".' },
        { status: 400 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Inventory operation error:', error);
    return NextResponse.json(
      { error: 'Failed to process inventory operation', details: error.message },
      { status: 500 }
    );
  }
}

