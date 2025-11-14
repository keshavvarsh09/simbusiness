/**
 * Instagram Organic Metrics API
 * Analyzes Instagram organic reach, link clicks, engagement from screenshots
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { analyzeMetaDashboard } from '@/lib/gemini-optimized';

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
    const { imageBase64, mimeType, metricType } = body; // metricType: 'reach' | 'link_clicks' | 'engagement'

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Analyze Instagram metrics with Gemini Vision
    const prompt = `Analyze this Instagram analytics screenshot. Extract the following metrics:
- Organic Reach (number of unique accounts that saw the post)
- Link Clicks (clicks on bio link or swipe-up)
- Profile Visits
- Engagement Rate (likes, comments, shares, saves)
- Impressions
- Followers Gained/Lost

Return as JSON:
{
  "organicReach": number,
  "linkClicks": number,
  "profileVisits": number,
  "engagementRate": number,
  "impressions": number,
  "followersChange": number,
  "dateRange": "string",
  "insights": "string"
}`;

    // Use Gemini Vision API directly for custom prompt
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType || 'image/png'
      }
    };
    
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON
    let analysis: any;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = { rawResponse: text };
      }
    } catch (e) {
      analysis = { rawResponse: text };
    }

    // Save to database
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO analytics (user_id, analytics_type, image_url, raw_data, gemini_analysis, profitability_score, recommendations)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          userId,
          'instagram_organic',
          null,
          JSON.stringify({ imageBase64: imageBase64.substring(0, 100) + '...', metricType }),
          JSON.stringify(analysis),
          analysis.engagementRate || 0,
          analysis.insights || ''
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
    console.error('Instagram organic analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze Instagram metrics', details: error.message },
      { status: 500 }
    );
  }
}

