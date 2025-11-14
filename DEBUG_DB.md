# 🔍 Debug Database Connection

## What Error Are You Seeing?

Please tell me:
1. **What error message** do you see? (401, 500, connection error, etc.)
2. **Where** are you seeing it? (browser, Vercel logs, etc.)

---

## 🔧 Test Database Connection

I've created a test endpoint. **After Vercel redeploys** (1-2 minutes), try this:

### Test URL:
```
https://simbusiness-nine.vercel.app/api/test-db
```

This will tell us:
- ✅ If database connection works
- ✅ If DATABASE_URL is set
- ✅ What the actual error is

---

## ✅ Check Environment Variables in Vercel

**Make sure ALL 4 variables are set:**

1. Go to https://vercel.com
2. Your project → **Settings** → **Environment Variables**
3. Verify these exist:

| Variable | Should Be Set To |
|---------|------------------|
| `DATABASE_URL` | `postgresql://postgres:Simbus@9999@db.njkxojqmqvnejkqnfeyt.supabase.co:5432/postgres` |
| `GEMINI_API_KEY` | `AIzaSyBLHI3Zzw4BgH8JYMtOobmQ0TmgI-U8BHM` |
| `JWT_SECRET` | `a7f3e9b2c8d1f4a6e9b3c7d2f5a8e1b4c9d6f2a5e8b1c4d7f3a6e9b2c5d8f1a4e7` |
| `INIT_DB_SECRET` | `f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3` |

4. **For each variable**, make sure you selected:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **After adding/updating**, go to **Deployments** → **Redeploy**

---

## 🔍 Check Vercel Logs

1. Go to Vercel Dashboard
2. Your project → **Deployments**
3. Click on latest deployment
4. Click **"View Function Logs"** or **"View Build Logs"**
5. Look for error messages

**Common errors:**
- `DATABASE_URL not set` → Add environment variable
- `Connection refused` → Check Supabase is running
- `Authentication failed` → Check password in connection string
- `SSL required` → Connection string might need SSL parameters

---

## 🗄️ Check Supabase Database

1. Go to https://supabase.com
2. Your project → **Settings** → **Database**
3. Check:
   - ✅ Project is active
   - ✅ Connection string is correct
   - ✅ Password matches (Simbus@9999)

**Try using Connection Pooling URL instead:**
- In Supabase Dashboard → Settings → Database
- Scroll to "Connection Pooling"
- Copy the "Connection string" (port 6543)
- Update `DATABASE_URL` in Vercel with this URL

---

## 🚀 Quick Fix: Auto-Initialize

**The easiest solution - just sign up!**

The database will automatically initialize when:
- Someone signs up for the first time
- Any API endpoint is called that uses the database

**So:**
1. Visit: https://simbusiness-nine.vercel.app
2. Click "Sign Up"
3. Create an account
4. Database will initialize automatically!

---

## 📋 What to Tell Me

Please share:
1. **Error message** you're seeing
2. **Result from test-db endpoint** (after redeploy)
3. **Vercel logs** (if available)
4. **Whether environment variables are set** in Vercel

This will help me fix it faster! 🔧



