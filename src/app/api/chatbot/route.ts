import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini } from '@/lib/gemini';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

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
      const userResult = await client.query(
        `SELECT u.budget, u.product_genre, 
         bd.revenue, bd.expenses, bd.profit,
         (SELECT COUNT(*) FROM products WHERE user_id = u.id) as product_count
         FROM users u
         LEFT JOIN business_data bd ON u.id = bd.user_id
         WHERE u.id = $1`,
        [userId]
      );
      const user = userResult.rows[0];

      const userContext = {
        budget: user?.budget,
        productGenre: user?.product_genre,
        revenue: user?.revenue || 0,
        expenses: user?.expenses || 0,
        profit: user?.profit || 0,
        products: { length: user?.product_count || 0 }
      };

      // Get conversation history (last 5 messages for context)
      const historyResult = await client.query(
        `SELECT message, response FROM chatbot_conversations 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 5`,
        [userId]
      );

      // Generate response with Gemini
      const response = await chatWithGemini(message, userContext);

      // Save conversation to database
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

      return NextResponse.json({
        success: true,
        response
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: error.message },
      { status: 500 }
    );
  }
}

