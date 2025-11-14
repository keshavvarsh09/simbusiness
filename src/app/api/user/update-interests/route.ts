/**
 * Update User Interests (Budget and Product Genre)
 * Allows users to change their product genre and budget for recommendations
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
    const { budget, productGenre } = body;

    if (budget === undefined && productGenre === undefined) {
      return NextResponse.json(
        { error: 'At least one field (budget or productGenre) must be provided' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (budget !== undefined) {
        updates.push(`budget = $${paramIndex}`);
        values.push(parseFloat(budget));
        paramIndex++;
      }

      if (productGenre !== undefined) {
        updates.push(`product_genre = $${paramIndex}`);
        values.push(productGenre);
        paramIndex++;
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(userId);

      const updateQuery = `
        UPDATE users 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING id, email, name, budget, product_genre
      `;

      const result = await client.query(updateQuery, values);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Interests updated successfully',
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          name: result.rows[0].name,
          budget: parseFloat(result.rows[0].budget || 0),
          productGenre: result.rows[0].product_genre
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error updating user interests:', error);
    return NextResponse.json(
      { error: 'Failed to update interests', details: error.message },
      { status: 500 }
    );
  }
}

