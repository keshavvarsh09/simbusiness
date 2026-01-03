import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        if (!email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const client = await pool.connect();
        try {
            // Check if user exists
            const existing = await client.query(
                'SELECT id FROM users WHERE email = $1',
                [email.toLowerCase()]
            );

            if (existing.rows.length > 0) {
                return NextResponse.json(
                    { error: 'An account with this email already exists' },
                    { status: 409 }
                );
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create user with empty learning profile
            const result = await client.query(
                `INSERT INTO users (email, password_hash, name, learning_profile)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, created_at`,
                [email.toLowerCase(), passwordHash, name, JSON.stringify(null)]
            );

            const user = result.rows[0];

            // Generate JWT
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '30d' }
            );

            return NextResponse.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}
