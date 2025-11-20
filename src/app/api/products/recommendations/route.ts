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

      // Fetch real products from web for each recommendation
      const recommendationsWithLinks = await Promise.all(
        paginatedRecs.map(async (rec: any) => {
          const searchTerms = rec.searchTerms || rec.name || '';
          const links = generateProductSearchLinks(searchTerms, rec.category);
          
          // Try to fetch real products from web (with timeout to not block)
          let scrapedProducts: any[] = [];
          let scrapedAliExpress: any[] = [];
          let realPrices: any = null;
          let productImage: string | null = null;
          
          try {
            // Fetch real products from Alibaba and AliExpress in parallel (non-blocking, 4s timeout)
            const scrapePromises = [
              scrapeAlibaba(searchTerms, true),
              scrapeAliExpress(searchTerms, true)
            ];
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 4000)
            );
            
            const results = await Promise.race([
              Promise.all(scrapePromises),
              timeoutPromise
            ]) as any[];
            
            scrapedProducts = results[0] || [];
            scrapedAliExpress = results[1] || [];
            
            // Combine all scraped products
            const allScraped = [...scrapedProducts, ...scrapedAliExpress];
            
            // Get real prices if available
            if (allScraped.length > 0) {
              const prices = allScraped
                .filter(p => p.price > 0)
                .map(p => p.price);
              
              if (prices.length > 0) {
                const alibabaPrices = scrapedProducts.filter(p => p.price > 0).map(p => p.price);
                const aliexpressPrices = scrapedAliExpress.filter(p => p.price > 0).map(p => p.price);
                
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
            // Scraping failed or timed out, use fallback
            console.log(`Scraping failed for ${searchTerms}, using fallback`);
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
          
          // Build suppliers list from scraped products or fallback
          const allScraped = [...scrapedProducts, ...scrapedAliExpress];
          const suppliers = allScraped.length > 0
            ? allScraped.slice(0, 5).map((sp: any) => ({
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
              }))
            : [
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
              ];
          
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
            // Use real prices if scraped, otherwise use estimated
            prices: realPrices ? {
              alibaba: realPrices.alibaba || { 
                min: rec.estimatedCost * 0.8 || 0, 
                max: rec.estimatedCost * 1.2 || 0, 
                average: rec.estimatedCost || 0, 
                currency: 'USD' 
              },
              aliexpress: realPrices.aliexpress || { 
                min: rec.estimatedCost * 0.7 || 0, 
                max: rec.estimatedCost * 1.1 || 0, 
                average: rec.estimatedCost * 0.9 || 0, 
                currency: 'USD' 
              },
              indiamart: { 
                min: (rec.estimatedCost * 50) || 0, 
                max: (rec.estimatedCost * 100) || 0, 
                average: (rec.estimatedCost * 75) || 0, 
                currency: 'INR' 
              },
              realData: realPrices.overall ? true : false
            } : {
              alibaba: { 
                min: rec.estimatedCost * 0.8 || 0, 
                max: rec.estimatedCost * 1.2 || 0, 
                average: rec.estimatedCost || 0, 
                currency: 'USD' 
              },
              aliexpress: { 
                min: rec.estimatedCost * 0.7 || 0, 
                max: rec.estimatedCost * 1.1 || 0, 
                average: rec.estimatedCost * 0.9 || 0, 
                currency: 'USD' 
              },
              indiamart: { 
                min: (rec.estimatedCost * 50) || 0, 
                max: (rec.estimatedCost * 100) || 0, 
                average: (rec.estimatedCost * 75) || 0, 
                currency: 'INR' 
              },
              realData: false
            },
            suppliers: suppliers,
            // Include scraped products for detailed view
            scrapedProducts: allScraped.slice(0, 10), // Top 10 scraped products from all platforms
            hasRealData: allScraped.length > 0, // Flag to show if real data was fetched
            searchTerms: searchTerms
          };
        })
      );

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

