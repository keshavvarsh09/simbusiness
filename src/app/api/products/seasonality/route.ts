/**
 * Product Seasonality API
 * Returns seasonality and trend factors for user's products
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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get user's active products with seasonality and trend factors
      const productsResult = await client.query(
        `SELECT 
           id as product_id,
           name,
           seasonality_factor,
           trend_factor,
           category
         FROM products 
         WHERE user_id = $1 AND active_in_dashboard = true
         ORDER BY created_at DESC`,
        [userId]
      );

      const products = productsResult.rows.map((row: any) => ({
        productId: row.product_id,
        productName: row.name,
        category: row.category,
        calculatedSeasonality: parseFloat(row.seasonality_factor || 1.0),
        currentTrend: parseFloat(row.trend_factor || 1.0)
      }));

      return NextResponse.json({
        success: true,
        products
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get seasonality error:', error);
    return NextResponse.json(
      { error: 'Failed to get seasonality data', details: error.message },
      { status: 500 }
    );
  }
}
