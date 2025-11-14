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
      // Ensure active_in_dashboard column exists (use IF NOT EXISTS for safety)
      try {
        await client.query(`
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS active_in_dashboard BOOLEAN DEFAULT true
        `);
        console.log('Ensured active_in_dashboard column exists');
      } catch (e: any) {
        // Column might already exist, that's fine
        if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) {
          console.warn('Warning: Could not ensure active_in_dashboard column:', e.message);
        }
      }

      // Convert product IDs (remove 'P' prefix if present) and ensure they're integers
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

      // Update products - use proper type casting for the array
      let result;
      try {
        result = await client.query(
          `UPDATE products 
           SET active_in_dashboard = $1
           WHERE user_id = $2 AND id = ANY($3::int[])
           RETURNING id, name, active_in_dashboard`,
          [active, userId, numericIds]
        );
      } catch (updateError: any) {
        // If error is about column not existing, try to add it and retry
        if (updateError.message?.includes('active_in_dashboard') || 
            updateError.message?.includes('column') && updateError.message?.includes('does not exist')) {
          console.warn('active_in_dashboard column missing, adding it...');
          
          try {
            await client.query(`
              ALTER TABLE products 
              ADD COLUMN IF NOT EXISTS active_in_dashboard BOOLEAN DEFAULT true
            `);
            
            // Retry the update
            result = await client.query(
              `UPDATE products 
               SET active_in_dashboard = $1
               WHERE user_id = $2 AND id = ANY($3::int[])
               RETURNING id, name, active_in_dashboard`,
              [active, userId, numericIds]
            );
            
            console.log('Successfully added column and updated products');
          } catch (retryError: any) {
            console.error('Failed to add column and retry:', retryError.message);
            throw new Error(`Failed to update products: ${retryError.message}`);
          }
        } else {
          throw updateError; // Re-throw if it's a different error
        }
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
    
    if (error.message?.includes('column') || error.message?.includes('does not exist') || error.message?.includes('relation')) {
      errorMessage = 'Database schema error';
      errorDetails = error.message || 'The database tables may not exist or are outdated.';
      // Don't try to auto-initialize - database should already be set up
      // User should visit /api/init-db if needed
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

