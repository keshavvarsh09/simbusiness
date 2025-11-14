import { NextRequest, NextResponse } from 'next/server';
import { getMetaAdsStrategy } from '@/lib/gemini';
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
    const { productInfo, budget } = body;

    if (!productInfo || !budget) {
      return NextResponse.json(
        { error: 'Product info and budget are required' },
        { status: 400 }
      );
    }

    const strategy = await getMetaAdsStrategy(productInfo, parseFloat(budget));

    // Save to database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO ad_campaigns (user_id, platform, campaign_type, budget, recommendations, gemini_strategy)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          userId,
          'meta',
          'strategy',
          budget,
          typeof strategy === 'string' ? strategy : JSON.stringify(strategy),
          JSON.stringify(strategy)
        ]
      );

      return NextResponse.json({
        success: true,
        campaignId: result.rows[0].id,
        strategy: typeof strategy === 'object' ? strategy : { detailedStrategy: strategy }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Meta ads strategy error:', error);
    return NextResponse.json(
      { error: 'Failed to generate strategy', details: error.message },
      { status: 500 }
    );
  }
}

