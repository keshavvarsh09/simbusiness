/**
 * Auto-generate missions endpoint
 * Periodically generates missions based on real-world events
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateMissionsFromEvents, getStandardMissionTemplates, getPreGeneratedTimeBoundMissions } from '@/lib/mission-generator';

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

    // Generate missions from real-world events (with error handling)
    let eventMissions: any[] = [];
    try {
      eventMissions = await generateMissionsFromEvents(userLocations);
      console.log(`Generated ${eventMissions.length} event-based missions`);
    } catch (error: any) {
      console.error('Error generating event missions (will use standard missions):', error.message);
      // Continue with standard missions if event generation fails
    }

    // Always get pre-generated time-bound missions (guaranteed to have 10+)
    const preGeneratedMissions = getPreGeneratedTimeBoundMissions();

    // Combine missions - prioritize event missions, then pre-generated
    const allMissions = [...eventMissions, ...preGeneratedMissions];

    // If no missions at all, something is wrong
    if (allMissions.length === 0) {
      return NextResponse.json(
        { error: 'No missions available to generate', details: 'Mission generator returned empty array' },
        { status: 500 }
      );
    }

    // Select up to 5 missions to create (prioritize event missions, then pre-generated)
    // This ensures users get multiple time-bound missions
    const missionsToCreate = allMissions.slice(0, Math.min(5, allMissions.length));

    const client = await pool.connect();
    try {
      // Auto-initialize database if missions table doesn't exist
      try {
        await client.query('SELECT 1 FROM missions LIMIT 1');
      } catch (tableError: any) {
        if (tableError.message?.includes('does not exist') || tableError.message?.includes('relation')) {
          console.log('Missions table not found, initializing database...');
          const { initDatabase } = await import('@/lib/db');
          try {
            await initDatabase();
            console.log('Database initialized successfully');
          } catch (initError: any) {
            console.error('Database initialization failed:', initError.message);
            return NextResponse.json(
              {
                error: 'Database not initialized',
                details: 'The missions table does not exist. Please run /api/init-db first or contact support.',
                hint: 'Visit /api/init-db to initialize the database'
              },
              { status: 500 }
            );
          }
        } else {
          // Some other database error, re-throw it
          throw tableError;
        }
      }
      const createdMissions = [];

      // Get count of current active missions
      const activeCount = await client.query(
        `SELECT COUNT(*) as count FROM missions WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );
      const currentActiveCount = parseInt(activeCount.rows[0]?.count || '0');

      // Always try to have at least 2 active missions
      const missionsNeeded = Math.max(2, 2 - currentActiveCount);
      let missionsCreated = 0;

      // Shuffle missions to get random ones each time
      const shuffledMissions = [...missionsToCreate].sort(() => Math.random() - 0.5);

      for (const template of shuffledMissions) {
        // Stop if we've created enough new missions
        if (missionsCreated >= missionsNeeded) break;

        try {
          // Check if EXACT same title already exists active
          const existing = await client.query(
            `SELECT id FROM missions 
             WHERE user_id = $1 AND title = $2 AND status = 'active'`,
            [userId, template.title]
          );

          if (existing.rows.length > 0) {
            console.log(`Skipping duplicate mission: ${template.title}`);
            continue; // Skip if already exists
          }

          // Calculate deadline
          const deadline = new Date();
          deadline.setHours(deadline.getHours() + (template.durationHours || 24));

          // Ensure all required fields are present
          if (!template.title || !template.description || !template.type) {
            console.error('Invalid mission template:', template);
            continue;
          }

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
              template.costToSolve || 500,
              JSON.stringify(template.impact || {}),
              template.eventSource || null,
              template.affectedLocation || null,
              template.newsUrl || null
            ]
          );

          createdMissions.push(result.rows[0]);
          missionsCreated++;
          console.log(`Created mission: ${template.title}`);
        } catch (insertError: any) {
          console.error(`Error inserting mission "${template.title}":`, insertError.message);
          // Continue with next mission instead of failing completely
          continue;
        }
      }

      // If no missions were created (all duplicates or errors), return a helpful message
      if (createdMissions.length === 0) {
        return NextResponse.json({
          success: true,
          missions: [],
          message: 'No new missions generated. You may already have active missions with similar titles, or all missions were duplicates.'
        });
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

