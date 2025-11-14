import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
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

/**
 * Add product to user's simulation with one click
 * Accepts product data from recommendations
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      category,
      estimatedCost,
      sellingPrice,
      sourceUrl,
      vendorPlatform,
      vendorName,
      moq,
      searchTerms,
      alibabaUrl,
      aliexpressUrl,
      indiamartUrl
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Product name is required' },
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

      // Calculate profit margin if not provided
      const cost = parseFloat(estimatedCost || 0);
      const price = parseFloat(sellingPrice || 0);
      const profitMargin = price > 0 ? ((price - cost) / price) * 100 : 0;

      // Store vendor links in a structured format
      const vendorLinks = {
        alibaba: alibabaUrl || null,
        aliexpress: aliexpressUrl || null,
        indiamart: indiamartUrl || null,
        searchTerms: searchTerms || null
      };

      // Get vendor name from body or use default
      const vendorName = body.vendorName || 'Multiple Suppliers';
      const finalVendorPlatform = vendorPlatform || 'alibaba';

      // Insert product - try with active_in_dashboard first, fallback without it
      let result;
      try {
        result = await client.query(
          `INSERT INTO products (
            user_id, name, category, source_url, cost, selling_price, moq,
            vendor_name, vendor_platform, gemini_analysis, active_in_dashboard
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id`,
          [
            userId,
            name,
            category || 'General',
            sourceUrl || alibabaUrl || aliexpressUrl || indiamartUrl || null,
            cost,
            price,
            moq || 1,
            vendorName,
            finalVendorPlatform,
            JSON.stringify({
              vendorLinks,
              addedFrom: 'recommendations',
              profitMargin
            }),
            true // active_in_dashboard - new products are active by default
          ]
        );
      } catch (insertError: any) {
        // If error is about active_in_dashboard column, try without it
        if (insertError.message?.includes('active_in_dashboard') || insertError.message?.includes('column')) {
          console.warn('Retrying insert without active_in_dashboard column');
          result = await client.query(
            `INSERT INTO products (
              user_id, name, category, source_url, cost, selling_price, moq,
              vendor_name, vendor_platform, gemini_analysis
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id`,
            [
              userId,
              name,
              category || 'General',
              sourceUrl || alibabaUrl || aliexpressUrl || indiamartUrl || null,
              cost,
              price,
              moq || 1,
              vendorName,
              finalVendorPlatform,
              JSON.stringify({
                vendorLinks,
                addedFrom: 'recommendations',
                profitMargin
              })
            ]
          );
        } else {
          throw insertError; // Re-throw if it's a different error
        }
      }

      return NextResponse.json({
        success: true,
        productId: result.rows[0].id,
        message: 'Product added to simulation successfully'
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error adding product:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to add product';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.message?.includes('column') || error.message?.includes('does not exist')) {
      errorMessage = 'Database schema error';
      errorDetails = 'The products table structure may be outdated. Please contact support.';
    } else if (error.message?.includes('null value') || error.message?.includes('NOT NULL')) {
      errorMessage = 'Missing required field';
      errorDetails = 'Please ensure all required fields are filled.';
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

