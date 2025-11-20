/**
 * Deduct Inventory API
 * Deducts inventory from SKU-based product inventory when orders are fulfilled
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

// POST - Deduct inventory for fulfilled orders
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, sku, quantity } = body;

    if (!productId || !sku || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'productId, sku, and quantity (greater than 0) are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Get current inventory
      const inventoryResult = await client.query(
        'SELECT id, quantity, reserved_quantity FROM product_inventory WHERE user_id = $1 AND product_id = $2 AND sku = $3',
        [userId, productId, sku]
      );

      if (inventoryResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Inventory record not found for this product and SKU' },
          { status: 404 }
        );
      }

      const inventory = inventoryResult.rows[0];
      const availableQuantity = inventory.quantity - inventory.reserved_quantity;

      if (availableQuantity < quantity) {
        return NextResponse.json(
          { 
            error: 'Insufficient inventory', 
            details: `Available: ${availableQuantity}, Requested: ${quantity}` 
          },
          { status: 400 }
        );
      }

      // Deduct from quantity
      const newQuantity = inventory.quantity - quantity;
      await client.query(
        'UPDATE product_inventory SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [newQuantity, inventory.id]
      );

      return NextResponse.json({
        success: true,
        message: `Deducted ${quantity} units from SKU ${sku}`,
        remainingQuantity: newQuantity,
        availableQuantity: newQuantity - inventory.reserved_quantity
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Deduct inventory error:', error);
    return NextResponse.json(
      { error: 'Failed to deduct inventory', details: error.message },
      { status: 500 }
    );
  }
}

