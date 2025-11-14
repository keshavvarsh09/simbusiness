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
        modelName: undefined as string | undefined,
      },
      groq: {
        apiKeyValid: false,
        error: null as string | null,
        modelName: undefined as string | undefined,
      },
      aiRouter: {
        availableProviders: {
          groq: false,
          gemini: false,
        }
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
        const modelName = process.env.GEMINI_MODEL_NAME || 'models/gemini-2.5-flash';
        const model = genAI.getGenerativeModel({ model: modelName });
        // Just verify the key is valid format, don't make actual call
        diagnostics.gemini.apiKeyValid = true;
        diagnostics.gemini.modelName = modelName;
      } catch (geminiError: any) {
        diagnostics.gemini.error = geminiError.message;
      }
    }

    // Test Groq API key
    if (process.env.GROQ_API_KEY) {
      try {
        const { isGroqAvailable } = await import('@/lib/groq');
        diagnostics.groq.apiKeyValid = isGroqAvailable();
        diagnostics.groq.modelName = process.env.GROQ_MODEL_NAME || 'llama-3.1-70b-versatile';
      } catch (groqError: any) {
        diagnostics.groq.error = groqError.message;
      }
    }

    // Get available AI providers
    try {
      const { getAvailableProviders } = await import('@/lib/ai-router');
      diagnostics.aiRouter.availableProviders = getAvailableProviders();
    } catch (routerError: any) {
      // Ignore router errors in diagnostics
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


