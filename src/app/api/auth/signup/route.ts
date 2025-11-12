import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool, { initDatabase } from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      // Auto-initialize database if tables don't exist
      try {
        await client.query('SELECT 1 FROM users LIMIT 1');
      } catch (tableError: any) {
        // Table doesn't exist, initialize database
        console.log('Tables not found, initializing database...');
        await initDatabase();
        console.log('Database initialized successfully');
      }

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
    const errorMessage = error?.message || 'Unknown error';
    
    // Provide helpful error messages
    let userFriendlyError = 'Failed to create user';
    if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
      userFriendlyError = 'Database not initialized. Please try again in a moment.';
    } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
      userFriendlyError = 'Database connection failed. Please check your database settings.';
    } else if (errorMessage.includes('duplicate key') || errorMessage.includes('unique')) {
      userFriendlyError = 'User with this email already exists';
    }
    
    return NextResponse.json(
      { 
        error: userFriendlyError, 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

