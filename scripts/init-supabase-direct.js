/**
 * Direct Supabase Database Initialization
 * This script connects directly to Supabase and creates all tables
 * 
 * Usage: 
 *   1. Set DATABASE_URL in .env.local or pass as environment variable
 *   2. Run: node scripts/init-supabase-direct.js
 * 
 * Or with connection string:
 *   DATABASE_URL="postgresql://..." node scripts/init-supabase-direct.js
 */

const { Pool } = require('pg');
// Try to load .env.local if dotenv is available (optional)
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, that's okay - we can use environment variables directly
}

const SQL_SCRIPT = `
-- Users table
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
);

-- Products table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Business data table
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
);

-- Simulation state table
CREATE TABLE IF NOT EXISTS simulation_state (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  day INTEGER DEFAULT 0,
  marketing_budget DECIMAL(12, 2) DEFAULT 0,
  metrics JSONB DEFAULT '{"conversionRate": 2.7, "abandonmentRate": 68, "averageOrderValue": 47, "returnRate": 8}',
  simulation_history JSONB DEFAULT '{"profit": []}',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Missions table
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
);

-- Analytics table
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
);

-- Chatbot conversations table
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand building tasks table
CREATE TABLE IF NOT EXISTS brand_building_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  content_url TEXT,
  engagement_metrics JSONB,
  gemini_feedback JSONB,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  campaign_type VARCHAR(50),
  budget DECIMAL(12, 2),
  recommendations TEXT,
  gemini_strategy JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_active_dashboard ON products(active_in_dashboard);
CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_user_id ON chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_business_data_user_id ON business_data(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_state_user_id ON simulation_state(user_id);
`;

async function initSupabaseDirect() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found!');
    console.log('\n📝 Please set DATABASE_URL:');
    console.log('   1. Create .env.local file with:');
    console.log('      DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres');
    console.log('\n   2. Or pass it directly:');
    console.log('      DATABASE_URL="postgresql://..." node scripts/init-supabase-direct.js');
    console.log('\n💡 Get your connection string from:');
    console.log('   https://supabase.com/dashboard → Your Project → Settings → Database');
    process.exit(1);
  }

  console.log('🔗 Connecting to Supabase...');
  console.log(`📍 Connection: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`); // Hide password

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') || databaseUrl.includes('neon')
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: 30000, // Increased to 30 seconds
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase!');
    
    try {
      console.log('\n📊 Creating database tables...');
      
      // Split SQL script by semicolons and execute each statement
      const statements = SQL_SCRIPT.split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            await client.query(statement);
            // Extract table/index name for logging
            const match = statement.match(/CREATE (?:TABLE|INDEX).*?(\w+)/i);
            const name = match ? match[1] : 'object';
            console.log(`   ✅ Created ${name}`);
          } catch (error) {
            // Ignore "already exists" errors
            if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
              console.warn(`   ⚠️  Warning: ${error.message.split('\n')[0]}`);
            }
          }
        }
      }
      
      // Verify tables were created
      console.log('\n🔍 Verifying tables...');
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      
      const createdTables = tablesResult.rows.map(row => row.table_name);
      const expectedTables = [
        'users',
        'products',
        'business_data',
        'simulation_state',
        'missions',
        'analytics',
        'chatbot_conversations',
        'brand_building_tasks',
        'ad_campaigns'
      ];
      
      console.log(`\n📋 Found ${createdTables.length} tables:`);
      expectedTables.forEach(table => {
        const exists = createdTables.includes(table);
        console.log(`   ${exists ? '✅' : '❌'} ${table}`);
      });
      
      const missingTables = expectedTables.filter(table => !createdTables.includes(table));
      if (missingTables.length === 0) {
        console.log('\n🎉 All tables created successfully!');
        console.log('\n✅ Next steps:');
        console.log('   1. Update DATABASE_URL in Vercel environment variables');
        console.log('   2. Redeploy your Vercel app');
        console.log('   3. Test: Visit /api/test-db');
      } else {
        console.log(`\n⚠️  ${missingTables.length} table(s) missing: ${missingTables.join(', ')}`);
      }
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message || error.toString());
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    
    if (error.message && (error.message.includes('timeout') || error.message.includes('ECONNREFUSED'))) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check if your Supabase project is active (not paused)');
      console.log('   2. Verify the connection string is correct');
      console.log('   3. Try using connection pooling URL (port 6543)');
    } else if (error.message.includes('password') || error.message.includes('authentication')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Verify the password in your connection string');
      console.log('   2. Check if you\'re using the correct database user');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initSupabaseDirect()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

