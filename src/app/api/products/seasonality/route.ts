/**
 * Product Seasonality & Trends API
 * Calculates and updates seasonality/trend factors for products
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

// Calculate seasonality based on current month and product category
function calculateSeasonality(category: string, month: number): number {
  const seasonalCategories: Record<string, number[]> = {
    'electronics': [0.8, 0.7, 0.9, 1.0, 1.1, 1.2, 1.3, 1.2, 1.1, 1.2, 1.4, 1.5], // Peak in Nov/Dec
    'fashion': [0.6, 0.7, 1.0, 1.1, 1.2, 1.1, 0.9, 0.8, 1.0, 1.1, 1.3, 1.4], // Peak in Nov/Dec
    'home': [0.9, 0.8, 1.0, 1.2, 1.3, 1.1, 0.9, 0.9, 1.0, 1.1, 1.2, 1.3], // Peak in spring/summer
    'beauty': [0.8, 0.9, 1.0, 1.1, 1.2, 1.1, 1.0, 0.9, 1.0, 1.1, 1.2, 1.3], // Steady with holiday boost
    'fitness': [1.3, 1.4, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 1.1, 1.0, 1.2], // Peak in Jan/Feb (New Year)
    'toys': [0.7, 0.6, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.9, 1.3, 1.5], // Peak in Nov/Dec
    'general': [1.0, 0.9, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2] // Neutral with holiday boost
  };

  const factors = seasonalCategories[category.toLowerCase()] || seasonalCategories['general'];
  return factors[month - 1] || 1.0;
}

// Calculate trend factor based on recent performance
function calculateTrend(recentOrders: number[], recentRevenue: number[]): number {
  if (recentOrders.length < 3) return 1.0;

  // Calculate if orders/revenue are trending up or down
  const orderTrend = recentOrders.slice(-3).reduce((sum, val, idx, arr) => {
    if (idx === 0) return 0;
    return sum + (val - arr[idx - 1]);
  }, 0) / (recentOrders.length - 1);

  const revenueTrend = recentRevenue.slice(-3).reduce((sum, val, idx, arr) => {
    if (idx === 0) return 0;
    return sum + (val - arr[idx - 1]);
  }, 0) / (recentRevenue.length - 1);

  // Normalize trend (0.8 to 1.5 range)
  const trendScore = 1.0 + (orderTrend * 0.1) + (revenueTrend * 0.001);
  return Math.max(0.8, Math.min(1.5, trendScore));
}

// GET - Get seasonality and trend factors for all products
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get all user products
      const productsResult = await client.query(
        'SELECT id, name, category, seasonality_factor, trend_factor FROM products WHERE user_id = $1',
        [userId]
      );

      const currentMonth = new Date().getMonth() + 1;
      const products = productsResult.rows.map((row: any) => {
        const category = row.category || 'general';
        const seasonality = calculateSeasonality(category, currentMonth);
        
        return {
          productId: row.id,
          productName: row.name,
          category,
          currentSeasonality: parseFloat(row.seasonality_factor || 1.0),
          calculatedSeasonality: seasonality,
          currentTrend: parseFloat(row.trend_factor || 1.0),
          month: currentMonth
        };
      });

      return NextResponse.json({
        success: true,
        products,
        currentMonth,
        seasonalityInfo: {
          'electronics': 'Peak in Nov/Dec (holiday shopping)',
          'fashion': 'Peak in Nov/Dec, spring collections',
          'home': 'Peak in spring/summer',
          'beauty': 'Steady with holiday boost',
          'fitness': 'Peak in Jan/Feb (New Year resolutions)',
          'toys': 'Peak in Nov/Dec (holiday season)',
          'general': 'Neutral with slight holiday boost'
        }
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

// POST - Update seasonality and trend factors
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updateAll, productId, seasonalityFactor, trendFactor } = body;

    const client = await pool.connect();
    try {
      const currentMonth = new Date().getMonth() + 1;

      if (updateAll) {
        // Update all products with calculated seasonality
        const productsResult = await client.query(
          'SELECT id, category FROM products WHERE user_id = $1',
          [userId]
        );

        for (const product of productsResult.rows) {
          const category = product.category || 'general';
          const seasonality = calculateSeasonality(category, currentMonth);
          
          // Get recent performance for trend calculation
          const performanceResult = await client.query(
            `SELECT orders, revenue FROM product_performance 
             WHERE user_id = $1 AND product_id = $2 
             ORDER BY date DESC LIMIT 7`,
            [userId, product.id]
          );

          let trend = 1.0;
          if (performanceResult.rows.length >= 3) {
            const orders = performanceResult.rows.map((r: any) => r.orders || 0);
            const revenue = performanceResult.rows.map((r: any) => parseFloat(r.revenue || 0));
            trend = calculateTrend(orders, revenue);
          }

          await client.query(
            'UPDATE products SET seasonality_factor = $1, trend_factor = $2 WHERE id = $3',
            [seasonality, trend, product.id]
          );
        }

        return NextResponse.json({
          success: true,
          message: `Updated seasonality and trends for ${productsResult.rows.length} products`,
          updated: productsResult.rows.length
        });
      } else if (productId) {
        // Update specific product
        const productResult = await client.query(
          'SELECT category FROM products WHERE id = $1 AND user_id = $2',
          [productId, userId]
        );

        if (productResult.rows.length === 0) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const category = productResult.rows[0].category || 'general';
        const seasonality = seasonalityFactor || calculateSeasonality(category, currentMonth);
        const trend = trendFactor || 1.0;

        await client.query(
          'UPDATE products SET seasonality_factor = $1, trend_factor = $2 WHERE id = $3',
          [seasonality, trend, productId]
        );

        return NextResponse.json({
          success: true,
          message: 'Product factors updated',
          productId,
          seasonality,
          trend
        });
      }

      return NextResponse.json(
        { error: 'Invalid request. Provide updateAll=true or productId' },
        { status: 400 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Update seasonality error:', error);
    return NextResponse.json(
      { error: 'Failed to update seasonality', details: error.message },
      { status: 500 }
    );
  }
}

