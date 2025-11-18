/**
 * Dropshipping Checklist API
 * GET: Get all checklist steps and user progress
 * POST: Initialize checklist steps in database
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

// GET - Get checklist steps and user progress
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Check if steps exist in database, if not initialize them
      const stepsCheck = await client.query(
        'SELECT COUNT(*) as count FROM dropshipping_checklist_steps'
      );
      
      if (parseInt(stepsCheck.rows[0].count) === 0) {
        // Initialize checklist steps
        for (const step of DROPSHIPPING_CHECKLIST) {
          await client.query(
            `INSERT INTO dropshipping_checklist_steps 
             (step_number, section, title, description, checklist_actions, dependencies, resources)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (step_number) DO NOTHING`,
            [
              step.stepNumber,
              step.section,
              step.title,
              step.description,
              JSON.stringify(step.checklistActions),
              step.dependencies,
              JSON.stringify(step.resources)
            ]
          );
        }
      }

      // Get all steps
      const stepsResult = await client.query(
        'SELECT * FROM dropshipping_checklist_steps ORDER BY step_number'
      );

      // Get user progress
      const progressResult = await client.query(
        'SELECT * FROM dropshipping_progress WHERE user_id = $1',
        [userId]
      );

      const progressMap: Record<number, any> = {};
      progressResult.rows.forEach((row: any) => {
        progressMap[row.step_number] = {
          status: row.status,
          completedAt: row.completed_at,
          notes: row.notes,
          checklistData: row.checklist_data
        };
      });

      // Combine steps with progress
      const stepsWithProgress = stepsResult.rows.map((step: any) => {
        const progress = progressMap[step.step_number] || {
          status: 'pending',
          completedAt: null,
          notes: null,
          checklistData: null
        };

        return {
          stepNumber: step.step_number,
          section: step.section,
          title: step.title,
          description: step.description,
          checklistActions: step.checklist_actions,
          dependencies: step.dependencies || [],
          resources: step.resources || [],
          progress: progress,
          // Get MCQ from static data
          mcq: DROPSHIPPING_CHECKLIST.find(s => s.stepNumber === step.step_number)?.mcq
        };
      });

      // Calculate progress summary
      const completedSteps = stepsWithProgress.filter(s => s.progress.status === 'completed');
      const inProgressSteps = stepsWithProgress.filter(s => s.progress.status === 'in_progress');
      const totalSteps = stepsWithProgress.length;
      const completionPercentage = Math.round((completedSteps.length / totalSteps) * 100);

      // Get next suggested step
      const nextStep = stepsWithProgress.find(
        step => step.progress.status === 'pending' && 
        (step.dependencies.length === 0 || 
         step.dependencies.every((dep: number) => 
           stepsWithProgress.find(s => s.stepNumber === dep)?.progress.status === 'completed'
         ))
      );

      return NextResponse.json({
        success: true,
        steps: stepsWithProgress,
        summary: {
          totalSteps,
          completedSteps: completedSteps.length,
          inProgressSteps: inProgressSteps.length,
          pendingSteps: totalSteps - completedSteps.length - inProgressSteps.length,
          completionPercentage,
          nextSuggestedStep: nextStep ? nextStep.stepNumber : null
        }
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get checklist error:', error);
    return NextResponse.json(
      { error: 'Failed to get checklist', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Initialize checklist (admin/one-time setup)
export async function POST(request: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      // Initialize all checklist steps
      for (const step of DROPSHIPPING_CHECKLIST) {
        await client.query(
          `INSERT INTO dropshipping_checklist_steps 
           (step_number, section, title, description, checklist_actions, dependencies, resources)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (step_number) DO UPDATE SET
           section = EXCLUDED.section,
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           checklist_actions = EXCLUDED.checklist_actions,
           dependencies = EXCLUDED.dependencies,
           resources = EXCLUDED.resources`,
          [
            step.stepNumber,
            step.section,
            step.title,
            step.description,
            JSON.stringify(step.checklistActions),
            step.dependencies,
            JSON.stringify(step.resources)
          ]
        );
      }

      return NextResponse.json({
        success: true,
        message: `Initialized ${DROPSHIPPING_CHECKLIST.length} checklist steps`
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Initialize checklist error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize checklist', details: error.message },
      { status: 500 }
    );
  }
}

