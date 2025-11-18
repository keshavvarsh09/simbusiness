-- Supabase Database Initialization Script
-- Run this in your Supabase SQL Editor to create all required tables

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
  seasonality_factor DECIMAL(5, 2) DEFAULT 1.0, -- Multiplier for seasonal demand (0.5-2.0)
  trend_factor DECIMAL(5, 2) DEFAULT 1.0, -- Multiplier for trending products (0.8-1.5)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product budget allocations (per-product budget tracking)
CREATE TABLE IF NOT EXISTS product_budget_allocations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  allocated_budget DECIMAL(12, 2) DEFAULT 0,
  used_budget DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- Budget transactions (wallet transactions)
CREATE TABLE IF NOT EXISTS budget_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'deposit', 'allocation', 'spend', 'refund'
  amount DECIMAL(12, 2) NOT NULL,
  description TEXT,
  metadata JSONB, -- Additional context (product IDs, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product performance tracking (daily stats per product)
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

-- Dropshipping checklist steps (static reference data)
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
);

-- Dropshipping progress (user-specific progress tracking)
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
);

-- Dropshipping MCQ answers
CREATE TABLE IF NOT EXISTS dropshipping_mcq_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  selected_answer VARCHAR(10),
  is_correct BOOLEAN,
  feedback_shown BOOLEAN DEFAULT false,
  question_context JSONB, -- Stores full MCQ context: options, correctAnswer, feedback, explanation, isAiGenerated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, step_number, question_text)
);

-- Add question_context column if it doesn't exist (for existing databases)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'dropshipping_mcq_answers' AND column_name = 'question_context'
  ) THEN
    ALTER TABLE dropshipping_mcq_answers ADD COLUMN question_context JSONB;
  END IF;
END $$;

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
CREATE INDEX IF NOT EXISTS idx_dropshipping_progress_user_id ON dropshipping_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_dropshipping_progress_step ON dropshipping_progress(step_number);
CREATE INDEX IF NOT EXISTS idx_dropshipping_mcq_user_id ON dropshipping_mcq_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_product_budget_user_id ON product_budget_allocations(user_id);
CREATE INDEX IF NOT EXISTS idx_product_budget_product_id ON product_budget_allocations(product_id);
CREATE INDEX IF NOT EXISTS idx_budget_transactions_user_id ON budget_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_user_id ON product_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_product_id ON product_performance(product_id);
CREATE INDEX IF NOT EXISTS idx_product_performance_date ON product_performance(date);

-- Enable Row Level Security (RLS) - Optional but recommended for Supabase
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE business_data ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE simulation_state ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE brand_building_tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;

