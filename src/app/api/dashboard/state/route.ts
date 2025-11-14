/**
 * Dashboard State API
 * Saves and loads simulation state to/from database
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

// GET - Load dashboard state
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get business data
      const businessDataResult = await client.query(
        'SELECT * FROM business_data WHERE user_id = $1',
        [userId]
      );

      const businessData = businessDataResult.rows[0] || {
        revenue: 0,
        expenses: 0,
        profit: 0,
        cash_flow: 0,
        inventory_value: 0,
        outstanding_orders: 0
      };

      // Get simulation state
      const simulationStateResult = await client.query(
        'SELECT * FROM simulation_state WHERE user_id = $1',
        [userId]
      );
      const simulationState = simulationStateResult.rows[0] || {
        day: 0,
        marketing_budget: 0,
        metrics: { conversionRate: 2.7, abandonmentRate: 68, averageOrderValue: 47, returnRate: 8 },
        simulation_history: { profit: [] }
      };

      // Get user's products count
      const productsResult = await client.query(
        'SELECT COUNT(*) as count FROM products WHERE user_id = $1',
        [userId]
      );
      const productCount = parseInt(productsResult.rows[0]?.count || '0');

      return NextResponse.json({
        success: true,
        state: {
          revenue: parseFloat(businessData.revenue || 0),
          expenses: parseFloat(businessData.expenses || 0),
          profit: parseFloat(businessData.profit || 0),
          orders: businessData.outstanding_orders || 0,
          inventory: Math.max(0, Math.floor(parseFloat(businessData.inventory_value || 0) / 15)),
          marketing: parseFloat(simulationState.marketing_budget || 0),
          day: simulationState.day || 0,
          metrics: simulationState.metrics || {
            conversionRate: 2.7,
            abandonmentRate: 68,
            averageOrderValue: 47,
            returnRate: 8
          },
          simulationHistory: simulationState.simulation_history || { profit: [] }
        },
        hasProducts: productCount > 0,
        productCount
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Load dashboard state error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard state', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Save dashboard state
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { revenue, expenses, profit, orders, inventory, marketing, day, metrics } = body;

    const client = await pool.connect();
    try {
      // Update business_data
      await client.query(
        `INSERT INTO business_data (user_id, revenue, expenses, profit, cash_flow, inventory_value, outstanding_orders)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           revenue = EXCLUDED.revenue,
           expenses = EXCLUDED.expenses,
           profit = EXCLUDED.profit,
           cash_flow = EXCLUDED.cash_flow,
           inventory_value = EXCLUDED.inventory_value,
           outstanding_orders = EXCLUDED.outstanding_orders,
           last_updated = CURRENT_TIMESTAMP`,
        [
          userId,
          revenue || 0,
          expenses || 0,
          profit || 0,
          (revenue || 0) - (expenses || 0), // cash_flow
          (inventory || 0) * 15, // Convert units to value (assuming $15 per unit)
          orders || 0
        ]
      );

      // Update simulation state
      await client.query(
        `INSERT INTO simulation_state (user_id, day, marketing_budget, metrics, simulation_history)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) 
         DO UPDATE SET 
           day = EXCLUDED.day,
           marketing_budget = EXCLUDED.marketing_budget,
           metrics = EXCLUDED.metrics,
           simulation_history = EXCLUDED.simulation_history,
           last_updated = CURRENT_TIMESTAMP`,
        [
          userId,
          day || 0,
          marketing || 0,
          JSON.stringify(metrics || {}),
          JSON.stringify(body.simulationHistory || { profit: [] })
        ]
      );
      
      return NextResponse.json({
        success: true,
        message: 'Dashboard state saved'
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Save dashboard state error:', error);
    return NextResponse.json(
      { error: 'Failed to save dashboard state', details: error.message },
      { status: 500 }
    );
  }
}

