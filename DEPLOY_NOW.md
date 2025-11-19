# 🚀 Deploy SimBusiness to Vercel - Complete Guide

## ✅ Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at https://vercel.com)
- [ ] Supabase account (for database - free tier)
- [ ] Groq API key (FREE - fastest option)
- [ ] Gemini API key (FREE - fallback option)

---

## Step 1: Get FREE API Keys (5 minutes)

### A. Groq API Key (FASTEST - Recommended)

1. Go to: **https://console.groq.com/**
2. Sign up with email or GitHub
3. Navigate to **API Keys** section
4. Click **"Create API Key"**
5. Copy the key (starts with `gsk_`)

✅ **You now have:** `GROQ_API_KEY`

**Free Tier:** 30 requests/minute, very fast (~200ms)

---

### B. Gemini API Key (Fallback)

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIzaSy`)

✅ **You now have:** `GEMINI_API_KEY`

**Free Tier:** 15 requests/minute, good quality

---

### C. Database (Supabase - FREE)

1. Go to: **https://supabase.com**
2. Sign up and create new project
3. Go to **Settings** → **Database**
4. Copy **Connection string** (URI format)
5. Replace `[YOUR-PASSWORD]` with your actual password

✅ **You now have:** `DATABASE_URL`

---

### D. Generate Secrets

Run these commands to generate secrets:

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Init DB Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

✅ **You now have:** `JWT_SECRET` and `INIT_DB_SECRET`

---

## Step 2: Push to GitHub (if not already done)

```bash
# Check git status
git status

# If not initialized:
git init
git add .
git commit -m "Ready for deployment with improved AI APIs"

# If already on GitHub, just push:
git push

# If not on GitHub yet:
# 1. Create repo at https://github.com/new
# 2. Then run:
git remote add origin https://github.com/YOUR_USERNAME/simbusiness.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (2 minutes)

1. **Go to**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click**: "Add New Project"
4. **Import** your `simbusiness` repository
5. **Click**: "Deploy" (don't configure env vars yet)

Wait 1-2 minutes for initial deployment.

---

## Step 4: Add Environment Variables (IMPORTANT!)

After deployment starts, go to:
**Settings** → **Environment Variables**

Add these **6 variables** (select all environments: Production, Preview, Development):

### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
```

### 2. GROQ_API_KEY (NEW - Fastest Free Option)
```
Key: GROQ_API_KEY
Value: gsk_your_groq_key_here
```

### 3. GEMINI_API_KEY (Fallback)
```
Key: GEMINI_API_KEY
Value: AIzaSy_your_gemini_key_here
```

### 4. JWT_SECRET
```
Key: JWT_SECRET
Value: [your_generated_secret]
```

### 5. INIT_DB_SECRET
```
Key: INIT_DB_SECRET
Value: [your_generated_secret]
```

### 6. OPENAI_API_KEY (Optional - only if you have it)
```
Key: OPENAI_API_KEY
Value: sk-your_openai_key_here
```
*Note: Optional - only needed if you want OpenAI as a fallback*

---

## Step 5: Redeploy

1. Go to **Deployments** tab
2. Click **three dots (⋯)** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes

---

## Step 6: Initialize Database

After redeployment completes:

1. **Copy your Vercel URL** (e.g., `https://simbusiness.vercel.app`)
2. **Visit this URL** (replace with your values):
```
https://YOUR_APP_URL.vercel.app/api/init-db?secret=YOUR_INIT_DB_SECRET
```

**Expected Response:**
```json
{"success":true,"message":"Database initialized successfully"}
```

---

## Step 7: Test Your App! 🎉

1. Visit your Vercel URL
2. Click **"Sign Up"**
3. Create an account
4. Test features:
   - ✅ Dashboard loads
   - ✅ **Chatbot** (should be FAST with Groq!)
   - ✅ Product Analysis
   - ✅ Missions

---

## 🎯 Environment Variables Summary

| Variable | Required | Free Tier | Purpose |
|----------|----------|-----------|---------|
| `GROQ_API_KEY` | ✅ Yes | ✅ Yes | Primary AI (fastest) |
| `GEMINI_API_KEY` | ✅ Yes | ✅ Yes | Fallback AI |
| `DATABASE_URL` | ✅ Yes | ✅ Yes | Database connection |
| `JWT_SECRET` | ✅ Yes | N/A | Authentication |
| `INIT_DB_SECRET` | ✅ Yes | N/A | DB initialization |
| `OPENAI_API_KEY` | ❌ Optional | Limited | Last resort fallback |

---

## 🐛 Troubleshooting

### Build Failed?
- Check Vercel build logs
- Ensure all environment variables are added
- Try redeploying

### Database Error?
- Verify `DATABASE_URL` is correct
- Check Supabase project is running
- Try initializing database again

### AI Chatbot Not Working?
- Verify `GROQ_API_KEY` is set (fastest)
- Verify `GEMINI_API_KEY` is set (fallback)
- Check API keys are valid
- System will automatically fallback if one fails

### Slow Responses?
- Make sure `GROQ_API_KEY` is set (fastest option)
- Check your internet connection
- Response caching helps with repeated queries

---

## ✅ That's It!

Your app is now live with:
- ✅ Fast AI responses (Groq ~200ms)
- ✅ Reliable fallback system
- ✅ Free tier APIs
- ✅ Production-ready deployment

**Need help?** Check the build logs in Vercel dashboard!

