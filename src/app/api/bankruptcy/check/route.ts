import { NextRequest, NextResponse } from 'next/server';
import { analyzeBankruptcyRisk } from '@/lib/gemini';
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
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      // Get comprehensive business data
      const businessDataResult = await client.query(
        `SELECT * FROM business_data WHERE user_id = $1`,
        [userId]
      );

      const businessData = businessDataResult.rows[0];

      if (!businessData) {
        return NextResponse.json(
          { error: 'Business data not found' },
          { status: 404 }
        );
      }

      // Get active missions
      const missionsResult = await client.query(
        `SELECT COUNT(*) as active_missions FROM missions 
         WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      // Get products
      const productsResult = await client.query(
        `SELECT COUNT(*) as product_count, 
         SUM(cost) as total_inventory_cost
         FROM products WHERE user_id = $1`,
        [userId]
      );

      // Prepare data for analysis
      const analysisData = {
        revenue: parseFloat(businessData.revenue || 0),
        expenses: parseFloat(businessData.expenses || 0),
        profit: parseFloat(businessData.profit || 0),
        cashFlow: parseFloat(businessData.cash_flow || 0),
        inventoryValue: parseFloat(businessData.inventory_value || 0),
        outstandingOrders: businessData.outstanding_orders || 0,
        activeMissions: parseInt(missionsResult.rows[0]?.active_missions || 0),
        productCount: parseInt(productsResult.rows[0]?.product_count || 0),
        totalInventoryCost: parseFloat(productsResult.rows[0]?.total_inventory_cost || 0)
      };

      // Analyze with Gemini
      const analysis = await analyzeBankruptcyRisk(analysisData);

      // Update bankruptcy risk score
      const riskScore = analysis.riskScore || analysis.risk_score || 0;
      await client.query(
        `UPDATE business_data 
         SET bankruptcy_risk_score = $1, last_updated = CURRENT_TIMESTAMP
         WHERE user_id = $2`,
        [riskScore, userId]
      );

      return NextResponse.json({
        success: true,
        analysis,
        businessData: analysisData
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Bankruptcy check error:', error);
    return NextResponse.json(
      { error: 'Failed to check bankruptcy risk', details: error.message },
      { status: 500 }
    );
  }
}

