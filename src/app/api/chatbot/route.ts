import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai-router';
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user context
    const client = await pool.connect();
    try {
      // Get user data (handle case where user might not have business_data yet)
      let userContext = {
        budget: null,
        productGenre: null,
        revenue: 0,
        expenses: 0,
        profit: 0,
        products: { length: 0 }
      };

      try {
        const userResult = await client.query(
          `SELECT u.budget, u.product_genre, 
           COALESCE(bd.revenue, 0) as revenue, 
           COALESCE(bd.expenses, 0) as expenses, 
           COALESCE(bd.profit, 0) as profit,
           (SELECT COUNT(*) FROM products WHERE user_id = u.id) as product_count
           FROM users u
           LEFT JOIN business_data bd ON u.id = bd.user_id
           WHERE u.id = $1`,
          [userId]
        );
        
        if (userResult.rows.length > 0) {
          const user = userResult.rows[0];
          userContext = {
            budget: user.budget,
            productGenre: user.product_genre,
            revenue: parseFloat(user.revenue || 0),
            expenses: parseFloat(user.expenses || 0),
            profit: parseFloat(user.profit || 0),
            products: { length: parseInt(user.product_count || 0) }
          };
        }
      } catch (dbError: any) {
        console.warn('Error fetching user context:', dbError.message);
        // Continue with default context if query fails
      }

      // Get conversation history (last 5 messages for context)
      let history: any[] = [];
      try {
        const historyResult = await client.query(
          `SELECT message, response FROM chatbot_conversations 
           WHERE user_id = $1 
           ORDER BY created_at DESC 
           LIMIT 5`,
          [userId]
        );
        history = historyResult.rows;
      } catch (historyError: any) {
        console.warn('Error fetching conversation history:', historyError.message);
        // Continue without history if query fails
      }

      // Check if at least one AI provider is available
      if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
        throw new Error('At least one AI API key (GEMINI_API_KEY or GROQ_API_KEY) must be set');
      }

      // Generate response using AI router (tries Groq first, falls back to Gemini)
      // Convert null values to undefined for type compatibility
      const aiContext = {
        budget: userContext.budget ?? undefined,
        productGenre: userContext.productGenre ?? undefined,
        revenue: userContext.revenue,
        expenses: userContext.expenses,
        profit: userContext.profit,
        products: userContext.products
      };
      const response = await generateChatResponse(message, aiContext);

      // Save conversation to database (don't fail if this fails)
      try {
        await client.query(
          `INSERT INTO chatbot_conversations (user_id, message, response, context)
           VALUES ($1, $2, $3, $4)`,
          [
            userId,
            message,
            response,
            JSON.stringify(userContext)
          ]
        );
      } catch (saveError: any) {
        console.warn('Error saving conversation:', saveError.message);
        // Continue even if save fails
      }

      return NextResponse.json({
        success: true,
        response
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Chatbot error:', error);
    const errorMessage = error?.message || 'Unknown error';
    
    // Provide helpful error messages with API status
    let userFriendlyError = 'Failed to process message';
    let errorDetails = '';
    
    if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('GROQ_API_KEY')) {
      userFriendlyError = 'AI service is not configured. Please check your API keys.';
      errorDetails = 'No AI API keys found. Please add GEMINI_API_KEY or GROQ_API_KEY to environment variables.';
    } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
      userFriendlyError = 'Connection error. Please check your internet connection.';
      errorDetails = 'Unable to connect to AI service. This might be a network issue.';
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      userFriendlyError = 'Rate limit exceeded. Please wait a moment and try again.';
      errorDetails = 'AI service is rate limiting requests. Cooldown: ~30 seconds.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = 'Request timed out. The AI service is taking too long to respond.';
      errorDetails = 'Response time exceeded. This might indicate the AI service is overloaded.';
    } else if (errorMessage.includes('Unauthorized') || errorMessage.includes('token')) {
      userFriendlyError = 'Please sign in to use the chatbot.';
      errorDetails = 'Authentication required. Please sign in and try again.';
    } else {
      errorDetails = errorMessage;
    }
    
    return NextResponse.json(
      { 
        error: userFriendlyError,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

