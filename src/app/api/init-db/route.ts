import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/db';

// This endpoint initializes the database schema
// Call this once after deploying to Vercel
export async function GET(request: NextRequest) {
  try {
    // Optional: Add a secret key check for security
    // Check both header and query parameter for flexibility
    const secret = request.headers.get('x-init-secret') || 
                   new URL(request.url).searchParams.get('secret');
    
    if (!process.env.INIT_DB_SECRET) {
      // If no secret is set, allow initialization (for development)
      console.warn('INIT_DB_SECRET not set, allowing initialization');
    } else if (secret !== process.env.INIT_DB_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await initDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

