import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/simbusiness',
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Initialize database schema
export async function initDatabase() {
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const client = await pool.connect();
  try {
    // Test connection first
    await client.query('SELECT NOW()');
    console.log('Database connection verified');
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        budget DECIMAL(12, 2),
        product_genre VARCHAR(100),
        product_name VARCHAR(255),
        learning_profile JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add learning_profile column if it doesn't exist (for existing DBs)
    try {
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS learning_profile JSONB
      `);
    } catch (e: any) {
      // Column might already exist
    }

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        source_url TEXT,
        cost DECIMAL(12, 2),
        selling_price DECIMAL(12, 2),
        moq INTEGER,
        vendor_name VARCHAR(255),
        vendor_platform VARCHAR(50),
        competition_analysis JSONB,
        feasibility_analysis JSONB,
        gemini_analysis JSONB,
        active_in_dashboard BOOLEAN DEFAULT true,
        seasonality_factor DECIMAL(5, 2) DEFAULT 1.0,
        trend_factor DECIMAL(5, 2) DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add seasonality and trend columns if they don't exist
    try {
      await client.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS seasonality_factor DECIMAL(5, 2) DEFAULT 1.0
      `);
      await client.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS trend_factor DECIMAL(5, 2) DEFAULT 1.0
      `);
    } catch (e: any) {
      console.warn('Warning: Could not add seasonality/trend columns:', e.message);
    }

    // Product budget allocations
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_budget_allocations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        allocated_budget DECIMAL(12, 2) DEFAULT 0,
        used_budget DECIMAL(12, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    // Budget transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS budget_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(12, 2) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Product performance tracking
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_performance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        orders INTEGER DEFAULT 0,
        revenue DECIMAL(12, 2) DEFAULT 0,
        expenses DECIMAL(12, 2) DEFAULT 0,
        profit DECIMAL(12, 2) DEFAULT 0,
        marketing_spend DECIMAL(12, 2) DEFAULT 0,
        seasonality_applied DECIMAL(5, 2) DEFAULT 1.0,
        trend_applied DECIMAL(5, 2) DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, date)
      )
    `);

    // Add SKU column to products if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE products 
        ADD COLUMN IF NOT EXISTS sku VARCHAR(100)
      `);
    } catch (e: any) {
      console.warn('Warning: Could not add sku column:', e.message);
    }

    // Product SKU Inventory
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_inventory (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        sku VARCHAR(100) NOT NULL,
        quantity INTEGER DEFAULT 0,
        reserved_quantity INTEGER DEFAULT 0,
        reorder_point INTEGER DEFAULT 10,
        reorder_quantity INTEGER DEFAULT 20,
        last_restocked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id, sku)
      )
    `);

    // Ensure active_in_dashboard column exists (for existing databases)
    try {
      const columnCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='products' AND column_name='active_in_dashboard'
      `);

      if (columnCheck.rows.length === 0) {
        // Column doesn't exist, add it
        await client.query(`
          ALTER TABLE products 
          ADD COLUMN active_in_dashboard BOOLEAN DEFAULT true
        `);
        console.log('Added active_in_dashboard column to products table');
      }
    } catch (e: any) {
      // If error is not about column already existing, log it
      if (!e.message?.includes('already exists') && !e.message?.includes('duplicate')) {
        console.warn('Warning: Could not add active_in_dashboard column:', e.message);
      }
    }

    // Missions table (time-bound problems)
    await client.query(`
      CREATE TABLE IF NOT EXISTS missions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        mission_type VARCHAR(50) NOT NULL,
        deadline TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        cost_to_solve DECIMAL(12, 2),
        impact_on_business JSONB,
        event_source VARCHAR(50),
        affected_location VARCHAR(255),
        news_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics table (Meta dashboard insights, etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        analytics_type VARCHAR(50) NOT NULL,
        image_url TEXT,
        raw_data JSONB,
        gemini_analysis JSONB,
        profitability_score DECIMAL(5, 2),
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Chatbot conversations
    await client.query(`
      CREATE TABLE IF NOT EXISTS chatbot_conversations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        context JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User business data (for simulation state)
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_data (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        revenue DECIMAL(12, 2) DEFAULT 0,
        expenses DECIMAL(12, 2) DEFAULT 0,
        profit DECIMAL(12, 2) DEFAULT 0,
        cash_flow DECIMAL(12, 2) DEFAULT 0,
        inventory_value DECIMAL(12, 2) DEFAULT 0,
        outstanding_orders INTEGER DEFAULT 0,
        bankruptcy_risk_score DECIMAL(5, 2) DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Simulation state (day, metrics, etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS simulation_state (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        day INTEGER DEFAULT 0,
        marketing_budget DECIMAL(12, 2) DEFAULT 0,
        metrics JSONB DEFAULT '{"conversionRate": 2.7, "abandonmentRate": 68, "averageOrderValue": 47, "returnRate": 8}',
        simulation_history JSONB DEFAULT '{"profit": []}',
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Brand building tasks
    await client.query(`
      CREATE TABLE IF NOT EXISTS brand_building_tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        content_url TEXT,
        engagement_metrics JSONB,
        gemini_feedback JSONB,
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ads campaigns
    await client.query(`
      CREATE TABLE IF NOT EXISTS ad_campaigns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        platform VARCHAR(50) NOT NULL,
        campaign_type VARCHAR(50),
        budget DECIMAL(12, 2),
        recommendations TEXT,
        gemini_strategy JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Dropshipping checklist steps (static reference data)
    await client.query(`
      CREATE TABLE IF NOT EXISTS dropshipping_checklist_steps (
        id SERIAL PRIMARY KEY,
        step_number INTEGER NOT NULL UNIQUE,
        section VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        checklist_actions JSONB,
        dependencies INTEGER[],
        resources JSONB,
        reflection_prompts JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Dropshipping progress (user-specific progress tracking)
    await client.query(`
      CREATE TABLE IF NOT EXISTS dropshipping_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        step_number INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        completed_at TIMESTAMP,
        notes TEXT,
        checklist_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, step_number)
      )
    `);

    // Dropshipping MCQ answers
    await client.query(`
      CREATE TABLE IF NOT EXISTS dropshipping_mcq_answers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        step_number INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        selected_answer VARCHAR(10),
        is_correct BOOLEAN,
        feedback_shown BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, step_number, question_text)
      )
    `);

    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_chatbot_user_id ON chatbot_conversations(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_data_user_id ON business_data(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_dropshipping_progress_user_id ON dropshipping_progress(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_dropshipping_progress_step ON dropshipping_progress(step_number)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_dropshipping_mcq_user_id ON dropshipping_mcq_answers(user_id)`);

    console.log('Database initialized successfully');
  } catch (error: any) {
    console.error('Error initializing database:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);

    // Provide more specific error messages
    if (error?.message?.includes('connection') || error?.message?.includes('timeout') || error?.message?.includes('ECONNREFUSED')) {
      throw new Error(`Database connection failed: ${error.message}. Please check your DATABASE_URL and ensure the database server is accessible.`);
    }

    if (error?.message?.includes('permission') || error?.message?.includes('denied')) {
      throw new Error(`Database permission denied: ${error.message}. Please check your database user has CREATE TABLE permissions.`);
    }

    if (error?.message?.includes('authentication') || error?.message?.includes('password')) {
      throw new Error(`Database authentication failed: ${error.message}. Please check your DATABASE_URL credentials.`);
    }

    if (error?.message?.includes('DATABASE_URL')) {
      throw error; // Already has good message
    }

    throw new Error(`Database initialization failed: ${error?.message || 'Unknown error'}`);
  } finally {
    client.release();
  }
}

export default pool;

