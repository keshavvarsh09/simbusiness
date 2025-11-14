import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/simbusiness',
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon') 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database schema
export async function initDatabase() {
  const client = await pool.connect();
  try {
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    // User business data (for bankruptcy detection)
    await client.query(`
      CREATE TABLE IF NOT EXISTS business_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        revenue DECIMAL(12, 2) DEFAULT 0,
        expenses DECIMAL(12, 2) DEFAULT 0,
        profit DECIMAL(12, 2) DEFAULT 0,
        cash_flow DECIMAL(12, 2) DEFAULT 0,
        inventory_value DECIMAL(12, 2) DEFAULT 0,
        outstanding_orders INTEGER DEFAULT 0,
        bankruptcy_risk_score DECIMAL(5, 2),
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

    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_chatbot_user_id ON chatbot_conversations(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_business_data_user_id ON business_data(user_id)`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;

