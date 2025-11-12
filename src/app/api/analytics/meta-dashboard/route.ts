import { NextRequest, NextResponse } from 'next/server';
import { analyzeMetaDashboard } from '@/lib/gemini';
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
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Analyze dashboard with Gemini Vision
    const analysis = await analyzeMetaDashboard(imageBase64, mimeType || 'image/png');

    // Save to database
    const client = await pool.connect();
    try {
      const profitabilityScore = analysis.profitability_score || 
        (analysis.metrics?.roas ? (analysis.metrics.roas - 1) * 100 : 0);

      const result = await client.query(
        `INSERT INTO analytics (user_id, analytics_type, image_url, raw_data, gemini_analysis, profitability_score, recommendations)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          userId,
          'meta_dashboard',
          null, // Store image separately if needed
          JSON.stringify({ imageBase64: imageBase64.substring(0, 100) + '...' }), // Store truncated
          JSON.stringify(analysis),
          profitabilityScore,
          analysis.recommendations?.join('\n') || analysis.assessment || ''
        ]
      );

      return NextResponse.json({
        success: true,
        analyticsId: result.rows[0].id,
        analysis
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Meta dashboard analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze dashboard', details: error.message },
      { status: 500 }
    );
  }
}

