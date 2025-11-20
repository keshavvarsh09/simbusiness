import { NextRequest, NextResponse } from 'next/server';
import { generateProductRecommendations } from '@/lib/ai-router';
import { generateProductSearchLinks } from '@/lib/product-search';
import { scrapeAlibaba, scrapeAliExpress, getProductImage, comparePrices } from '@/lib/product-scraper';
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
        // No fallback - return error if AI fails
        return NextResponse.json(
          { error: 'Failed to generate recommendations. Please try again.' },
          { status: 500 }
        );
      }

      // Convert to array if needed
      const recsArray = Array.isArray(recommendations) 
        ? recommendations 
        : (recommendations?.recommendations || recommendations || []);

      // Apply pagination
      const paginatedRecs = recsArray.slice(offset, offset + limit);
      const hasMore = offset + limit < recsArray.length;

      // Fetch real products from web for each recommendation
      // Only return recommendations that have real scraped product data
      const recommendationsWithRealData = await Promise.all(
        paginatedRecs.map(async (rec: any) => {
          const searchTerms = rec.searchTerms || rec.name || '';
          if (!searchTerms || searchTerms.trim().length === 0) {
            return null; // Skip if no search terms
          }
          
          const links = generateProductSearchLinks(searchTerms, rec.category);
          
          // Fetch real products from web - REQUIRED, no fallback
          let scrapedProducts: any[] = [];
          let scrapedAliExpress: any[] = [];
          let realPrices: any = null;
          let productImage: string | null = null;
          
          try {
            // Fetch real products from Alibaba and AliExpress in parallel (no API needed, direct fetch)
            const scrapePromises = [
              scrapeAlibaba(searchTerms, false), // false = no API, use direct fetch
              scrapeAliExpress(searchTerms, false) // false = no API, use direct fetch
            ];
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 8000) // Increased timeout to 8s
            );
            
            const results = await Promise.race([
              Promise.all(scrapePromises),
              timeoutPromise
            ]) as any[];
            
            scrapedProducts = results[0] || [];
            scrapedAliExpress = results[1] || [];
            
            // Combine all scraped products (only include real products with price > 0 and real titles)
            const allScraped = [...scrapedProducts, ...scrapedAliExpress].filter(
              p => p.price > 0 && 
                   p.title && 
                   p.title.trim().length > 5 &&
                   !p.title.includes('Search ') && 
                   !p.title.includes('Product Option') &&
                   !p.title.includes('Product 1') &&
                   !p.title.includes('Product 2') &&
                   !p.title.includes('Product 3') &&
                   !p.title.includes('Product 4') &&
                   !p.title.includes('Product 5') &&
                   !p.title.includes('Listing 1') &&
                   !p.title.includes('Listing 2') &&
                   !p.title.match(/Product \d+/i) &&
                   !p.title.match(/Listing \d+/i)
            );
            
            // CRITICAL: Only proceed if we have real scraped products
            if (allScraped.length === 0) {
              return null; // Skip this recommendation if no real products found
            }
            
            // Get real prices if available (only from products with actual prices)
            if (allScraped.length > 0) {
              const prices = allScraped
                .filter(p => p.price > 0)
                .map(p => p.price);
              
              if (prices.length > 0) {
                const alibabaPrices = scrapedProducts
                  .filter(p => p.price > 0 && p.title && !p.title.includes('Search '))
                  .map(p => p.price);
                const aliexpressPrices = scrapedAliExpress
                  .filter(p => p.price > 0 && p.title && !p.title.includes('Search '))
                  .map(p => p.price);
                
                realPrices = {
                  alibaba: alibabaPrices.length > 0 ? {
                    min: Math.min(...alibabaPrices),
                    max: Math.max(...alibabaPrices),
                    average: alibabaPrices.reduce((a, b) => a + b, 0) / alibabaPrices.length,
                    currency: 'USD'
                  } : null,
                  aliexpress: aliexpressPrices.length > 0 ? {
                    min: Math.min(...aliexpressPrices),
                    max: Math.max(...aliexpressPrices),
                    average: aliexpressPrices.reduce((a, b) => a + b, 0) / aliexpressPrices.length,
                    currency: 'USD'
                  } : null,
                  overall: {
                    min: Math.min(...prices),
                    max: Math.max(...prices),
                    average: prices.reduce((a, b) => a + b, 0) / prices.length,
                    currency: 'USD'
                  }
                };
              }
            }
          } catch (error) {
            // Scraping failed or timed out - skip this recommendation
            console.log(`Scraping failed for ${searchTerms}, skipping recommendation`);
            return null; // Don't show recommendations without real data
          }
          
          // Try to get product image (non-blocking)
          try {
            const imagePromise = getProductImage(rec.name, rec.category);
            const imageTimeout = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 2000)
            );
            productImage = await Promise.race([imagePromise, imageTimeout]) as string | null;
          } catch (error) {
            // Image fetch failed, use placeholder
          }
          
          // Build suppliers list ONLY from scraped products (no fallback)
          const allScraped = [...scrapedProducts, ...scrapedAliExpress].filter(
            p => p.price > 0 && p.title && p.title.trim().length > 5
          );
          
          if (allScraped.length === 0) {
            return null; // Skip if no real products
          }
          
          const suppliers = allScraped.slice(0, 5).map((sp: any) => ({
            platform: sp.platform,
            name: sp.supplier || 'Verified Supplier',
            url: sp.url || (sp.platform === 'alibaba' ? links.alibaba : links.aliexpress),
            rating: sp.rating || 4.5,
            reviews: sp.reviews || 0,
            verified: true,
            price: sp.price > 0 ? sp.price : undefined,
            moq: sp.moq || 1,
            imageUrl: sp.imageUrl,
            title: sp.title
          }));
          
          return {
            ...rec,
            // Use real product image if available
            imageUrl: productImage,
            // Image links - point to product listings where images are available
            imageLinks: {
              alibaba: links.alibaba,
              aliexpress: links.aliexpress,
              indiamart: links.indiamart,
            },
            links: {
              alibaba: links.alibaba,
              aliexpress: links.aliexpress,
              indiamart: links.indiamart,
              amazon: links.amazon,
              flipkart: links.flipkart
            },
            // Use ONLY real prices from scraped data (no estimated fallbacks)
            prices: realPrices ? {
              alibaba: realPrices.alibaba || null,
              aliexpress: realPrices.aliexpress || null,
              indiamart: null, // Only show if we have real data
              realData: true
            } : null, // Don't show prices if no real data
            suppliers: suppliers,
            // Include only real scraped products (filter out fake/placeholder products)
            scrapedProducts: allScraped.slice(0, 10).filter(
              p => p.price > 0 && 
                   p.title && 
                   p.title.trim().length > 5 &&
                   !p.title.includes('Search ') && 
                   !p.title.includes('Product Option') &&
                   !p.title.match(/Product \d+/i) &&
                   !p.title.match(/Listing \d+/i)
            ),
            hasRealData: allScraped.length > 0 && allScraped.some(p => p.price > 0), // Flag to show if real data was fetched
            searchTerms: searchTerms
          };
        })
      );

      // Filter out null recommendations (ones without real data)
      const validRecommendations = recommendationsWithRealData.filter((rec: any) => rec !== null);

      if (validRecommendations.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No real products found. Please try different search terms or check your internet connection.',
          recommendations: [],
          pagination: {
            total: 0,
            limit,
            offset,
            hasMore: false
          }
        });
      }

      return NextResponse.json({
        success: true,
        recommendations: validRecommendations,
        pagination: {
          total: validRecommendations.length,
          limit,
          offset,
          hasMore: offset + limit < validRecommendations.length
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

