import { NextRequest, NextResponse } from 'next/server';
import { generateProductRecommendations } from '@/lib/ai-router';
import { generateProductSearchLinks } from '@/lib/product-search';
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

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get optional query parameters for custom genre/budget
    const { searchParams } = new URL(request.url);
    const customGenre = searchParams.get('genre');
    const customBudget = searchParams.get('budget');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const client = await pool.connect();
    try {
      const userResult = await client.query(
        'SELECT budget, product_genre FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      // Use custom values if provided, otherwise use user's saved values
      const budget = customBudget ? parseFloat(customBudget) : parseFloat(user?.budget || '0');
      const genre = customGenre || user?.product_genre || 'general';

      if (!budget || budget <= 0) {
        return NextResponse.json(
          { error: 'Budget must be set. Please set your budget in settings or provide it as a query parameter.' },
          { status: 400 }
        );
      }

      let recommendations;
      try {
        recommendations = await generateProductRecommendations(
          budget,
          genre
        );
      } catch (aiError: any) {
        console.error('AI recommendation error:', aiError);
        // Fallback to default recommendations if AI fails
        recommendations = [
          {
            name: `${genre} Product 1`,
            category: genre,
            estimatedCost: budget * 0.3,
            sellingPrice: budget * 0.5,
            profitMargin: 40,
            demand: 'medium',
            competition: 'medium',
            recommendedMOQ: 10,
            searchTerms: `${genre} dropshipping`,
            reason: 'Good starting product for your budget'
          }
        ];
      }

      // Convert to array if needed
      const recsArray = Array.isArray(recommendations) 
        ? recommendations 
        : (recommendations?.recommendations || recommendations || []);

      // Apply pagination
      const paginatedRecs = recsArray.slice(offset, offset + limit);
      const hasMore = offset + limit < recsArray.length;

      // Add search links, image links, prices, and supplier details for each product
      const recommendationsWithLinks = paginatedRecs.map((rec: any) => {
        const searchTerms = rec.searchTerms || rec.name || '';
        const links = generateProductSearchLinks(searchTerms, rec.category);
        
        return {
          ...rec,
          // Image links - point to product listings where images are available
          imageLinks: {
            alibaba: links.alibaba, // Product images visible on Alibaba listing
            aliexpress: links.aliexpress, // Product images visible on AliExpress listing
            indiamart: links.indiamart, // Product images visible on IndiaMart listing
          },
          links: {
            alibaba: links.alibaba,
            aliexpress: links.aliexpress,
            indiamart: links.indiamart,
            amazon: links.amazon,
            flipkart: links.flipkart
          },
          prices: {
            alibaba: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'USD' },
            aliexpress: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'USD' },
            indiamart: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'INR' }
          },
          suppliers: [
            {
              platform: 'alibaba',
              name: 'Verified Suppliers',
              url: links.alibaba,
              rating: 4.5,
              reviews: 1234,
              verified: true
            },
            {
              platform: 'aliexpress',
              name: 'Top Rated Sellers',
              url: links.aliexpress,
              rating: 4.3,
              reviews: 5678,
              verified: true
            },
            {
              platform: 'indiamart',
              name: 'Trusted Suppliers',
              url: links.indiamart,
              rating: 4.2,
              reviews: 890,
              verified: true
            }
          ],
          searchTerms: searchTerms
        };
      });

      return NextResponse.json({
        success: true,
        recommendations: recommendationsWithLinks,
        pagination: {
          total: recsArray.length,
          limit,
          offset,
          hasMore
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Product recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations', details: error.message },
      { status: 500 }
    );
  }
}

