import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool, { initDatabase } from '@/lib/db';

// Initialize database on first import
if (process.env.NODE_ENV !== 'production') {
  initDatabase().catch(console.error);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, budget, productGenre, productName } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const client = await pool.connect();
    try {
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user
      const result = await client.query(
        `INSERT INTO users (email, password_hash, name, phone, budget, product_genre, product_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, name, budget, product_genre, product_name`,
        [email, passwordHash, name, phone || null, budget || null, productGenre || null, productName || null]
      );

      const user = result.rows[0];

      // Initialize business data
      await client.query(
        `INSERT INTO business_data (user_id, revenue, expenses, profit, cash_flow, inventory_value, outstanding_orders, bankruptcy_risk_score)
         VALUES ($1, 0, 0, 0, 0, 0, 0, 0)`,
        [user.id]
      );

      return NextResponse.json(
        {
          message: 'User created successfully',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            budget: user.budget,
            productGenre: user.product_genre,
            productName: user.product_name
          }
        },
        { status: 201 }
      );
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}

