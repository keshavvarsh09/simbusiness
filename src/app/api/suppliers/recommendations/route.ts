/**
 * Supplier Recommendations API
 * Generates AI-powered supplier recommendations based on user's products
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateSupplierRecommendations } from '@/lib/supplier-generator';

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

    const { searchParams } = new URL(request.url);
    const preferredLocations = searchParams.get('locations')?.split(',') || [];

    const client = await pool.connect();
    try {
      // Get user's products
      const productsResult = await client.query(
        'SELECT name, category FROM products WHERE user_id = $1',
        [userId]
      );

      if (productsResult.rows.length === 0) {
        return NextResponse.json({
          success: true,
          suppliers: [],
          message: 'Add products first to get supplier recommendations'
        });
      }

      // Get user's budget
      const userResult = await client.query(
        'SELECT budget FROM users WHERE id = $1',
        [userId]
      );
      const budget = userResult.rows[0]?.budget || undefined;

      // Generate supplier recommendations
      const suppliers = await generateSupplierRecommendations(
        productsResult.rows,
        budget,
        preferredLocations.length > 0 ? preferredLocations : undefined
      );

      return NextResponse.json({
        success: true,
        suppliers
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Supplier recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get supplier recommendations', details: error.message },
      { status: 500 }
    );
  }
}

