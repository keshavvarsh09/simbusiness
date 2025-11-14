# 🔧 Fix Database Connection Error

## ❌ Error: `ENOTFOUND db.njkxojqmqvnejkqnfeyt.supabase.co`

This means the database hostname cannot be found. This usually happens when:
1. Supabase project is paused (free tier projects pause after inactivity)
2. Connection string is incorrect
3. Project was deleted or moved

---

## ✅ Solution: Get Fresh Connection String from Supabase

### Step 1: Check Supabase Project

1. **Go to**: https://supabase.com
2. **Sign in** to your account
3. **Find your project** (should be named something like `simbusiness` or similar)
4. **Check status**:
   - If it shows "Paused" → Click "Restore" or "Resume"
   - If it shows "Active" → Continue to Step 2
   - If you don't see it → You may need to create a new project

### Step 2: Get Connection String

1. **Click on your project**
2. **Go to**: Settings (⚙️) → **Database**
3. **Scroll to**: "Connection string" section
4. **Copy the connection string**:
   - Look for "URI" format
   - It should look like: `postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **OR** the direct connection: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### Step 3: Use Connection Pooling (Recommended for Vercel)

**For Vercel, use the Connection Pooling URL** (port 6543):

1. In Supabase Dashboard → Settings → Database
2. Scroll to **"Connection Pooling"**
3. Select **"Session mode"** or **"Transaction mode"**
4. Copy the **"Connection string"**
5. It should look like:
   ```
   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Step 4: Update Vercel Environment Variable

1. **Go to**: https://vercel.com
2. **Your project** → **Settings** → **Environment Variables**
3. **Find**: `DATABASE_URL`
4. **Click**: Edit (or Delete and Add new)
5. **Paste**: Your new connection string from Supabase
6. **Make sure**:
   - ✅ Production is selected
   - ✅ Preview is selected
   - ✅ Development is selected
7. **Click**: Save
8. **Go to**: Deployments tab
9. **Click**: Three dots (⋯) → **Redeploy**

---

## 🔄 Alternative: Create New Supabase Project

If your project is gone or you can't access it:

### Step 1: Create New Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Fill in:
   - **Name**: `simbusiness`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### Step 2: Get Connection String

1. Settings → Database
2. Copy the connection string
3. **Important**: Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Update Vercel

Follow Step 4 above with your new connection string.

---

## 📋 Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] Got fresh connection string from Supabase
- [ ] Using Connection Pooling URL (port 6543) for Vercel
- [ ] Updated DATABASE_URL in Vercel
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed on Vercel
- [ ] Tested connection again

---

## 🧪 Test After Update

**After updating and redeploying**, test the connection:

```
https://simbusiness-nine.vercel.app/api/test-db
```

**Expected**: `{"success":true,"message":"Database connection successful",...}`

---

## 🆘 Still Not Working?

**If you still get errors:**

1. **Check Supabase project status** - Make sure it's active
2. **Verify password** - Make sure it matches in connection string
3. **Try direct connection** instead of pooling (port 5432)
4. **Check Vercel logs** for more details
5. **Share the new error message** if different

---

**Once you update the DATABASE_URL in Vercel and redeploy, it should work!** 🚀



