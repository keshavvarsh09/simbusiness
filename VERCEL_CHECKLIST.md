# ✅ Vercel Configuration Checklist

## 🔍 What to Check in Vercel

### Step 1: Go to Your Project

1. **Visit**: https://vercel.com
2. **Sign in** (if not already)
3. **Click on**: `simbusiness` project
4. **Or go directly to**: https://vercel.com/keshavs-projects-fd093435

---

### Step 2: Check Environment Variables

**Path**: Settings → Environment Variables

**Verify these 4 variables exist:**

#### 1. DATABASE_URL
- **Should be**: Connection Pooling URL from Supabase
- **Format**: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
- **NOT**: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres` (this is direct connection, won't work)

#### 2. GEMINI_API_KEY
- **Should be**: `AIzaSyBLHI3Zzw4BgH8JYMtOobmQ0TmgI-U8BHM`
- **Check**: It matches exactly

#### 3. JWT_SECRET
- **Should be**: `a7f3e9b2c8d1f4a6e9b3c7d2f5a8e1b4c9d6f2a5e8b1c4d7f3a6e9b2c5d8f1a4e7`
- **Check**: It's set

#### 4. INIT_DB_SECRET
- **Should be**: `f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3`
- **Check**: It's set

**For EACH variable:**
- ✅ Check "Production"
- ✅ Check "Preview"  
- ✅ Check "Development"

---

### Step 3: Check Latest Deployment

**Path**: Deployments tab

**Check:**
- ✅ Latest deployment has green checkmark (successful)
- ✅ Build completed without errors
- ✅ Deployment is "Ready"

**If deployment failed:**
- Click on it → View build logs
- Share the error with me

---

### Step 4: Check Function Logs

**Path**: Deployments → Latest → View Function Logs

**Look for:**
- ❌ Errors mentioning "DATABASE_URL"
- ❌ Errors mentioning "GEMINI_API_KEY"
- ❌ Errors mentioning "connection"
- ❌ Any 500 errors

---

## 🐛 Common Issues

### Issue 1: DATABASE_URL is Wrong
**Symptom**: Database connection errors
**Fix**: Update to Connection Pooling URL (port 6543)

### Issue 2: GEMINI_API_KEY Missing
**Symptom**: Chatbot fails with "AI service not configured"
**Fix**: Add the variable in Vercel

### Issue 3: Variables Not Set for All Environments
**Symptom**: Works in one environment but not others
**Fix**: Select Production, Preview, AND Development for each variable

### Issue 4: Deployment Failed
**Symptom**: Build errors in Vercel
**Fix**: Check build logs, fix errors, redeploy

---

## 📋 Quick Checklist

- [ ] All 4 environment variables exist
- [ ] DATABASE_URL is Connection Pooling URL (port 6543)
- [ ] GEMINI_API_KEY matches exactly
- [ ] All variables selected for Production, Preview, Development
- [ ] Latest deployment is successful (green checkmark)
- [ ] No errors in function logs

---

## 🚀 After Checking

**Tell me:**
1. Which variables are missing?
2. Is DATABASE_URL the pooling URL?
3. Any errors in deployment logs?
4. Is latest deployment successful?

**Then I can fix the specific issues!** 🔧


