/**
 * Toggle Product Active Status for Dashboard
 * Marks products as active/inactive for dashboard calculations
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
    const { productIds, active } = body; // active: boolean

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    if (typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'Active status (true/false) is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // First, ensure the column exists
      try {
        await client.query(`
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS active_in_dashboard BOOLEAN DEFAULT true
        `);
      } catch (e) {
        // Column might already exist, ignore
      }

      // Convert product IDs (remove 'P' prefix if present)
      const numericIds = productIds.map((id: string | number) => {
        const idStr = String(id);
        return idStr.startsWith('P') ? parseInt(idStr.substring(1)) : parseInt(idStr);
      });

      const placeholders = numericIds.map((_, i) => `$${i + 2}`).join(',');
      
      // Update products
      const result = await client.query(
        `UPDATE products 
         SET active_in_dashboard = $1
         WHERE user_id = $2 AND id = ANY(ARRAY[${placeholders}])
         RETURNING id, name, active_in_dashboard`,
        [active, userId, ...numericIds]
      );

      return NextResponse.json({
        success: true,
        message: `${result.rows.length} product(s) ${active ? 'added to' : 'removed from'} dashboard`,
        updated: result.rows.length
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Toggle dashboard products error:', error);
    return NextResponse.json(
      { error: 'Failed to update products', details: error.message },
      { status: 500 }
    );
  }
}

