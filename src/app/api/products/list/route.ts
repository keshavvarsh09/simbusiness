/**
 * Get user's products from database
 * Returns products that the user has analyzed or added to their simulation
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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const client = await pool.connect();
    try {
          let query = `
            SELECT 
              id,
              name,
              category,
              cost,
              selling_price,
              moq,
              vendor_name,
              vendor_platform,
              source_url,
              gemini_analysis,
              created_at
            FROM products
            WHERE user_id = $1
          `;
      
      const params: any[] = [userId];
      
      if (category && category !== 'all') {
        query += ' AND category = $2';
        params.push(category);
      }
      
      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, params);

          // Transform to match Product interface
          const products = result.rows
            .map((row) => {
              const cost = parseFloat(row.cost || 0);
              const price = parseFloat(row.selling_price || row.cost * 1.5 || 0);
              const profitMargin = price > 0 ? ((price - cost) / price) * 100 : 0;
              
              // Extract vendor links from gemini_analysis if available
              let vendorLinks: any = null;
              if (row.gemini_analysis) {
                try {
                  const analysis = typeof row.gemini_analysis === 'string' 
                    ? JSON.parse(row.gemini_analysis) 
                    : row.gemini_analysis;
                  vendorLinks = analysis.vendorLinks || null;
                } catch (e) {
                  // Ignore parse errors
                }
              }
              
              // Try to get image URL from vendor links
              let imageUrl: string | null = null;
              if (vendorLinks) {
                // Use first available vendor link as image source hint
                imageUrl = vendorLinks.alibaba || vendorLinks.aliexpress || vendorLinks.indiamart || null;
              }
              
              return {
                id: `P${row.id}`,
                name: row.name,
                category: row.category || 'Unknown',
                cost,
                potentialPrice: price,
                rating: 4.0, // Default rating
                imageUrl: imageUrl || row.source_url || null, // Use source URL as fallback
                description: null,
                moq: row.moq || 0,
                vendorName: row.vendor_name,
                vendorPlatform: row.vendor_platform,
                sourceUrl: row.source_url || imageUrl, // Use source URL or vendor link
                profitMargin // Add profit margin for filtering
              };
            })
            .filter(product => product.profitMargin > 0); // Filter out negative profit products

      // Get unique categories
      const categoriesResult = await client.query(
        'SELECT DISTINCT category FROM products WHERE user_id = $1 AND category IS NOT NULL',
        [userId]
      );
      const categories = categoriesResult.rows.map(row => row.category).filter(Boolean);

      return NextResponse.json({
        success: true,
        products,
        categories
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  }
}

