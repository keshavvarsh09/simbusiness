import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateMissionsFromEvents, getStandardMissionTemplates } from '@/lib/mission-generator';

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

// Mission templates - time-bound business problems
const missionTemplates = [
  {
    title: 'Delayed Supplier Shipment',
    description: 'Your manufacturer has delayed shipment by 2 weeks. You have 10 pending orders that need to be fulfilled. Customers are getting impatient.',
    type: 'supply_chain',
    durationHours: 24,
    costToSolve: 500,
    impact: { sales: -15, customerSatisfaction: -20 }
  },
  {
    title: 'Stock Management Crisis',
    description: 'You\'ve run out of your best-selling product. Orders are piling up but you have no inventory. Quick decisions needed!',
    type: 'inventory',
    durationHours: 12,
    costToSolve: 300,
    impact: { sales: -25, reputation: -15 }
  },
  {
    title: 'Logistics Partner Delay',
    description: 'Your delivery partner has delayed all shipments by 3 days. 15 customers are waiting. You need to keep them happy.',
    type: 'logistics',
    durationHours: 18,
    costToSolve: 400,
    impact: { customerSatisfaction: -25, refunds: 10 }
  },
  {
    title: 'Payment Gateway Issue',
    description: 'Your payment processor is down. Customers can\'t complete purchases. Revenue is being lost every minute.',
    type: 'technical',
    durationHours: 6,
    costToSolve: 200,
    impact: { sales: -30 }
  },
  {
    title: 'Negative Review Crisis',
    description: 'A viral negative review is affecting your brand. You need to respond quickly to prevent further damage.',
    type: 'reputation',
    durationHours: 8,
    costToSolve: 150,
    impact: { sales: -20, reputation: -30 }
  },
  {
    title: 'Competitor Price War',
    description: 'A major competitor just dropped prices by 30%. Your sales have dropped. You need to respond strategically.',
    type: 'competition',
    durationHours: 48,
    costToSolve: 800,
    impact: { sales: -35, profitMargin: -15 }
  }
];

// GET - Fetch user missions
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, 
                event_source, affected_location, news_url, created_at
         FROM missions
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        missions: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Get missions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new mission (auto-generated from events or manual)
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { autoGenerate, locations } = body;

    const client = await pool.connect();
    try {
      let template;
      
      // Auto-generate from real-world events if requested
      if (autoGenerate) {
        const userLocations = locations || ['India', 'Delhi', 'Mumbai'];
        const eventMissions = await generateMissionsFromEvents(userLocations);
        
        if (eventMissions.length > 0) {
          // Select a random event-based mission
          template = eventMissions[Math.floor(Math.random() * eventMissions.length)];
        } else {
          // Fallback to standard templates
          const standardTemplates = getStandardMissionTemplates();
          template = standardTemplates[Math.floor(Math.random() * standardTemplates.length)];
        }
      } else {
        // Use standard templates
        const standardTemplates = getStandardMissionTemplates();
        template = standardTemplates[Math.floor(Math.random() * standardTemplates.length)];
      }
      
      // Calculate deadline
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + template.durationHours);

      const result = await client.query(
        `INSERT INTO missions (user_id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, event_source, affected_location, news_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id, title, description, mission_type, deadline, status, cost_to_solve, impact_on_business, event_source, affected_location, news_url, created_at`,
        [
          userId,
          template.title,
          template.description,
          template.type,
          deadline,
          'active',
          template.costToSolve,
          JSON.stringify(template.impact),
          template.eventSource || null,
          template.affectedLocation || null,
          template.newsUrl || null
        ]
      );

      return NextResponse.json({
        success: true,
        mission: result.rows[0]
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Create mission error:', error);
    return NextResponse.json(
      { error: 'Failed to create mission', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update mission status (solve mission)
export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { missionId, action } = body; // action: 'solve' or 'fail'

    const client = await pool.connect();
    try {
      // Get mission
      const missionResult = await client.query(
        'SELECT * FROM missions WHERE id = $1 AND user_id = $2',
        [missionId, userId]
      );

      if (missionResult.rows.length === 0) {
        return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
      }

      const mission = missionResult.rows[0];

      if (action === 'solve') {
        // Check if user has enough budget in wallet
        const userResult = await client.query(
          'SELECT budget FROM users WHERE id = $1',
          [userId]
        );
        const userBudget = parseFloat(userResult.rows[0]?.budget || '0');

        if (userBudget < mission.cost_to_solve) {
          return NextResponse.json(
            { 
              error: 'Insufficient funds to solve this mission',
              details: `You need $${mission.cost_to_solve} but only have $${userBudget.toFixed(2)} in your wallet.`
            },
            { status: 400 }
          );
        }

        // Deduct cost from user budget
        const newBudget = userBudget - mission.cost_to_solve;
        await client.query(
          'UPDATE users SET budget = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
          [newBudget, userId]
        );

        // Update business_data expenses
        await client.query(
          `UPDATE business_data 
           SET expenses = expenses + $1, profit = revenue - (expenses + $1), cash_flow = revenue - (expenses + $1)
           WHERE user_id = $2`,
          [mission.cost_to_solve, userId]
        );

        // Log transaction
        await client.query(
          `INSERT INTO budget_transactions (user_id, transaction_type, amount, description, metadata)
           VALUES ($1, 'spend', $2, $3, $4)`,
          [
            userId,
            mission.cost_to_solve,
            `Solved mission: ${mission.title}`,
            JSON.stringify({ missionId, missionTitle: mission.title })
          ]
        );
      }

      // Update mission status
      await client.query(
        'UPDATE missions SET status = $1 WHERE id = $2',
        [action === 'solve' ? 'completed' : 'failed', missionId]
      );

      return NextResponse.json({
        success: true,
        message: action === 'solve' ? 'Mission completed successfully' : 'Mission failed'
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Update mission error:', error);
    return NextResponse.json(
      { error: 'Failed to update mission', details: error.message },
      { status: 500 }
    );
  }
}

