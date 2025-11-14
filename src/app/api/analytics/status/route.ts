/**
 * Analytics Status API
 * Returns status of uploaded ad metrics (Meta, Google, Instagram)
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

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
      // Check for Meta ads
      const metaResult = await client.query(
        `SELECT created_at FROM analytics 
         WHERE user_id = $1 AND analytics_type = 'meta_dashboard' 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      // Check for Google ads
      const googleResult = await client.query(
        `SELECT created_at FROM analytics 
         WHERE user_id = $1 AND analytics_type = 'google_dashboard' 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      // Check for Instagram organic
      const instagramResult = await client.query(
        `SELECT created_at FROM analytics 
         WHERE user_id = $1 AND analytics_type = 'instagram_organic' 
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        hasMetaAds: metaResult.rows.length > 0,
        hasGoogleAds: googleResult.rows.length > 0,
        hasInstagramOrganic: instagramResult.rows.length > 0,
        lastMetaUpload: metaResult.rows[0]?.created_at || null,
        lastGoogleUpload: googleResult.rows[0]?.created_at || null,
        lastInstagramUpload: instagramResult.rows[0]?.created_at || null
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Analytics status error:', error);
    return NextResponse.json(
      { error: 'Failed to get analytics status', details: error.message },
      { status: 500 }
    );
  }
}

