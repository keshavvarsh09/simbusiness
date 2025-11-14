import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';
import pool from '@/lib/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// This endpoint initializes the database schema
// Call this once after deploying to Vercel
export async function GET(request: NextRequest) {
  try {
    // Optional: Add a secret key check for security
    // Check both header and query parameter for flexibility
    const secret = request.headers.get('x-init-secret') || 
                   new URL(request.url).searchParams.get('secret');
    
    // Only check secret if it's set in environment
    if (process.env.INIT_DB_SECRET) {
      if (!secret || secret !== process.env.INIT_DB_SECRET) {
        return NextResponse.json(
          { error: 'Unauthorized - Secret required' },
          { status: 401 }
        );
      }
    }

    console.log('Initializing database...');
    
    // Check DATABASE_URL first
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'DATABASE_URL not configured',
        details: 'Please set DATABASE_URL environment variable in Vercel with your Supabase connection string.',
        hint: 'Go to Vercel → Settings → Environment Variables → Add DATABASE_URL',
        supabaseGuide: 'See SUPABASE_SETUP.md for detailed instructions'
      }, { status: 500 });
    }
    
    // Test connection first
    try {
      const testClient = await pool.connect();
      try {
        await testClient.query('SELECT NOW()');
        console.log('Database connection verified');
      } finally {
        testClient.release();
      }
    } catch (connError: any) {
      console.error('Connection test failed:', connError.message);
      return NextResponse.json({
        error: 'Database connection failed',
        details: connError.message,
        hint: 'Please check your DATABASE_URL. Make sure your Supabase project is active and the connection string is correct.',
        troubleshooting: [
          '1. Verify your Supabase project is active (not paused)',
          '2. Check DATABASE_URL format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres',
          '3. For Vercel, use connection pooling URL (port 6543)',
          '4. Verify password in connection string is correct'
        ]
      }, { status: 500 });
    }
    
    await initDatabase();
    console.log('Database initialized successfully');
    
    // Run migration to ensure all columns exist
    try {
      const client = await pool.connect();
      try {
        // Check and add active_in_dashboard column if needed
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name='products' AND column_name='active_in_dashboard'
        `);
        
        if (columnCheck.rows.length === 0) {
          await client.query(`
            ALTER TABLE products 
            ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
          `);
          console.log('Added active_in_dashboard column to products table');
          
          // Update existing products
          await client.query(`
            UPDATE products 
            SET active_in_dashboard = true 
            WHERE active_in_dashboard IS NULL
          `);
        }
      } finally {
        client.release();
      }
    } catch (migrationError: any) {
      console.warn('Migration warning:', migrationError.message);
      // Don't fail init-db if migration has issues
    }
    
    // Verify tables were created
    const verifyClient = await pool.connect();
    try {
      const tablesCheck = await verifyClient.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      const createdTables = tablesCheck.rows.map(row => row.table_name);
      const expectedTables = ['users', 'products', 'business_data', 'simulation_state', 'missions', 'analytics', 'chatbot_conversations', 'brand_building_tasks', 'ad_campaigns'];
      const missingTables = expectedTables.filter(table => !createdTables.includes(table));
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        migration: 'Migration completed',
        tablesCreated: createdTables.length,
        tables: createdTables,
        missingTables: missingTables.length > 0 ? missingTables : undefined,
        nextSteps: [
          '1. Test the connection: Visit /api/test-db',
          '2. Try signing up: Create a new account',
          '3. Add products: Go to Products → Recommendations or Analyze Product'
        ]
      });
    } finally {
      verifyClient.release();
    }
  } catch (error: any) {
    console.error('Database initialization error:', error);
    const errorMessage = error?.message || 'Unknown error';
    const errorStack = error?.stack || '';
    
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: errorMessage,
        hint: errorMessage.includes('connection') 
          ? 'Check DATABASE_URL environment variable and database connectivity'
          : errorMessage.includes('permission')
          ? 'Check database user permissions'
          : 'Check Vercel function logs for more details',
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

