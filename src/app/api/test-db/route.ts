import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Simple test endpoint to check database connection
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      const row = result.rows[0];
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        database: {
          currentTime: row.current_time,
          version: row.pg_version.substring(0, 50) + '...'
        },
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlLength: process.env.DATABASE_URL?.length || 0,
          nodeEnv: process.env.NODE_ENV
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      details: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPreview: process.env.DATABASE_URL 
          ? process.env.DATABASE_URL.substring(0, 30) + '...' 
          : 'Not set',
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 });
  }
}

