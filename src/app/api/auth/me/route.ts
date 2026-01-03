import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// GET - Get current user info
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };

            const client = await pool.connect();
            try {
                const result = await client.query(
                    'SELECT id, email, name, learning_profile FROM users WHERE id = $1',
                    [decoded.userId]
                );

                if (result.rows.length === 0) {
                    return NextResponse.json(
                        { error: 'User not found' },
                        { status: 404 }
                    );
                }

                const user = result.rows[0];
                return NextResponse.json({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        learningProfile: user.learning_profile,
                    },
                });
            } finally {
                client.release();
            }
        } catch (jwtError) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }
    } catch (error: any) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Failed to get user info' },
            { status: 500 }
        );
    }
}

// PUT - Update learning profile
export async function PUT(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const { learningProfile } = await req.json();

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

            const client = await pool.connect();
            try {
                await client.query(
                    'UPDATE users SET learning_profile = $1, updated_at = NOW() WHERE id = $2',
                    [JSON.stringify(learningProfile), decoded.userId]
                );

                return NextResponse.json({
                    success: true,
                    message: 'Profile updated',
                });
            } finally {
                client.release();
            }
        } catch (jwtError) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
