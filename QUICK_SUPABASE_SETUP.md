# 🚀 Quick Supabase Setup Guide

## Step-by-Step Instructions

### 1️⃣ Get Your Supabase Connection String

1. **Go to**: https://supabase.com/dashboard
2. **Select** your project (or create new one)
3. **Click**: Settings (⚙️) → **Database**
4. **Scroll to**: "Connection string" section
5. **Copy** the **URI** (Connection Pooling recommended for Vercel)
   - Format: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

### 2️⃣ Test Connection Locally (Optional)

1. **Create** `.env.local` file in project root:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

2. **Run verification script**:
   ```bash
   npm run verify-db
   ```

   This will:
   - ✅ Test your connection
   - ✅ Check if tables exist
   - ✅ Show what's missing

### 3️⃣ Create Tables in Supabase

**Option A: Using Supabase SQL Editor (Easiest)**

1. **Go to**: https://supabase.com/dashboard → Your Project
2. **Click**: **SQL Editor** (left sidebar)
3. **Click**: **New Query**
4. **Open**: `scripts/init-supabase.sql` in your project
5. **Copy** all the SQL code
6. **Paste** into Supabase SQL Editor
7. **Click**: **Run** (or press Ctrl+Enter)
8. **Wait** for "Success. No rows returned"

**Option B: Using API Endpoint (After Vercel Setup)**

1. Set `DATABASE_URL` in Vercel (see Step 4)
2. Visit: `https://your-app.vercel.app/api/init-db`
3. Tables will be created automatically

### 4️⃣ Update Vercel Environment Variables

1. **Go to**: https://vercel.com/dashboard
2. **Select**: Your project
3. **Click**: **Settings** → **Environment Variables**
4. **Add/Update** `DATABASE_URL`:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (from Step 1)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
5. **Click**: **Save**
6. **Redeploy**: Go to Deployments → Click "..." → Redeploy

### 5️⃣ Verify Everything Works

After redeploying:

1. **Test connection**: 
   ```
   https://your-app.vercel.app/api/test-db
   ```
   Should return: `{"success": true, "message": "Database connected"}`

2. **Initialize tables** (if not done manually):
   ```
   https://your-app.vercel.app/api/init-db
   ```
   Should return: `{"success": true, "tables": [...]}`

3. **Try signing up**: Create a new account on your app

## ✅ Checklist

- [ ] Got Supabase connection string
- [ ] Created tables in Supabase (SQL Editor or API)
- [ ] Set `DATABASE_URL` in Vercel
- [ ] Redeployed Vercel app
- [ ] Tested connection (`/api/test-db`)
- [ ] Verified tables exist (`/api/init-db`)

## 🆘 Troubleshooting

### "Database connection failed"
- ✅ Check Supabase project is **active** (not paused)
- ✅ Verify `DATABASE_URL` format is correct
- ✅ Use connection pooling URL (port 6543) for Vercel
- ✅ Check password in connection string

### "Table does not exist"
- ✅ Run `scripts/init-supabase.sql` in Supabase SQL Editor
- ✅ Or visit `/api/init-db` after setting `DATABASE_URL`

### "Permission denied"
- ✅ Make sure you're using `postgres` user
- ✅ Check database user has CREATE TABLE permissions

## 📚 Need More Help?

- **Detailed guide**: See `SUPABASE_SETUP.md`
- **SQL script**: `scripts/init-supabase.sql`
- **Test locally**: `npm run verify-db`

