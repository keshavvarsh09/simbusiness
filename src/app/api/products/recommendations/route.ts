import { NextRequest, NextResponse } from 'next/server';
import { generateProductRecommendations } from '@/lib/ai-router';
import { generateProductSearchLinks } from '@/lib/product-search';
import { getProductImage, comparePrices } from '@/lib/product-scraper';
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

    const client = await pool.connect();
    try {
      const userResult = await client.query(
        'SELECT budget, product_genre FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      if (!user?.budget || !user?.product_genre) {
        return NextResponse.json(
          { error: 'User budget and product genre must be set' },
          { status: 400 }
        );
      }

      let recommendations = await generateProductRecommendations(
        parseFloat(user.budget),
        user.product_genre
      );

      // Convert to array if needed
      const recsArray = Array.isArray(recommendations) 
        ? recommendations 
        : (recommendations.recommendations || []);

      // Add search links, images, prices, and supplier details for each product
      const recommendationsWithLinks = await Promise.all(
        recsArray.map(async (rec: any) => {
          const searchTerms = rec.searchTerms || rec.name || '';
          const links = generateProductSearchLinks(searchTerms, rec.category);
          
          // Get product image (async)
          const imageUrl = await getProductImage(searchTerms, rec.category).catch(() => null);
          
          // Get price comparison (async)
          const prices = await comparePrices(searchTerms).catch(() => ({
            alibaba: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'USD' },
            aliexpress: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'USD' },
            indiamart: { min: 0, max: 0, average: rec.estimatedCost || 0, currency: 'INR' }
          }));
          
          return {
            ...rec,
            imageUrl: imageUrl || `https://via.placeholder.com/300x300?text=${encodeURIComponent(rec.name)}`,
            links: {
              alibaba: links.alibaba,
              aliexpress: links.aliexpress,
              indiamart: links.indiamart,
              amazon: links.amazon,
              flipkart: links.flipkart
            },
            prices: {
              alibaba: prices.alibaba,
              aliexpress: prices.aliexpress,
              indiamart: prices.indiamart
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
        })
      );

      return NextResponse.json({
        success: true,
        recommendations: recommendationsWithLinks
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

