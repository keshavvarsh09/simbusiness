/**
 * Dropshipping MCQ API
 * POST: Save MCQ answer
 * GET: Get MCQ answers for a step
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { DROPSHIPPING_CHECKLIST } from '@/lib/dropshipping-checklist-data';

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

// POST - Save MCQ answer
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepNumber, questionText, selectedAnswer } = body;

    if (!stepNumber || !questionText || !selectedAnswer) {
      return NextResponse.json(
        { error: 'stepNumber, questionText, and selectedAnswer are required' },
        { status: 400 }
      );
    }

    // Get the step to check correct answer
    const step = DROPSHIPPING_CHECKLIST.find(s => s.stepNumber === stepNumber);
    if (!step || !step.mcq) {
      return NextResponse.json(
        { error: 'Step not found or has no MCQ' },
        { status: 404 }
      );
    }

    const isCorrect = step.mcq.correctAnswer.toLowerCase() === selectedAnswer.toLowerCase();
    const feedback = isCorrect ? step.mcq.feedback.correct : step.mcq.feedback.incorrect;

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO dropshipping_mcq_answers 
         (user_id, step_number, question_text, selected_answer, is_correct, feedback_shown)
         VALUES ($1, $2, $3, $4, $5, true)
         ON CONFLICT (user_id, step_number, question_text) DO UPDATE SET
         selected_answer = EXCLUDED.selected_answer,
         is_correct = EXCLUDED.is_correct,
         feedback_shown = true`,
        [
          userId,
          stepNumber,
          questionText,
          selectedAnswer,
          isCorrect
        ]
      );

      return NextResponse.json({
        success: true,
        isCorrect,
        feedback,
        explanation: step.mcq.feedback.explanation
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Save MCQ error:', error);
    return NextResponse.json(
      { error: 'Failed to save MCQ answer', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get MCQ answers for a step
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const stepNumber = searchParams.get('stepNumber');

    if (!stepNumber) {
      return NextResponse.json(
        { error: 'stepNumber is required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM dropshipping_mcq_answers WHERE user_id = $1 AND step_number = $2',
        [userId, parseInt(stepNumber)]
      );

      return NextResponse.json({
        success: true,
        answers: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get MCQ error:', error);
    return NextResponse.json(
      { error: 'Failed to get MCQ answers', details: error.message },
      { status: 500 }
    );
  }
}


