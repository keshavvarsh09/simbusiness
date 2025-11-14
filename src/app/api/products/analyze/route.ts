import { NextRequest, NextResponse } from 'next/server';
import { analyzeProductFromUrl } from '@/lib/gemini';
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    // Get user context
    const client = await pool.connect();
    try {
      const userResult = await client.query(
        'SELECT budget, product_genre FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      // Analyze product with Gemini
      const analysis = await analyzeProductFromUrl(url, user?.budget, user?.product_genre);

      // Save analysis to database
      const productResult = await client.query(
        `INSERT INTO products (user_id, name, category, source_url, cost, selling_price, moq, competition_analysis, feasibility_analysis, gemini_analysis)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          userId,
          analysis.productName || 'Unknown',
          analysis.category || 'Unknown',
          url,
          analysis.estimatedCost || 0,
          analysis.currentPrice || 0,
          analysis.vendors?.[0]?.estimatedMOQ || 0,
          JSON.stringify(analysis.competition || {}),
          JSON.stringify(analysis.feasibility || {}),
          JSON.stringify(analysis)
        ]
      );

      return NextResponse.json({
        success: true,
        productId: productResult.rows[0].id,
        analysis
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Product analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze product', details: error.message },
      { status: 500 }
    );
  }
}

