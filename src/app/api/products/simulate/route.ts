/**
 * Product Simulation API
 * Simulates sales and performance for selected products
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
    const { productIds, days = 30, marketingBudget = 0 } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Get products
      const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
      const productsResult = await client.query(
        `SELECT id, name, category, cost, selling_price, moq
         FROM products
         WHERE user_id = $1 AND id = ANY(ARRAY[${placeholders}])`,
        [userId, ...productIds]
      );

      if (productsResult.rows.length === 0) {
        return NextResponse.json({ error: 'Products not found' }, { status: 404 });
      }

      const products = productsResult.rows;

      // Simulate sales for each product
      const simulationResults = products.map((product) => {
        const profitMargin = product.selling_price > 0
          ? ((product.selling_price - product.cost) / product.selling_price) * 100
          : 0;

        // Simulate daily sales (based on profit margin, category, etc.)
        const baseDailySales = Math.random() * 5 + 1; // 1-6 sales per day
        const marginMultiplier = profitMargin > 30 ? 1.5 : profitMargin > 20 ? 1.2 : 1.0;
        const marketingMultiplier = 1 + (marketingBudget / 1000);
        
        const avgDailySales = baseDailySales * marginMultiplier * marketingMultiplier;
        const totalSales = Math.round(avgDailySales * days);
        
        const revenue = totalSales * product.selling_price;
        const costs = totalSales * product.cost;
        const shipping = totalSales * 5; // $5 per order
        const marketingSpend = (marketingBudget / days) * days;
        const expenses = costs + shipping + marketingSpend;
        const profit = revenue - expenses;
        const roi = marketingBudget > 0 ? ((profit - marketingSpend) / marketingSpend) * 100 : 0;

        return {
          productId: product.id,
          productName: product.name,
          category: product.category,
          days,
          totalSales,
          revenue,
          expenses,
          profit,
          profitMargin: profit > 0 ? (profit / revenue) * 100 : 0,
          roi,
          avgDailySales: avgDailySales.toFixed(1),
          marketingSpend
        };
      });

      // Calculate totals
      const totals = simulationResults.reduce((acc, result) => ({
        totalRevenue: acc.totalRevenue + result.revenue,
        totalExpenses: acc.totalExpenses + result.expenses,
        totalProfit: acc.totalProfit + result.profit,
        totalSales: acc.totalSales + result.totalSales
      }), { totalRevenue: 0, totalExpenses: 0, totalProfit: 0, totalSales: 0 });

      return NextResponse.json({
        success: true,
        results: simulationResults,
        totals,
        days,
        marketingBudget
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Product simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to simulate products', details: error.message },
      { status: 500 }
    );
  }
}

