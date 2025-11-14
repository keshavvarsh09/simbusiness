# 🗄️ Supabase Database Setup Guide

## Quick Setup Steps

### Step 1: Get Your Supabase Connection String

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Copy the **URI** connection string
   - Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **OR** use direct connection: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### Step 2: Initialize Database Tables

**Option A: Using Supabase SQL Editor (Recommended)**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `scripts/init-supabase.sql`
4. Click **Run** (or press Ctrl+Enter)
5. Wait for "Success. No rows returned" message

**Option B: Using the API Endpoint**

1. Make sure `DATABASE_URL` is set in Vercel
2. Visit: `https://your-app.vercel.app/api/init-db`
3. If you set `INIT_DB_SECRET`, use: `https://your-app.vercel.app/api/init-db?secret=YOUR_SECRET`

### Step 3: Verify Tables Were Created

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these tables:
   - ✅ users
   - ✅ products
   - ✅ business_data
   - ✅ simulation_state
   - ✅ missions
   - ✅ analytics
   - ✅ chatbot_conversations
   - ✅ brand_building_tasks
   - ✅ ad_campaigns

### Step 4: Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com)
2. Your project → **Settings** → **Environment Variables**
3. Add/Update `DATABASE_URL`:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (from Step 1)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. Click **Save**
5. **Redeploy** your application

## Connection String Formats

### For Connection Pooling (Recommended for Vercel)
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### For Direct Connection
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

## Troubleshooting

### Error: "Database connection failed"
- ✅ Check if Supabase project is **Active** (not paused)
- ✅ Verify `DATABASE_URL` is correct in Vercel
- ✅ Check if password in connection string is correct
- ✅ Try using connection pooling URL (port 6543) instead of direct connection

### Error: "Permission denied"
- ✅ Make sure you're using the `postgres` user (has full permissions)
- ✅ Check if your Supabase project allows external connections

### Error: "Table already exists"
- ✅ This is normal if tables were already created
- ✅ The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

## Next Steps

After setting up the database:

1. ✅ Test connection: Visit `/api/test-db`
2. ✅ Initialize tables: Visit `/api/init-db` (or run SQL script)
3. ✅ Test the app: Try signing up and adding products

## Need Help?

If you're still having issues:
1. Check Vercel function logs for detailed error messages
2. Verify your Supabase project is active
3. Test the connection string in Supabase SQL Editor
4. Make sure all environment variables are set correctly

