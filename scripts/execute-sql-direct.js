/**
 * Execute SQL directly to Supabase
 * This script executes the SQL from init-supabase.sql file
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get connection string from environment or command line
const databaseUrl = process.env.DATABASE_URL || process.argv[2];

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not provided!');
  console.log('\nUsage:');
  console.log('  DATABASE_URL="postgresql://..." node scripts/execute-sql-direct.js');
  console.log('  OR');
  console.log('  node scripts/execute-sql-direct.js "postgresql://..."');
  process.exit(1);
}

// Read SQL file
const sqlFile = path.join(__dirname, 'init-supabase.sql');
let sqlScript;
try {
  sqlScript = fs.readFileSync(sqlFile, 'utf8');
} catch (error) {
  console.error('❌ Could not read init-supabase.sql file');
  process.exit(1);
}

console.log('🔗 Connecting to Supabase...');
console.log(`📍 Connection: ${databaseUrl.replace(/:[^:@]+@/, ':****@')}`);

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('supabase') || databaseUrl.includes('neon')
    ? { rejectUnauthorized: false }
    : false,
  connectionTimeoutMillis: 30000,
});

async function executeSQL() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Supabase!');
    
    try {
      console.log('\n📊 Executing SQL script...');
      
      // Split by semicolons and execute each statement
      const statements = sqlScript
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            await client.query(statement);
            // Extract what was created
            const tableMatch = statement.match(/CREATE (?:TABLE|INDEX).*?(\w+)/i);
            const name = tableMatch ? tableMatch[1] : 'object';
            console.log(`   ✅ ${name}`);
            successCount++;
          } catch (error) {
            // Ignore "already exists" errors
            if (error.message.includes('already exists') || error.message.includes('duplicate')) {
              const tableMatch = statement.match(/CREATE (?:TABLE|INDEX).*?(\w+)/i);
              const name = tableMatch ? tableMatch[1] : 'object';
              console.log(`   ⚠️  ${name} (already exists)`);
            } else {
              console.error(`   ❌ Error: ${error.message.split('\n')[0]}`);
              errorCount++;
            }
          }
        }
      }
      
      console.log(`\n📊 Results: ${successCount} successful, ${errorCount} errors`);
      
      // Verify tables
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
      } else {
        console.log(`\n⚠️  Missing: ${missingTables.join(', ')}`);
      }
      
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message || error.toString());
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

executeSQL()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });

