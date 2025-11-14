/**
 * Get User Products for Simulation
 * Returns products with their actual cost and selling prices for calculations
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
      // Auto-initialize database if products table doesn't exist
      try {
        await client.query('SELECT 1 FROM products LIMIT 1');
      } catch (tableError: any) {
        if (tableError.message?.includes('does not exist') || tableError.message?.includes('relation')) {
          console.log('Products table not found, initializing database...');
          const { initDatabase } = await import('@/lib/db');
          await initDatabase();
          console.log('Database initialized successfully');
        } else {
          throw tableError;
        }
      }
      
      // Ensure active_in_dashboard column exists
      try {
        await client.query(`
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS active_in_dashboard BOOLEAN DEFAULT true
        `);
      } catch (e) {
        // Column might already exist, ignore
      }

      // Get only active products for dashboard (or all if none are marked)
      const result = await client.query(
        `SELECT id, name, cost, selling_price, moq, category, active_in_dashboard
         FROM products
         WHERE user_id = $1 
           AND (active_in_dashboard = true OR active_in_dashboard IS NULL)
         ORDER BY created_at DESC`,
        [userId]
      );

      const products = result.rows.map(row => ({
        id: row.id,
        name: row.name,
        cost: parseFloat(row.cost || 0),
        sellingPrice: parseFloat(row.selling_price || row.cost * 1.5 || 0),
        moq: parseInt(row.moq || 0),
        category: row.category || 'General'
      }));

      // Calculate average values for simulation
      const avgCost = products.length > 0
        ? products.reduce((sum, p) => sum + p.cost, 0) / products.length
        : 0;
      const avgSellingPrice = products.length > 0
        ? products.reduce((sum, p) => sum + p.sellingPrice, 0) / products.length
        : 0;
      const avgProfitMargin = avgSellingPrice > 0
        ? ((avgSellingPrice - avgCost) / avgSellingPrice) * 100
        : 0;

      return NextResponse.json({
        success: true,
        products,
        averages: {
          cost: avgCost,
          sellingPrice: avgSellingPrice,
          profitMargin: avgProfitMargin
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get user products error:', error);
    return NextResponse.json(
      { error: 'Failed to get products', details: error.message },
      { status: 500 }
    );
  }
}

