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

    // If not authenticated, return demo products for learning
    if (!userId) {
      const demoProducts = [
        {
          id: 'DEMO1',
          name: 'Posture Corrector Pro',
          category: 'Health',
          cost: 8.50,
          potentialPrice: 29.99,
          rating: 4.5,
          profitMargin: 72,
          moq: 10,
          vendorPlatform: 'AliExpress',
          activeInDashboard: true,
          description: 'Trending health product with high margins',
        },
        {
          id: 'DEMO2',
          name: 'LED Strip Lights RGB',
          category: 'Home',
          cost: 5.20,
          potentialPrice: 24.99,
          rating: 4.3,
          profitMargin: 79,
          moq: 20,
          vendorPlatform: 'Alibaba',
          activeInDashboard: true,
          description: 'Popular home decor item',
        },
        {
          id: 'DEMO3',
          name: 'Wireless Earbuds TWS',
          category: 'Electronics',
          cost: 12.00,
          potentialPrice: 39.99,
          rating: 4.2,
          profitMargin: 70,
          moq: 50,
          vendorPlatform: 'AliExpress',
          activeInDashboard: false,
          description: 'Budget electronics with good reviews',
        },
      ];

      return NextResponse.json({
        success: true,
        products: demoProducts,
        categories: ['Health', 'Home', 'Electronics'],
        isDemo: true,
        message: 'Showing demo products. Sign in to add your own.',
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

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
      // Ensure active_in_dashboard column exists
      try {
        await client.query(`
              ALTER TABLE products 
              ADD COLUMN IF NOT EXISTS active_in_dashboard BOOLEAN DEFAULT true
            `);
      } catch (e) {
        // Column might already exist, ignore
      }

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
              active_in_dashboard,
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
            profitMargin, // Add profit margin for filtering
            activeInDashboard: row.active_in_dashboard !== false // Default to true if null
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

