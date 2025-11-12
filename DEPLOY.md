# Vercel Deployment Guide

## Prerequisites

Before deploying, you need to obtain the following credentials:

### 1. PostgreSQL Database URL

You need a hosted PostgreSQL database. Here are free options:

#### Option A: Supabase (Recommended - Free Tier)
1. Go to https://supabase.com
2. Sign up for a free account
3. Click "New Project"
4. Fill in project details (name, database password, region)
5. Wait for project to be created
6. Go to **Settings** → **Database**
7. Find **Connection string** → **URI**
8. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

#### Option B: Neon (Free Tier)
1. Go to https://neon.tech
2. Sign up for a free account
3. Click "Create Project"
4. Choose a name and region
5. Copy the connection string from the dashboard

#### Option C: Railway (Free Tier with Credit Card)
1. Go to https://railway.app
2. Sign up and add a credit card (free tier available)
3. Click "New Project" → "Add PostgreSQL"
4. Click on the PostgreSQL service
5. Go to **Variables** tab
6. Copy the `DATABASE_URL` value

### 2. Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the API key (it looks like: `AIzaSy...`)

**Note**: If you don't see the option, go to https://aistudio.google.com/app/apikey instead

### 3. JWT Secret

Generate a random secret string for JWT token signing. You can use:

**Option A: Online Generator**
- Go to https://randomkeygen.com
- Copy a "CodeIgniter Encryption Keys" (256-bit)

**Option B: Command Line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C: Use this (replace with your own):**
```
your-super-secret-jwt-key-change-this-in-production-2024
```

### 4. Init DB Secret (Optional but Recommended)

This is used to protect the database initialization endpoint. Generate another random string (same methods as JWT Secret).

## Deployment Steps

### Step 1: Push to GitHub

1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Create a new repository (e.g., `simbusiness`)
   - Don't initialize with README

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/simbusiness.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### Step 3: Add Environment Variables

In Vercel project settings, go to **Settings** → **Environment Variables** and add:

| Variable Name | Value | Description |
|--------------|-------|-------------|
| `DATABASE_URL` | `postgresql://...` | Your PostgreSQL connection string |
| `GEMINI_API_KEY` | `AIzaSy...` | Your Gemini API key |
| `JWT_SECRET` | `your-random-secret` | JWT signing secret |
| `INIT_DB_SECRET` | `another-random-secret` | Database init protection (optional) |
| `NODE_ENV` | `production` | Environment (auto-set by Vercel) |

**Important**: 
- Add these for **Production**, **Preview**, and **Development** environments
- Click **Save** after adding each variable

### Step 4: Initialize Database

After deployment, initialize the database:

1. Get your deployment URL (e.g., `https://simbusiness.vercel.app`)
2. Call the init endpoint:
```bash
curl -X GET "https://YOUR_APP_URL.vercel.app/api/init-db" \
  -H "x-init-secret: YOUR_INIT_DB_SECRET"
```

Or visit in browser (if you didn't set INIT_DB_SECRET):
```
https://YOUR_APP_URL.vercel.app/api/init-db
```

**Alternative**: The database will auto-initialize on first API call, but it's better to initialize manually.

### Step 5: Verify Deployment

1. Visit your Vercel deployment URL
2. Try signing up a new user
3. Test the features:
   - Product analysis
   - Chatbot
   - Missions
   - etc.

## Post-Deployment Checklist

- [ ] Database initialized successfully
- [ ] Can create new user account
- [ ] Can sign in
- [ ] Product analysis works
- [ ] Chatbot responds
- [ ] Missions load correctly
- [ ] All API endpoints working

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- For Supabase: Go to Settings → Database → Connection Pooling and use the pooled connection string

### Gemini API Errors
- Verify API key is correct
- Check API quota/limits
- Ensure key has proper permissions

### Build Errors
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

### Environment Variables Not Working
- Ensure variables are set for correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

## Updating the Deployment

After making changes:

1. Push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

2. Vercel will automatically redeploy

## Custom Domain (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check database connection
3. Verify all environment variables are set
4. Review error messages in browser console

