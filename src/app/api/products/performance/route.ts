/**
 * Product Performance Analysis API
 * Generates AI-based performance descriptions for products
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateWithGroq, isGroqAvailable } from '@/lib/groq';
import { chatWithGemini } from '@/lib/gemini-optimized';

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
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productIds } = body; // Array of product IDs

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Get products
      const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
      const productsResult = await client.query(
        `SELECT id, name, category, cost, selling_price, moq, created_at
         FROM products
         WHERE user_id = $1 AND id = ANY(ARRAY[${placeholders}])`,
        [userId, ...productIds]
      );

      if (productsResult.rows.length === 0) {
        return NextResponse.json({ error: 'Products not found' }, { status: 404 });
      }

      const products = productsResult.rows;

      // Generate performance analysis for each product
      const analyses = await Promise.all(
        products.map(async (product) => {
          const profitMargin = product.selling_price > 0
            ? ((product.selling_price - product.cost) / product.selling_price) * 100
            : 0;

          const prompt = `Analyze the performance potential of this dropshipping product:

Product: ${product.name}
Category: ${product.category}
Cost: $${product.cost}
Selling Price: $${product.selling_price}
Profit Margin: ${profitMargin.toFixed(1)}%
MOQ: ${product.moq}

Provide a brief performance analysis (2-3 sentences) covering:
1. Profitability assessment
2. Market potential
3. Risk factors
4. Recommendation for dropshipping

Format as JSON:
{
  "performance": "excellent|good|moderate|poor",
  "description": "2-3 sentence analysis",
  "strengths": ["strength1", "strength2"],
  "risks": ["risk1", "risk2"],
  "recommendation": "strongly_recommend|recommend|neutral|not_recommend"
}`;

          try {
            let analysisText: string;
            
            if (isGroqAvailable()) {
              try {
                analysisText = await generateWithGroq(prompt, {
                  temperature: 0.7,
                  maxTokens: 512
                });
              } catch {
                analysisText = await chatWithGemini(prompt);
              }
            } else {
              analysisText = await chatWithGemini(prompt);
            }

            // Parse JSON
            try {
              const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);
                return {
                  productId: product.id,
                  ...analysis
                };
              }
            } catch (e) {
              // If parsing fails, return text description
              return {
                productId: product.id,
                performance: 'moderate',
                description: analysisText.substring(0, 200),
                strengths: [],
                risks: [],
                recommendation: 'neutral'
              };
            }
          } catch (error: any) {
            console.error(`Error analyzing product ${product.id}:`, error);
            return {
              productId: product.id,
              performance: 'moderate',
              description: 'Analysis unavailable at this time.',
              strengths: [],
              risks: [],
              recommendation: 'neutral'
            };
          }
        })
      );

      return NextResponse.json({
        success: true,
        analyses
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Product performance analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze products', details: error.message },
      { status: 500 }
    );
  }
}

