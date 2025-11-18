/**
 * Dropshipping Progress API
 * POST: Update step progress
 */

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

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

// POST - Update step progress
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepNumber, status, notes, checklistData } = body;

    if (!stepNumber || !status) {
      return NextResponse.json(
        { error: 'stepNumber and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const completedAt = status === 'completed' ? new Date() : null;

      await client.query(
        `INSERT INTO dropshipping_progress 
         (user_id, step_number, status, completed_at, notes, checklist_data, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
         ON CONFLICT (user_id, step_number) DO UPDATE SET
         status = EXCLUDED.status,
         completed_at = EXCLUDED.completed_at,
         notes = EXCLUDED.notes,
         checklist_data = EXCLUDED.checklist_data,
         updated_at = CURRENT_TIMESTAMP`,
        [
          userId,
          stepNumber,
          status,
          completedAt,
          notes || null,
          checklistData ? JSON.stringify(checklistData) : null
        ]
      );

      return NextResponse.json({
        success: true,
        message: `Step ${stepNumber} updated to ${status}`
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress', details: error.message },
      { status: 500 }
    );
  }
}


