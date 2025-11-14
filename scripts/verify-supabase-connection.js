/**
 * Supabase Connection Verification Script
 * Run this to test your Supabase connection before deploying
 * 
 * Usage: node scripts/verify-supabase-connection.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function verifyConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('\n📝 Please set DATABASE_URL in your .env.local file:');
    console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres');
    console.log('\n💡 Get your connection string from:');
    console.log('   https://supabase.com/dashboard → Your Project → Settings → Database');
    process.exit(1);
  }

  console.log('🔍 Testing Supabase connection...');
  console.log(`📍 Connection string: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`); // Hide password

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('supabase') || databaseUrl.includes('neon')
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    try {
      // Test basic connection
      const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
      console.log('✅ Connection successful!');
      console.log(`   Current time: ${result.rows[0].current_time}`);
      console.log(`   PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);

      // Check if tables exist
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const existingTables = tablesResult.rows.map(row => row.table_name);
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

      console.log(`\n📊 Found ${existingTables.length} tables in database`);
      
      if (existingTables.length === 0) {
        console.log('⚠️  No tables found. You need to initialize the database.');
        console.log('\n📝 Next steps:');
        console.log('   1. Run the SQL script in Supabase SQL Editor:');
        console.log('      - Go to https://supabase.com/dashboard');
        console.log('      - Your Project → SQL Editor → New Query');
        console.log('      - Copy contents of scripts/init-supabase.sql');
        console.log('      - Paste and Run');
        console.log('\n   OR');
        console.log('   2. Visit your deployed app: /api/init-db');
      } else {
        console.log('\n✅ Existing tables:');
        existingTables.forEach(table => {
          const isExpected = expectedTables.includes(table);
          console.log(`   ${isExpected ? '✅' : '⚠️ '} ${table}`);
        });

        const missingTables = expectedTables.filter(table => !existingTables.includes(table));
        if (missingTables.length > 0) {
          console.log('\n⚠️  Missing tables:');
          missingTables.forEach(table => {
            console.log(`   ❌ ${table}`);
          });
          console.log('\n📝 Run the initialization script to create missing tables.');
        } else {
          console.log('\n✅ All required tables exist!');
        }
      }

      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check if your Supabase project is active (not paused)');
      console.log('   2. Verify the connection string is correct');
      console.log('   3. Check if your IP is allowed (if using IP restrictions)');
      console.log('   4. Try using connection pooling URL (port 6543)');
    } else if (error.message.includes('password') || error.message.includes('authentication')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Verify the password in your connection string');
      console.log('   2. Check if you\'re using the correct database user');
    } else if (error.message.includes('permission')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure you\'re using the postgres user');
      console.log('   2. Check database user permissions');
    }
    
    return false;
  } finally {
    await pool.end();
  }
}

// Run verification
verifyConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Connection verification complete!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

