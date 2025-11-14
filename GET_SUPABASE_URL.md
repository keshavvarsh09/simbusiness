# 📋 How to Get Your Supabase Connection String

## Quick Steps

### 1. Go to Supabase Dashboard
**URL**: https://supabase.com/dashboard

### 2. Select Your Project
- Click on your project (or create a new one if needed)

### 3. Get Connection String
**Path**: Settings (⚙️) → Database → Connection string

### 4. Choose the Right One

#### Option A: Connection Pooling (Recommended for Vercel)
- Scroll to **"Connection Pooling"** section
- Select **"Session mode"**
- Copy the **"Connection string"**
- Format: `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

#### Option B: Direct Connection
- Scroll to **"Connection string"** section
- Copy the **"URI"** format
- Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`
- **Important**: Replace `[YOUR-PASSWORD]` with your actual password

### 5. Update Vercel
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `DATABASE_URL` with new connection string
3. Redeploy

---

## Current Issue

Your current connection string points to:
```
db.njkxojqmqvnejkqnfeyt.supabase.co
```

This hostname cannot be found, which means:
- Project might be paused
- Connection string is outdated
- Project might have been moved/deleted

**Solution**: Get a fresh connection string from your Supabase dashboard!

---

## Need Help?

1. **Can't find your project?** → Create a new one
2. **Project is paused?** → Click "Resume" or "Restore"
3. **Don't remember password?** → Reset it in Supabase settings

**Once you have the new connection string, update it in Vercel and redeploy!** 🚀



