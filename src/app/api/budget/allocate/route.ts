/**
 * Budget Allocation API
 * Allows users to allocate budget to specific products and add funds to their wallet
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

// POST - Allocate budget to products or add funds
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, amount, productId, allocations } = body;

    const client = await pool.connect();
    try {
      // Get user's current budget
      const userResult = await client.query(
        'SELECT budget FROM users WHERE id = $1',
        [userId]
      );
      const currentBudget = parseFloat(userResult.rows[0]?.budget || '0');

      if (action === 'add_funds') {
        // Add funds to wallet
        if (!amount || amount <= 0) {
          return NextResponse.json(
            { error: 'Invalid amount. Must be greater than 0.' },
            { status: 400 }
          );
        }

        const newBudget = currentBudget + parseFloat(amount);
        await client.query(
          'UPDATE users SET budget = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newBudget, userId]
        );

        // Log transaction
        await client.query(
          `INSERT INTO budget_transactions (user_id, transaction_type, amount, description)
           VALUES ($1, 'deposit', $2, $3)`,
          [userId, parseFloat(amount), `Added $${amount} to wallet`]
        );

        return NextResponse.json({
          success: true,
          message: `$${amount} added to your wallet`,
          newBudget,
          transaction: {
            type: 'deposit',
            amount: parseFloat(amount),
            timestamp: new Date().toISOString()
          }
        });
      }

      if (action === 'allocate') {
        // Allocate budget to products
        if (!allocations || !Array.isArray(allocations)) {
          return NextResponse.json(
            { error: 'Invalid allocations. Must be an array.' },
            { status: 400 }
          );
        }

        // Calculate total allocation
        const totalAllocation = allocations.reduce((sum: number, alloc: any) => {
          return sum + parseFloat(alloc.amount || 0);
        }, 0);

        if (totalAllocation > currentBudget) {
          return NextResponse.json(
            { 
              error: 'Insufficient funds',
              details: `You're trying to allocate $${totalAllocation} but only have $${currentBudget} available.`,
              available: currentBudget,
              requested: totalAllocation
            },
            { status: 400 }
          );
        }

        // Update product budget allocations
        const allocationResults = [];
        for (const alloc of allocations) {
          if (!alloc.productId || !alloc.amount || alloc.amount <= 0) continue;

          // Check if product belongs to user
          const productCheck = await client.query(
            'SELECT id, name FROM products WHERE id = $1 AND user_id = $2',
            [alloc.productId, userId]
          );

          if (productCheck.rows.length === 0) {
            continue; // Skip invalid products
          }

          // Upsert product budget allocation
          await client.query(
            `INSERT INTO product_budget_allocations (user_id, product_id, allocated_budget, used_budget)
             VALUES ($1, $2, $3, 0)
             ON CONFLICT (user_id, product_id) 
             DO UPDATE SET 
               allocated_budget = EXCLUDED.allocated_budget,
               updated_at = CURRENT_TIMESTAMP`,
            [userId, alloc.productId, parseFloat(alloc.amount)]
          );

          allocationResults.push({
            productId: alloc.productId,
            productName: productCheck.rows[0].name,
            amount: parseFloat(alloc.amount)
          });
        }

        // Deduct from user budget
        const remainingBudget = currentBudget - totalAllocation;
        await client.query(
          'UPDATE users SET budget = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [remainingBudget, userId]
        );

        // Log transaction
        await client.query(
          `INSERT INTO budget_transactions (user_id, transaction_type, amount, description, metadata)
           VALUES ($1, 'allocation', $2, $3, $4)`,
          [
            userId,
            totalAllocation,
            `Allocated $${totalAllocation} to ${allocationResults.length} product(s)`,
            JSON.stringify({ allocations: allocationResults })
          ]
        );

        return NextResponse.json({
          success: true,
          message: `$${totalAllocation} allocated to ${allocationResults.length} product(s)`,
          remainingBudget,
          allocations: allocationResults
        });
      }

      return NextResponse.json(
        { error: 'Invalid action. Use "add_funds" or "allocate".' },
        { status: 400 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Budget allocation error:', error);
    return NextResponse.json(
      { error: 'Failed to process budget allocation', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get budget status and allocations
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get user budget
      const userResult = await client.query(
        'SELECT budget FROM users WHERE id = $1',
        [userId]
      );
      const totalBudget = parseFloat(userResult.rows[0]?.budget || '0');

      // Get product allocations
      const allocationsResult = await client.query(
        `SELECT 
           pba.product_id,
           p.name as product_name,
           pba.allocated_budget,
           pba.used_budget,
           pba.updated_at
         FROM product_budget_allocations pba
         JOIN products p ON p.id = pba.product_id
         WHERE pba.user_id = $1
         ORDER BY pba.updated_at DESC`,
        [userId]
      );

      const allocations = allocationsResult.rows.map((row: any) => ({
        productId: row.product_id,
        productName: row.product_name,
        allocated: parseFloat(row.allocated_budget || 0),
        used: parseFloat(row.used_budget || 0),
        available: parseFloat(row.allocated_budget || 0) - parseFloat(row.used_budget || 0),
        updatedAt: row.updated_at
      }));

      const totalAllocated = allocations.reduce((sum, a) => sum + a.allocated, 0);
      const totalUsed = allocations.reduce((sum, a) => sum + a.used, 0);
      const availableBudget = totalBudget - totalAllocated;

      // Get recent transactions
      const transactionsResult = await client.query(
        `SELECT transaction_type, amount, description, created_at, metadata
         FROM budget_transactions
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 10`,
        [userId]
      );

      const transactions = transactionsResult.rows.map((row: any) => ({
        type: row.transaction_type,
        amount: parseFloat(row.amount || 0),
        description: row.description,
        metadata: row.metadata ? JSON.parse(row.metadata) : null,
        timestamp: row.created_at
      }));

      return NextResponse.json({
        success: true,
        budget: {
          total: totalBudget,
          allocated: totalAllocated,
          used: totalUsed,
          available: availableBudget
        },
        allocations,
        recentTransactions: transactions
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get budget status error:', error);
    return NextResponse.json(
      { error: 'Failed to get budget status', details: error.message },
      { status: 500 }
    );
  }
}

