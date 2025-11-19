# ✅ Deployment Checklist

## 📋 Pre-Deployment

- [x] Code improvements committed
- [x] Code pushed to GitHub
- [ ] Get Groq API key (https://console.groq.com/)
- [ ] Get Gemini API key (https://aistudio.google.com/app/apikey)
- [ ] Get Supabase database URL
- [ ] Generate JWT_SECRET
- [ ] Generate INIT_DB_SECRET

---

## 🚀 Vercel Deployment Steps

### Step 1: Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign up/Login with GitHub
- [ ] Click "Add New Project"
- [ ] Import `simbusiness` repository
- [ ] Click "Deploy" (initial deployment)

### Step 2: Add Environment Variables
After deployment, go to **Settings → Environment Variables**:

- [ ] `DATABASE_URL` = `postgresql://...`
- [ ] `GROQ_API_KEY` = `gsk_...` ⭐ NEW - Fastest
- [ ] `GEMINI_API_KEY` = `AIzaSy...` ⭐ Fallback
- [ ] `JWT_SECRET` = `[generated]`
- [ ] `INIT_DB_SECRET` = `[generated]`
- [ ] `OPENAI_API_KEY` = `sk-...` (Optional)

**Important:** Select all environments (Production, Preview, Development) for each variable!

### Step 3: Redeploy
- [ ] Go to Deployments tab
- [ ] Click three dots (⋯) on latest deployment
- [ ] Click "Redeploy"
- [ ] Wait for completion

### Step 4: Initialize Database
- [ ] Visit: `https://YOUR_APP.vercel.app/api/init-db?secret=YOUR_INIT_DB_SECRET`
- [ ] Should see: `{"success":true,"message":"Database initialized successfully"}`

### Step 5: Test
- [ ] Visit your Vercel URL
- [ ] Sign up for account
- [ ] Test chatbot (should be FAST!)
- [ ] Test product analysis
- [ ] Test other features

---

## 🎯 Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# AI APIs (FREE TIER)
GROQ_API_KEY=gsk_your_key_here          # Primary (fastest)
GEMINI_API_KEY=AIzaSy_your_key_here      # Fallback

# Security
JWT_SECRET=your_generated_secret_here
INIT_DB_SECRET=your_generated_secret_here

# Optional
OPENAI_API_KEY=sk-your_key_here          # Last resort fallback
```

---

## 📊 Expected Performance

- **Response Time**: ~200ms (with Groq)
- **Fallback**: Automatic to Gemini if Groq fails
- **Success Rate**: >99% with fallback chain
- **Cost**: $0 (using free tiers)

---

## 🆘 Quick Troubleshooting

**Build fails?**
→ Check all environment variables are added

**Database error?**
→ Verify DATABASE_URL is correct

**Chatbot slow?**
→ Make sure GROQ_API_KEY is set

**Chatbot not working?**
→ Check both GROQ_API_KEY and GEMINI_API_KEY are set

---

## ✅ Success Indicators

- ✅ Build completes successfully
- ✅ App loads at Vercel URL
- ✅ Can sign up/login
- ✅ Chatbot responds quickly (<1 second)
- ✅ Product analysis works
- ✅ No errors in browser console

---

**Ready?** Follow `DEPLOY_NOW.md` for detailed instructions!

