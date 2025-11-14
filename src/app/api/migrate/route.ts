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
      let columnAdded = false;

      // Check and add active_in_dashboard column to products table
      try {
        const columnCheck = await client.query(`
          SELECT column_name, data_type, column_default
          FROM information_schema.columns 
          WHERE table_name='products' AND column_name='active_in_dashboard'
        `);
        
        if (columnCheck.rows.length === 0) {
          // Column doesn't exist, try to add it
          try {
            await client.query(`
              ALTER TABLE products 
              ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
            `);
            migrations.push('Added active_in_dashboard column to products table');
            console.log('Migration: Added active_in_dashboard column');
            columnAdded = true;
          } catch (alterError: any) {
            // Check if it's a permission error
            if (alterError.message?.includes('permission') || alterError.message?.includes('denied')) {
              return NextResponse.json({
                error: 'Database permission error',
                details: 'The database user does not have permission to alter the products table. Please contact your database administrator.',
                hint: 'You may need to run this migration manually with a database admin account.'
              }, { status: 403 });
            }
            
            // Check if column was added by another process
            if (alterError.message?.includes('already exists') || alterError.message?.includes('duplicate')) {
              migrations.push('active_in_dashboard column already exists (added by another process)');
              columnAdded = true;
            } else {
              throw alterError;
            }
          }
        } else {
          migrations.push('active_in_dashboard column already exists');
          columnAdded = true;
        }
      } catch (e: any) {
        if (e.message?.includes('already exists') || e.message?.includes('duplicate')) {
          migrations.push('active_in_dashboard column already exists');
          columnAdded = true;
        } else {
          console.error('Column check error:', e);
          throw e;
        }
      }

      // Update existing products to have active_in_dashboard = true if NULL
      if (columnAdded) {
        try {
          const updateResult = await client.query(`
            UPDATE products 
            SET active_in_dashboard = true 
            WHERE active_in_dashboard IS NULL
          `);
          if (updateResult.rowCount && updateResult.rowCount > 0) {
            migrations.push(`Updated ${updateResult.rowCount} existing products to be active in dashboard`);
          } else {
            migrations.push('No products needed updating (all already have active_in_dashboard set)');
          }
        } catch (e: any) {
          // Ignore if column doesn't exist yet (shouldn't happen if columnAdded is true)
          if (e.message?.includes('column') || e.message?.includes('does not exist')) {
            migrations.push('Warning: Could not update existing products - column may not be fully created');
          } else {
            console.warn('Warning: Could not update existing products:', e.message);
            migrations.push(`Warning: Could not update existing products: ${e.message}`);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Database migration completed',
        migrations,
        columnExists: columnAdded
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Migration failed';
    let errorDetails = error.message || 'Unknown error';
    let hint = '';
    
    if (error.message?.includes('permission') || error.message?.includes('denied')) {
      errorMessage = 'Database permission error';
      hint = 'The database user does not have ALTER TABLE permissions. Please contact your database administrator or use a database admin account.';
    } else if (error.message?.includes('connection') || error.message?.includes('timeout')) {
      errorMessage = 'Database connection error';
      hint = 'Could not connect to the database. Check DATABASE_URL and network connectivity.';
    } else if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
      errorMessage = 'Table does not exist';
      hint = 'The products table does not exist. Please run /api/init-db first to create the database schema.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage, 
        details: errorDetails,
        hint: hint || 'Check the error details above for more information.',
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

