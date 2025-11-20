/**
 * Product Performance API
 * Saves product performance metrics from simulation
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, orders, revenue, expenses, profit, marketingSpend, seasonalityApplied, trendApplied } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Verify product belongs to user
    const client = await pool.connect();
    try {
      const productCheck = await client.query(
        'SELECT id FROM products WHERE id = $1 AND user_id = $2',
        [productId, userId]
      );

      if (productCheck.rows.length === 0) {
        return NextResponse.json(
          { error: 'Product not found or access denied' },
          { status: 404 }
        );
      }

      // Save performance data for today
      const today = new Date().toISOString().split('T')[0];
      
      await client.query(
        `INSERT INTO product_performance (
          user_id, product_id, date, orders, revenue, expenses, profit, 
          marketing_spend, seasonality_applied, trend_applied
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (user_id, product_id, date) 
        DO UPDATE SET
          orders = EXCLUDED.orders,
          revenue = EXCLUDED.revenue,
          expenses = EXCLUDED.expenses,
          profit = EXCLUDED.profit,
          marketing_spend = EXCLUDED.marketing_spend,
          seasonality_applied = EXCLUDED.seasonality_applied,
          trend_applied = EXCLUDED.trend_applied`,
        [
          userId,
          productId,
          today,
          orders || 0,
          revenue || 0,
          expenses || 0,
          profit || 0,
          marketingSpend || 0,
          seasonalityApplied || 1.0,
          trendApplied || 1.0
        ]
      );

      return NextResponse.json({
        success: true,
        message: 'Performance data saved'
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Save performance error:', error);
    return NextResponse.json(
      { error: 'Failed to save performance data', details: error.message },
      { status: 500 }
    );
  }
}
