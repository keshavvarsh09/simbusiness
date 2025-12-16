import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function getUserFromToken(request: NextRequest): number | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return decoded.userId;
    } catch {
        return null;
    }
}

export async function GET(request: NextRequest) {
    const userId = getUserFromToken(request);
    if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Get launcher progress
        const progressResult = await pool.query(
            'SELECT launcher_progress FROM users WHERE id = $1',
            [userId]
        );

        // Get user stats from dashboard state
        const statsResult = await pool.query(
            'SELECT dashboard_state FROM users WHERE id = $1',
            [userId]
        );

        const progress = progressResult.rows[0]?.launcher_progress || [];
        const dashboardState = statsResult.rows[0]?.dashboard_state || {};

        return NextResponse.json({
            success: true,
            progress: progress,
            stats: {
                totalLessons: 21, // Total lessons across all modules
                completedLessons: progress.reduce((sum: number, p: any) => sum + (p.completedLessons?.length || 0), 0),
                currentStreak: dashboardState.streak || 0,
                simulationDay: dashboardState.day || 0,
                revenue: dashboardState.revenue || 0,
            }
        });
    } catch (error) {
        console.error('Error loading launcher progress:', error);
        return NextResponse.json({ success: false, error: 'Failed to load progress' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const userId = getUserFromToken(request);
    if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { progress } = await request.json();

        // Save progress to database
        await pool.query(
            'UPDATE users SET launcher_progress = $1 WHERE id = $2',
            [JSON.stringify(progress), userId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving launcher progress:', error);
        return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
    }
}
