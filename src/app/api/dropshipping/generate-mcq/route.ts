/**
 * AI-Powered MCQ Generator API
 * Generates personalized, context-aware questions based on user profile, step context, and business situation
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { chatWithGemini } from '@/lib/gemini';
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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepNumber } = body;

    if (!stepNumber || stepNumber < 1 || stepNumber > 22) {
      return NextResponse.json(
        { error: 'Invalid step number. Must be between 1 and 22.' },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      // Get user profile for personalization
      const userResult = await client.query(
        'SELECT id, email, product_genre, budget FROM users WHERE id = $1',
        [userId]
      );
      const user = userResult.rows[0];

      // Get user's progress to understand their journey
      const progressResult = await client.query(
        `SELECT step_number, status, completed_at 
         FROM dropshipping_progress 
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY step_number`,
        [userId]
      );
      const completedSteps = progressResult.rows.map((r: any) => r.step_number);

      // Get the step details
      const step = DROPSHIPPING_CHECKLIST.find(s => s.stepNumber === stepNumber);
      if (!step) {
        return NextResponse.json({ error: 'Step not found' }, { status: 404 });
      }

      // Get user's products for context
      const productsResult = await client.query(
        'SELECT COUNT(*) as count, AVG(cost) as avg_cost FROM products WHERE user_id = $1',
        [userId]
      );
      const productCount = parseInt(productsResult.rows[0]?.count || '0');
      const avgProductCost = parseFloat(productsResult.rows[0]?.avg_cost || '0');

      // Get previous MCQ answers for personalization context
      const previousAnswersResult = await client.query(
        `SELECT step_number, question_text, selected_answer, is_correct, created_at
         FROM dropshipping_mcq_answers 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 10`,
        [userId]
      );
      const previousAnswers = previousAnswersResult.rows.map((r: any) => ({
        step: r.step_number,
        question: r.question_text.substring(0, 100) + '...', // Truncate for context
        answer: r.selected_answer,
        correct: r.is_correct,
        when: r.created_at
      }));

      // Analyze answer patterns
      const correctCount = previousAnswers.filter((a: any) => a.correct).length;
      const totalAnswered = previousAnswers.length;
      const accuracyRate = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

      // Build context for AI
      const userContext = {
        budget: user?.budget || 0,
        productGenre: user?.product_genre || 'general',
        completedSteps,
        currentStep: stepNumber,
        productCount,
        avgProductCost,
        stepTitle: step.title,
        stepDescription: step.description,
        stepSection: step.section,
        previousAnswers,
        answerAccuracy: accuracyRate,
        totalQuestionsAnswered: totalAnswered
      };

      // Generate AI-powered MCQ
      const prompt = `You are an expert business advisor creating critical thinking questions for a dropshipping entrepreneur.

**User Context:**
- Budget: $${userContext.budget}
- Product Genre/Interest: ${userContext.productGenre}
- Completed Steps: ${completedSteps.length}/21 (Steps: ${completedSteps.join(', ') || 'None yet'})
- Current Step: ${stepNumber} - "${step.title}" (${step.section})
- Products Added: ${productCount}
- Average Product Cost: $${avgProductCost.toFixed(2)}
- Previous Questions Answered: ${totalAnswered}
- Answer Accuracy: ${accuracyRate}% (${correctCount}/${totalAnswered} correct)
${previousAnswers.length > 0 ? `
**Previous Answer Patterns (for personalization):**
${previousAnswers.map((a: any, idx: number) => 
  `- Step ${a.step}: ${a.correct ? '✓' : '✗'} ${a.answer.toUpperCase()} - "${a.question}"`
).join('\n')}

**Learning Insights:**
- User shows ${accuracyRate >= 70 ? 'strong' : accuracyRate >= 50 ? 'moderate' : 'developing'} understanding
- ${previousAnswers.filter((a: any) => !a.correct).length > 0 ? 'Focus areas: ' + previousAnswers.filter((a: any) => !a.correct).map((a: any) => `Step ${a.step}`).join(', ') : 'No specific weak areas identified yet'}
- Personalize this question based on their learning journey and previous answer patterns
` : `
**First Question:**
- This is their first MCQ, so make it foundational but engaging
- Set appropriate difficulty level for a beginner
`}

**Step Details:**
- Title: ${step.title}
- Description: ${step.description}
- Section: ${step.section}
- Dependencies: ${step.dependencies.length > 0 ? step.dependencies.join(', ') : 'None'}

**Your Task:**
Create ONE critical thinking multiple-choice question that:
1. Is REALISTIC and based on actual business scenarios entrepreneurs face
2. Tests CRITICAL THINKING about tech vs non-tech decisions, marketing choices, consumer behavior, or technology selection
3. Is PERSONALIZED to their budget ($${userContext.budget}), product genre (${userContext.productGenre}), and current progress
4. Reflects REAL-WORLD challenges at this specific step in their journey
5. Has 4 options (a, b, c, d) where only ONE is clearly the best answer
6. Includes specific details (pricing, features, pros/cons) in the options
7. Covers: technology choices, marketing strategies, consumer psychology, budget allocation, or business operations

**Question Types to Consider:**
- Tech vs Non-tech: "Should I invest in automation tools or hire manual help?"
- Marketing: "Which ad platform should I use given my budget and target audience?"
- Consumer Behavior: "How should I price this product based on customer psychology?"
- Technology Selection: "Which tool/platform fits my technical skills and budget?"
- Budget Allocation: "Where should I invest my limited budget for maximum ROI?"
- Operations: "How should I handle customer service given my current resources?"

**Response Format (JSON only, no markdown):**
{
  "question": "The actual question text here",
  "options": {
    "a": "First option with specific details",
    "b": "Second option with specific details",
    "c": "Third option with specific details",
    "d": "Fourth option with specific details"
  },
  "correctAnswer": "a",
  "feedback": {
    "correct": "Why this answer is correct (2-3 sentences)",
    "incorrect": "Why other answers are wrong and what the correct approach should be (2-3 sentences)",
    "explanation": "Detailed explanation with real-world context, specific examples, and actionable insights (4-6 sentences). Include pros/cons, pricing considerations, and strategic thinking."
  }
}

**Important:**
- Make the question CHALLENGING but fair
- Include REAL numbers, prices, and specific details in options
- The correct answer should be based on best practices for their situation
- Feedback should be educational and help them learn
- Focus on decisions that actually matter for business success

Generate the question now:`;

      let aiResponse;
      try {
        aiResponse = await chatWithGemini(prompt, userContext);
      } catch (geminiError: any) {
        console.error('Gemini API error:', geminiError);
        // Fallback to a default question if AI fails
        return NextResponse.json({
          success: true,
          mcq: {
            question: `You're at Step ${stepNumber}: "${step.title}". Given your budget of $${userContext.budget} and interest in ${userContext.productGenre}, what's the most important factor to consider right now?`,
            options: [
              'Focus on validating demand before investing more budget',
              'Invest all budget immediately to scale fast',
              'Wait until you have more experience',
              'Copy what competitors are doing exactly'
            ],
            correctAnswer: 'a',
            feedback: {
              correct: 'Correct! Validating demand before scaling is crucial. Test with small budgets first.',
              incorrect: 'Validating demand is key. Always test before scaling.',
              explanation: 'In dropshipping, validating demand with small tests before investing heavily is essential. This prevents wasting budget on products that don\'t sell.'
            }
          },
          generatedAt: new Date().toISOString(),
          context: {
            stepNumber,
            userBudget: userContext.budget,
            productGenre: userContext.productGenre,
            fallback: true
          }
        });
      }
      
      // Parse AI response (it should be JSON)
      let mcqData;
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/) || aiResponse.match(/```\s*([\s\S]*?)\s*```/);
        const jsonString = jsonMatch ? jsonMatch[1] : aiResponse;
        mcqData = JSON.parse(jsonString.trim());
      } catch (parseError) {
        // If parsing fails, try to construct MCQ from text response
        console.error('Failed to parse AI response as JSON:', aiResponse);
        // Fallback: return a default question
        return NextResponse.json({
          success: true,
          mcq: {
            question: `You're at Step ${stepNumber}: "${step.title}". Given your budget of $${userContext.budget} and interest in ${userContext.productGenre}, what's the most important factor to consider right now?`,
            options: [
              'Focus on validating demand before investing more budget',
              'Invest all budget immediately to scale fast',
              'Wait until you have more experience',
              'Copy what competitors are doing exactly'
            ],
            correctAnswer: 'a',
            feedback: {
              correct: 'Correct! Validating demand before scaling is crucial. Test with small budgets first.',
              incorrect: 'Validating demand is key. Always test before scaling.',
              explanation: 'In dropshipping, validating demand with small tests before investing heavily is essential. This prevents wasting budget on products that don\'t sell.'
            }
          },
          generatedAt: new Date().toISOString(),
          context: {
            stepNumber,
            userBudget: userContext.budget,
            productGenre: userContext.productGenre,
            fallback: true
          }
        });
      }

      // Validate MCQ structure
      if (!mcqData.question || !mcqData.options || !mcqData.correctAnswer || !mcqData.feedback) {
        return NextResponse.json({
          error: 'Invalid MCQ format from AI',
          details: 'Missing required fields in AI response'
        }, { status: 500 });
      }

      // Convert options object to array format
      const optionsArray = [
        mcqData.options.a,
        mcqData.options.b,
        mcqData.options.c,
        mcqData.options.d
      ].filter(Boolean);

      if (optionsArray.length !== 4) {
        return NextResponse.json({
          error: 'Invalid MCQ format',
          details: 'Must have exactly 4 options'
        }, { status: 500 });
      }

      // Return in the format expected by frontend
      return NextResponse.json({
        success: true,
        mcq: {
          question: mcqData.question,
          options: optionsArray,
          correctAnswer: mcqData.correctAnswer.toLowerCase(),
          feedback: {
            correct: mcqData.feedback.correct,
            incorrect: mcqData.feedback.incorrect,
            explanation: mcqData.feedback.explanation
          }
        },
        generatedAt: new Date().toISOString(),
        context: {
          stepNumber,
          userBudget: userContext.budget,
          productGenre: userContext.productGenre
        }
      });

    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Generate MCQ error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate MCQ', 
        details: error.message,
        hint: 'Make sure GEMINI_API_KEY is set in environment variables'
      },
      { status: 500 }
    );
  }
}

