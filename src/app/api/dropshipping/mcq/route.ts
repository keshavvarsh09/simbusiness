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
    const { stepNumber, questionText, selectedAnswer, allOptions, correctAnswer, feedback, explanation, isAiGenerated } = body;

    if (!stepNumber || !questionText || !selectedAnswer) {
      return NextResponse.json(
        { error: 'stepNumber, questionText, and selectedAnswer are required' },
        { status: 400 }
      );
    }

    // Determine if answer is correct
    let isCorrect = false;
    let finalFeedback = feedback;
    let finalExplanation = explanation;

    // If AI-generated, use provided correctAnswer
    if (isAiGenerated && correctAnswer) {
      isCorrect = correctAnswer.toLowerCase() === selectedAnswer.toLowerCase();
    } else {
      // Fallback to static MCQ check
      const step = DROPSHIPPING_CHECKLIST.find(s => s.stepNumber === stepNumber);
      if (step && step.mcq) {
        isCorrect = step.mcq.correctAnswer.toLowerCase() === selectedAnswer.toLowerCase();
        finalFeedback = isCorrect ? step.mcq.feedback.correct : step.mcq.feedback.incorrect;
        finalExplanation = step.mcq.feedback.explanation;
      }
    }

    const client = await pool.connect();
    try {
      // Build full context object for storage
      const questionContext = isAiGenerated && allOptions ? {
        isAiGenerated: true,
        allOptions,
        correctAnswer,
        feedback,
        explanation,
        generatedAt: new Date().toISOString()
      } : null;

      // Store full context: question, all options, selected answer, correctness, and metadata
      await client.query(
        `INSERT INTO dropshipping_mcq_answers 
         (user_id, step_number, question_text, selected_answer, is_correct, feedback_shown, question_context)
         VALUES ($1, $2, $3, $4, $5, true, $6)
         ON CONFLICT (user_id, step_number, question_text) DO UPDATE SET
         selected_answer = EXCLUDED.selected_answer,
         is_correct = EXCLUDED.is_correct,
         feedback_shown = true,
         question_context = EXCLUDED.question_context,
         created_at = CURRENT_TIMESTAMP`,
        [
          userId,
          stepNumber,
          questionText,
          selectedAnswer,
          isCorrect,
          questionContext ? JSON.stringify(questionContext) : null
        ]
      );

      return NextResponse.json({
        success: true,
        isCorrect,
        feedback: finalFeedback,
        explanation: finalExplanation
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


