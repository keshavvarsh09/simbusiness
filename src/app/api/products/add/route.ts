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

      // Insert product
      const result = await client.query(
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
          'Multiple Suppliers',
          vendorPlatform || 'alibaba',
          JSON.stringify({
            vendorLinks,
            addedFrom: 'recommendations',
            profitMargin
          })
        ]
      );

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
    return NextResponse.json(
      { error: 'Failed to add product', details: error.message },
      { status: 500 }
    );
  }
}

