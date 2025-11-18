/**
 * Product Performance API
 * Tracks daily performance metrics per product
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

// POST - Save product performance data
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId,
      orders,
      revenue,
      expenses,
      profit,
      marketingSpend,
      seasonalityApplied,
      trendApplied
    } = body;

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
        'SELECT id FROM products WHERE id = $1 AND user_id = $2',
        [productId, userId]
      );

      if (productCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const today = new Date().toISOString().split('T')[0];

      // Upsert performance data
      await client.query(
        `INSERT INTO product_performance 
         (user_id, product_id, date, orders, revenue, expenses, profit, marketing_spend, seasonality_applied, trend_applied)
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

      // Update used budget in product_budget_allocations
      if (marketingSpend > 0) {
        await client.query(
          `UPDATE product_budget_allocations 
           SET used_budget = used_budget + $1,
               updated_at = CURRENT_TIMESTAMP
           WHERE user_id = $2 AND product_id = $3`,
          [marketingSpend, userId, productId]
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Product performance saved'
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Save product performance error:', error);
    return NextResponse.json(
      { error: 'Failed to save product performance', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get product performance data
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const days = parseInt(searchParams.get('days') || '30');

    const client = await pool.connect();
    try {
      let query = `
        SELECT 
          pp.*,
          p.name as product_name
        FROM product_performance pp
        JOIN products p ON p.id = pp.product_id
        WHERE pp.user_id = $1
      `;
      const params: any[] = [userId];

      if (productId) {
        query += ' AND pp.product_id = $2';
        params.push(parseInt(productId));
      }

      query += ` AND pp.date >= CURRENT_DATE - INTERVAL '${days} days'
                 ORDER BY pp.date DESC`;

      const result = await client.query(query, params);

      return NextResponse.json({
        success: true,
        performance: result.rows.map((row: any) => ({
          productId: row.product_id,
          productName: row.product_name,
          date: row.date,
          orders: row.orders,
          revenue: parseFloat(row.revenue || 0),
          expenses: parseFloat(row.expenses || 0),
          profit: parseFloat(row.profit || 0),
          marketingSpend: parseFloat(row.marketing_spend || 0),
          seasonalityApplied: parseFloat(row.seasonality_applied || 1.0),
          trendApplied: parseFloat(row.trend_applied || 1.0)
        }))
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get product performance error:', error);
    return NextResponse.json(
      { error: 'Failed to get product performance', details: error.message },
      { status: 500 }
    );
  }
}
