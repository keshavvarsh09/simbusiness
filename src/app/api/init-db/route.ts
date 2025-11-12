import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

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
    await initDatabase();
    console.log('Database initialized successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
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

