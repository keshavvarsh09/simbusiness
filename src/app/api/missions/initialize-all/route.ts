/**
 * Initialize missions for all users
 * Pre-generates at least 10 time-bound missions for every user in the system
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getPreGeneratedTimeBoundMissions } from '@/lib/mission-generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST - Initialize missions for all users
export async function POST(request: NextRequest) {
  try {
    // Optional: Add secret check for security
    const authHeader = request.headers.get('authorization');
    const secret = request.headers.get('x-init-secret') || request.nextUrl.searchParams.get('secret');
    
    // Allow if secret matches or if in development
    if (process.env.NODE_ENV === 'production' && secret !== process.env.INIT_DB_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get all users
      const usersResult = await client.query('SELECT id FROM users');
      const users = usersResult.rows;
      
      if (users.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No users found. Missions will be created when users sign up.',
          missionsCreated: 0
        });
      }

      // Get pre-generated missions
      const preGeneratedMissions = getPreGeneratedTimeBoundMissions();
      
      if (preGeneratedMissions.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No pre-generated missions available'
        }, { status: 500 });
      }

      let totalMissionsCreated = 0;
      const results: Array<{ userId: number; missionsCreated: number }> = [];

      // For each user, create missions
      for (const user of users) {
        const userId = user.id;
        let userMissionsCreated = 0;

        // Check existing active missions for this user
        const existingMissions = await client.query(
          'SELECT COUNT(*) as count FROM missions WHERE user_id = $1 AND status = $2',
          [userId, 'active']
        );
        const existingCount = parseInt(existingMissions.rows[0]?.count || '0');

        // If user already has 10+ active missions, skip
        if (existingCount >= 10) {
          results.push({ userId, missionsCreated: 0 });
          continue;
        }

        // Calculate how many missions to create (aim for 10 total)
        const missionsToCreate = Math.max(1, 10 - existingCount);
        const missionsForUser = preGeneratedMissions.slice(0, Math.min(missionsToCreate, preGeneratedMissions.length));

        for (const template of missionsForUser) {
          try {
            // Check if similar mission already exists
            const existing = await client.query(
              `SELECT id FROM missions 
               WHERE user_id = $1 AND title = $2 AND status = 'active'`,
              [userId, template.title]
            );
            
            if (existing.rows.length > 0) {
              continue; // Skip duplicate
            }

            // Calculate deadline
            const deadline = new Date();
            deadline.setHours(deadline.getHours() + (template.durationHours || 24));

            // Insert mission
            await client.query(
              `INSERT INTO missions (user_id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, event_source, affected_location, news_url)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
              [
                userId,
                template.title,
                template.description,
                template.type,
                deadline,
                'active',
                template.costToSolve || 500,
                JSON.stringify(template.impact || {}),
                template.eventSource || 'system',
                template.affectedLocation || null,
                template.newsUrl || null
              ]
            );

            userMissionsCreated++;
            totalMissionsCreated++;
          } catch (insertError: any) {
            console.error(`Error creating mission for user ${userId}:`, insertError.message);
            // Continue with next mission
          }
        }

        results.push({ userId, missionsCreated: userMissionsCreated });
      }

      return NextResponse.json({
        success: true,
        message: `Initialized missions for ${users.length} user(s). Created ${totalMissionsCreated} new mission(s).`,
        totalUsers: users.length,
        totalMissionsCreated,
        results
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Initialize missions error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to initialize missions', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET - Check mission status for all users
export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          u.id as user_id,
          u.email,
          COUNT(m.id) as active_missions,
          COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed_missions
        FROM users u
        LEFT JOIN missions m ON u.id = m.user_id AND m.status = 'active'
        GROUP BY u.id, u.email
        ORDER BY u.id
      `);

      return NextResponse.json({
        success: true,
        users: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

