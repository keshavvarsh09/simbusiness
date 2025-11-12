import { NextRequest, NextResponse } from 'next/server';
import { analyzeContentPerformance } from '@/lib/gemini';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

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
    const { contentUrl, platform, engagementMetrics } = body;

    if (!contentUrl || !platform) {
      return NextResponse.json(
        { error: 'Content URL and platform are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeContentPerformance(contentUrl, engagementMetrics || {});

    // Save to database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO brand_building_tasks (user_id, platform, content_url, engagement_metrics, gemini_feedback, recommendations)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          userId,
          platform,
          contentUrl,
          JSON.stringify(engagementMetrics || {}),
          JSON.stringify(analysis),
          Array.isArray(analysis.recommendations) 
            ? analysis.recommendations.join('\n')
            : analysis.recommendations || ''
        ]
      );

      return NextResponse.json({
        success: true,
        taskId: result.rows[0].id,
        analysis
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Brand building analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error.message },
      { status: 500 }
    );
  }
}

