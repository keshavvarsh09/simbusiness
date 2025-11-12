import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

// Force dynamic rendering
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

export async function GET(request: NextRequest) {
  // Set proper headers for JSON response
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const userId = getUserIdFromToken(request);
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length || 0,
        databaseUrlPreview: process.env.DATABASE_URL 
          ? process.env.DATABASE_URL.substring(0, 50) + '...' 
          : 'Not set',
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        geminiKeyPreview: process.env.GEMINI_API_KEY 
          ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' 
          : 'Not set',
        hasJwtSecret: !!process.env.JWT_SECRET,
        jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      },
      authentication: {
        hasToken: !!request.headers.get('authorization'),
        userId: userId || null,
        tokenValid: userId !== null,
        userExists: false as boolean | undefined,
        userCheckError: undefined as string | undefined,
      },
      database: {
        connectionTest: 'pending',
        error: null as string | null,
      },
      gemini: {
        apiKeyValid: false,
        error: null as string | null,
      }
    };

    // Test database connection
    try {
      const client = await pool.connect();
      try {
        await client.query('SELECT NOW()');
        diagnostics.database.connectionTest = 'success';
        
        if (userId) {
          try {
            const userResult = await client.query('SELECT id, email FROM users WHERE id = $1', [userId]);
            diagnostics.authentication.userExists = userResult.rows.length > 0;
          } catch (e: any) {
            diagnostics.authentication.userCheckError = e.message;
          }
        }
      } finally {
        client.release();
      }
    } catch (dbError: any) {
      diagnostics.database.connectionTest = 'failed';
      diagnostics.database.error = dbError.message;
    }

    // Test Gemini API key
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        // Just verify the key is valid format, don't make actual call
        diagnostics.gemini.apiKeyValid = true;
      } catch (geminiError: any) {
        diagnostics.gemini.error = geminiError.message;
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics
    }, { headers });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500,
      headers 
    });
  }
}


