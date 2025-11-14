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
          try {
            await client.query(`
              ALTER TABLE products 
              ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
            `);
            console.log('Successfully added active_in_dashboard column');
            
            // Update existing products to be active by default
            await client.query(`
              UPDATE products 
              SET active_in_dashboard = true 
              WHERE active_in_dashboard IS NULL
            `);
          } catch (alterError: any) {
            // If ALTER fails, it might be a permission issue or the column was just added
            if (!alterError.message?.includes('already exists') && !alterError.message?.includes('duplicate')) {
              console.error('Failed to add active_in_dashboard column:', alterError.message);
              throw alterError;
            }
          }
        }
      } catch (e: any) {
        // If error is not about column already existing, log it and try to continue
        if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) {
          console.warn('Warning: Could not ensure active_in_dashboard column exists:', e.message);
          // Don't throw - try to continue with the update
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
        // If error is about table or column not existing, try to fix it
        if (updateError.message?.includes('active_in_dashboard') || 
            updateError.message?.includes('column') || 
            updateError.message?.includes('does not exist') ||
            updateError.message?.includes('relation')) {
          console.warn('Database schema issue detected, attempting to fix...');
          
          try {
            // First, ensure the table exists by trying to initialize
            try {
              await client.query('SELECT 1 FROM products LIMIT 1');
             } catch (tableCheckError: any) {
               if (tableCheckError.message?.includes('does not exist') || tableCheckError.message?.includes('relation')) {
                 console.log('Products table not found, initializing database...');
                 
                 // Check if DATABASE_URL is configured
                 if (!process.env.DATABASE_URL) {
                   throw new Error('DATABASE_URL environment variable is not set. Please configure your database connection in Vercel environment variables.');
                 }
                 
                 try {
                   const { initDatabase } = await import('@/lib/db');
                   await initDatabase();
                   console.log('Database initialized successfully');
                   
                   // Verify the table was created
                   await client.query('SELECT 1 FROM products LIMIT 1');
                   console.log('Verified products table exists after initialization');
                 } catch (initError: any) {
                   console.error('Database initialization failed:', initError.message);
                   console.error('Init error stack:', initError.stack);
                   
                   // Provide specific error details
                   if (initError.message?.includes('connection') || 
                       initError.message?.includes('timeout') ||
                       initError.message?.includes('ECONNREFUSED')) {
                     throw new Error('Database connection failed. Please check your DATABASE_URL and ensure the database server is accessible.');
                   }
                   
                   if (initError.message?.includes('permission') || initError.message?.includes('denied')) {
                     throw new Error('Database permission denied. Please check your database user has CREATE TABLE permissions.');
                   }
                   
                   if (initError.message?.includes('authentication') || initError.message?.includes('password')) {
                     throw new Error('Database authentication failed. Please check your DATABASE_URL credentials.');
                   }
                   
                   // Re-throw with more context
                   throw new Error(`Database initialization failed: ${initError.message}`);
                 }
               } else {
                 throw tableCheckError;
               }
             }
            
            // Now try to add the column if it doesn't exist
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
                console.log('Added active_in_dashboard column');
                
                // Update existing products
                await client.query(`
                  UPDATE products 
                  SET active_in_dashboard = true 
                  WHERE active_in_dashboard IS NULL
                `);
              }
            } catch (columnError: any) {
              if (!columnError.message?.includes('already exists') && !columnError.message?.includes('duplicate')) {
                console.warn('Column check/add failed:', columnError.message);
              }
            }
            
            // Retry the update
            result = await client.query(
              `UPDATE products 
               SET active_in_dashboard = $1
               WHERE user_id = $2 AND id = ANY(ARRAY[${placeholders}])
               RETURNING id, name, active_in_dashboard`,
              [active, userId, ...numericIds]
            );
            
            console.log('Successfully fixed schema and updated products');
          } catch (retryError: any) {
            console.error('Failed to fix schema and retry:', retryError.message);
            console.error('Retry error stack:', retryError.stack);
            
            // Check for specific error types
            let errorMessage = 'Database schema error';
            let errorDetails = 'Could not fix database schema.';
            let hint = 'Please try again or contact support.';
            
            if (retryError.message?.includes('permission') || retryError.message?.includes('denied')) {
              errorMessage = 'Database permission error';
              errorDetails = 'The database user does not have permission to modify the database.';
              hint = 'Please contact your database administrator.';
            } else if (retryError.message?.includes('relation') || retryError.message?.includes('does not exist')) {
              errorMessage = 'Database initialization failed';
              errorDetails = 'Could not create required database tables.';
              hint = 'Please check your database connection and try again. If the problem persists, contact support.';
            }
            
            return NextResponse.json({
              error: errorMessage,
              details: errorDetails,
              hint: hint,
              migrationEndpoint: '/api/migrate',
              initEndpoint: '/api/init-db',
              retryError: process.env.NODE_ENV === 'development' ? retryError.message : undefined
            }, { status: 500 });
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
      errorDetails = 'The database tables may not exist or are outdated.';
      
      // Try to auto-initialize if we haven't already
      try {
        const { initDatabase } = await import('@/lib/db');
        await initDatabase();
        errorDetails = 'Database has been automatically initialized. Please try your operation again.';
        errorMessage = 'Database initialized';
      } catch (initError: any) {
        errorDetails = 'Could not automatically initialize database. Please run /api/init-db manually.';
      }
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

