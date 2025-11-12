# Quick Deploy to Vercel - Step by Step

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] GitHub account
- [ ] Vercel account (can sign up with GitHub)
- [ ] Google account (for Gemini API)

---

## Step 1: Get Your Credentials (5-10 minutes)

### A. PostgreSQL Database (Supabase - Easiest)

1. Go to **https://supabase.com**
2. Click **"Start your project"** → Sign up
3. Click **"New Project"**
4. Fill in:
   - Name: `simbusiness`
   - Password: Create a strong password (save it!)
   - Region: Choose closest
5. Click **"Create new project"**
6. Wait 2-3 minutes
7. Go to **Settings** (⚙️) → **Database**
8. Scroll to **Connection string** → **URI**
9. Copy the connection string
10. **Replace `[YOUR-PASSWORD]` with your actual password**

✅ **You now have:** `DATABASE_URL`

---

### B. Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
   (If that doesn't work, try: https://makersuite.google.com/app/apikey)
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy the key immediately

✅ **You now have:** `GEMINI_API_KEY`

---

### C. Generate Secrets

Run these commands (or I can generate for you):

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Init DB Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or visit: https://randomkeygen.com and copy two "CodeIgniter Encryption Keys"

✅ **You now have:** `JWT_SECRET` and `INIT_DB_SECRET`

---

## Step 2: Push to GitHub (2 minutes)

```bash
# If not already a git repo
git init
git add .
git commit -m "Ready for Vercel deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/simbusiness.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (3 minutes)

1. Go to **https://vercel.com**
2. Sign up/Login with **GitHub**
3. Click **"Add New Project"**
4. Import your `simbusiness` repository
5. Click **"Deploy"** (don't configure yet)

---

## Step 4: Add Environment Variables (2 minutes)

1. After deployment starts, go to **Settings** → **Environment Variables**
2. Add these 4 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSy...` | Production, Preview, Development |
| `JWT_SECRET` | `your-secret-here` | Production, Preview, Development |
| `INIT_DB_SECRET` | `another-secret-here` | Production, Preview, Development |

3. Click **Save** after each variable
4. Go back to **Deployments** tab
5. Click **"Redeploy"** (three dots menu)

---

## Step 5: Initialize Database (1 minute)

After redeployment completes:

1. Copy your Vercel URL (e.g., `https://simbusiness.vercel.app`)
2. Visit: `https://YOUR_APP_URL.vercel.app/api/init-db?secret=YOUR_INIT_DB_SECRET`

Or use curl:
```bash
curl "https://YOUR_APP_URL.vercel.app/api/init-db" \
  -H "x-init-secret: YOUR_INIT_DB_SECRET"
```

You should see: `{"success":true,"message":"Database initialized successfully"}`

---

## Step 6: Test Your App! 🎉

1. Visit your Vercel URL
2. Click **"Sign Up"**
3. Create an account
4. Test features:
   - Product analysis
   - Chatbot
   - Missions
   - etc.

---

## Troubleshooting

**Database connection error?**
- Check `DATABASE_URL` is correct
- For Supabase, use the **Connection Pooling** URI (port 6543)
- Ensure password is replaced in connection string

**Gemini API error?**
- Verify API key is correct
- Check API hasn't hit rate limits

**Build failed?**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`

**Need help?** Check `DEPLOY.md` for detailed troubleshooting.

---

## That's It! 🚀

Your app should now be live on Vercel!

