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

// GET - Fetch marketing state
export async function GET(request: NextRequest) {
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await pool.connect();
        try {
            // Try to get existing marketing state
            const result = await client.query(
                `SELECT marketing_data FROM simulation_state WHERE user_id = $1`,
                [userId]
            );

            if (result.rows.length > 0 && result.rows[0].marketing_data) {
                const marketingData = result.rows[0].marketing_data;
                return NextResponse.json({
                    success: true,
                    organicContent: marketingData.organicContent || [],
                    paidCampaigns: marketingData.paidCampaigns || [],
                    stats: marketingData.stats || {
                        organicReach: 0,
                        organicConversions: 0,
                        paidReach: 0,
                        paidConversions: 0,
                        totalAdSpend: 0,
                        overallRoas: 0,
                        cac: 0
                    }
                });
            }

            // Return empty state if none exists
            return NextResponse.json({
                success: true,
                organicContent: [],
                paidCampaigns: [],
                stats: {
                    organicReach: 0,
                    organicConversions: 0,
                    paidReach: 0,
                    paidConversions: 0,
                    totalAdSpend: 0,
                    overallRoas: 0,
                    cac: 0
                }
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Get marketing state error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch marketing state', details: error.message },
            { status: 500 }
        );
    }
}

// POST - Save marketing state
export async function POST(request: NextRequest) {
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { organicContent, paidCampaigns, stats } = body;

        const client = await pool.connect();
        try {
            // Check if marketing_data column exists, if not add it
            try {
                await client.query(`
          ALTER TABLE simulation_state 
          ADD COLUMN IF NOT EXISTS marketing_data JSONB DEFAULT '{}'
        `);
            } catch (e) {
                // Column might already exist, continue
            }

            // Upsert marketing state
            await client.query(`
        INSERT INTO simulation_state (user_id, marketing_data, last_updated)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id)
        DO UPDATE SET 
          marketing_data = $2,
          last_updated = CURRENT_TIMESTAMP
      `, [userId, JSON.stringify({ organicContent, paidCampaigns, stats })]);

            return NextResponse.json({
                success: true,
                message: 'Marketing state saved'
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Save marketing state error:', error);
        return NextResponse.json(
            { error: 'Failed to save marketing state', details: error.message },
            { status: 500 }
        );
    }
}
