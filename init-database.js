// Database Initialization Script
// Run this after deploying to Vercel

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🗄️  Database Initialization');
console.log('============================\n');

rl.question('Enter your Vercel app URL (e.g., https://simbusiness-xyz.vercel.app): ', (url) => {
  const vercelUrl = url.trim();
  const initSecret = 'f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3';
  const initUrl = `${vercelUrl}/api/init-db?secret=${initSecret}`;
  
  console.log('\n🔄 Initializing database...');
  console.log(`URL: ${initUrl}\n`);
  
  fetch(initUrl)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('✅ Database initialized successfully!');
        console.log('Message:', data.message);
      } else {
        console.log('❌ Error:', data.error || 'Unknown error');
      }
    })
    .catch(error => {
      console.log('❌ Failed to initialize database');
      console.log('Error:', error.message);
      console.log('\n💡 Try visiting this URL in your browser:');
      console.log(initUrl);
    })
    .finally(() => {
      rl.close();
    });
});

