/**
 * Auto-generate missions endpoint
 * Periodically generates missions based on real-world events
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateMissionsFromEvents, getStandardMissionTemplates } from '@/lib/mission-generator';

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

// POST - Auto-generate missions based on events
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { locations } = body;
    const userLocations = locations || ['India', 'Delhi', 'Mumbai', 'Bangalore'];

    // Generate missions from real-world events
    const eventMissions = await generateMissionsFromEvents(userLocations);
    
    // Also get standard missions as fallback
    const standardMissions = getStandardMissionTemplates();
    
    // Combine and select 1-2 missions to create
    const allMissions = [...eventMissions, ...standardMissions];
    const missionsToCreate = allMissions.slice(0, Math.min(2, allMissions.length));
    
    const client = await pool.connect();
    try {
      const createdMissions = [];
      
      for (const template of missionsToCreate) {
        // Check if similar mission already exists (avoid duplicates)
        const existing = await client.query(
          `SELECT id FROM missions 
           WHERE user_id = $1 AND title = $2 AND status = 'active'`,
          [userId, template.title]
        );
        
        if (existing.rows.length > 0) {
          continue; // Skip if already exists
        }
        
        // Calculate deadline
        const deadline = new Date();
        deadline.setHours(deadline.getHours() + template.durationHours);
        
        const result = await client.query(
          `INSERT INTO missions (user_id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, event_source, affected_location, news_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, event_source, affected_location, news_url, created_at`,
          [
            userId,
            template.title,
            template.description,
            template.type,
            deadline,
            'active',
            template.costToSolve,
            JSON.stringify(template.impact),
            template.eventSource || null,
            template.affectedLocation || null,
            template.newsUrl || null
          ]
        );
        
        createdMissions.push(result.rows[0]);
      }

      return NextResponse.json({
        success: true,
        missions: createdMissions,
        message: `Generated ${createdMissions.length} new mission(s)`
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Auto-generate missions error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-generate missions', details: error.message },
      { status: 500 }
    );
  }
}

