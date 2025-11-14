/**
 * Database Migration Endpoint
 * Ensures all required columns exist in the database
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      const migrations: string[] = [];

      // Check and add active_in_dashboard column to products table
      try {
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='products' AND column_name='active_in_dashboard'
        `);
        
        if (columnCheck.rows.length === 0) {
          await client.query(`
            ALTER TABLE products 
            ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
          `);
          migrations.push('Added active_in_dashboard column to products table');
          console.log('Migration: Added active_in_dashboard column');
        } else {
          migrations.push('active_in_dashboard column already exists');
        }
      } catch (e: any) {
        if (e.message?.includes('already exists') || e.message?.includes('duplicate')) {
          migrations.push('active_in_dashboard column already exists');
        } else {
          throw e;
        }
      }

      // Update existing products to have active_in_dashboard = true if NULL
      try {
        const updateResult = await client.query(`
          UPDATE products 
          SET active_in_dashboard = true 
          WHERE active_in_dashboard IS NULL
        `);
        if (updateResult.rowCount && updateResult.rowCount > 0) {
          migrations.push(`Updated ${updateResult.rowCount} existing products to be active in dashboard`);
        }
      } catch (e: any) {
        // Ignore if column doesn't exist yet (will be handled above)
        if (!e.message?.includes('column') && !e.message?.includes('does not exist')) {
          console.warn('Warning: Could not update existing products:', e.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Database migration completed',
        migrations
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        error: 'Migration failed', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check migration status
export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      const columnCheck = await client.query(`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns 
        WHERE table_name='products' AND column_name='active_in_dashboard'
      `);

      const hasColumn = columnCheck.rows.length > 0;
      
      // Check how many products have NULL active_in_dashboard
      let nullCount = 0;
      if (hasColumn) {
        const nullCheck = await client.query(`
          SELECT COUNT(*) as count
          FROM products
          WHERE active_in_dashboard IS NULL
        `);
        nullCount = parseInt(nullCheck.rows[0]?.count || '0');
      }

      return NextResponse.json({
        success: true,
        hasActiveInDashboardColumn: hasColumn,
        productsWithNullActiveStatus: nullCount,
        needsMigration: !hasColumn || nullCount > 0
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Migration status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check migration status', 
        details: error.message
      },
      { status: 500 }
    );
  }
}

