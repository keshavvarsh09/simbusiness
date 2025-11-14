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
  let body: any = null;
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
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
      // Ensure active_in_dashboard column exists (handle different PostgreSQL versions)
      try {
        // Check if column exists first
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='products' AND column_name='active_in_dashboard'
        `);
        
        if (columnCheck.rows.length === 0) {
          // Column doesn't exist, add it
          await client.query(`
            ALTER TABLE products 
            ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
          `);
        }
      } catch (e: any) {
        // If error is not about column already existing, log it
        if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) {
          console.warn('Warning: Could not ensure active_in_dashboard column exists:', e.message);
        }
      }

      // Convert product IDs (remove 'P' prefix if present)
      const numericIds = productIds.map((id: string | number) => {
        const idStr = String(id);
        const numId = idStr.startsWith('P') ? parseInt(idStr.substring(1)) : parseInt(idStr);
        if (isNaN(numId)) {
          throw new Error(`Invalid product ID: ${id}`);
        }
        return numId;
      });

      if (numericIds.length === 0) {
        return NextResponse.json(
          { error: 'No valid product IDs provided' },
          { status: 400 }
        );
      }

      // Build the query with proper placeholders
      const placeholders = numericIds.map((_, i) => `$${i + 3}`).join(',');
      
      // Update products - try with active_in_dashboard first, fallback without it
      let result;
      try {
        result = await client.query(
          `UPDATE products 
           SET active_in_dashboard = $1
           WHERE user_id = $2 AND id = ANY(ARRAY[${placeholders}])
           RETURNING id, name, active_in_dashboard`,
          [active, userId, ...numericIds]
        );
      } catch (updateError: any) {
        // If error is about active_in_dashboard column, try updating without it
        if (updateError.message?.includes('active_in_dashboard') || updateError.message?.includes('column')) {
          console.warn('active_in_dashboard column not available, skipping update');
          // Return success but with 0 updated (column doesn't exist yet)
          return NextResponse.json({
            success: true,
            message: 'Column not available yet. Products will be active by default.',
            updated: 0
          });
        }
        throw updateError; // Re-throw if it's a different error
      }

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: 'No products found with the provided IDs', details: 'Products may not exist or belong to another user' },
          { status: 404 }
        );
      }

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
    console.error('Error stack:', error.stack);
    if (body) {
      console.error('Request body:', body);
    }
    
    // Provide more detailed error information
    let errorMessage = 'Failed to update products';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.message?.includes('column') || error.message?.includes('does not exist')) {
      errorMessage = 'Database schema error';
      errorDetails = 'The products table structure may be outdated. The column will be created automatically on next product addition.';
    } else if (error.message?.includes('Invalid product ID')) {
      errorMessage = 'Invalid product ID';
      errorDetails = error.message;
    } else if (error.message?.includes('foreign key') || error.message?.includes('user_id')) {
      errorMessage = 'User authentication error';
      errorDetails = 'Invalid user session. Please try logging in again.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

