# How to Get Required Credentials

This guide will help you obtain all the credentials needed to deploy SimBusiness to Vercel.

## Required Credentials Checklist

- [ ] PostgreSQL Database URL
- [ ] Gemini API Key
- [ ] JWT Secret
- [ ] Init DB Secret (optional)

---

## 1. PostgreSQL Database URL

### Option A: Supabase (Recommended - Free Tier)

**Steps:**
1. Visit https://supabase.com
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Click **"New Project"**
5. Fill in:
   - **Name**: `simbusiness` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
6. Click **"Create new project"**
7. Wait 2-3 minutes for setup
8. Once ready, go to **Settings** (gear icon) → **Database**
9. Scroll to **Connection string** section
10. Under **URI**, copy the connection string
    - It looks like: `postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
    - **Important**: Replace `[YOUR-PASSWORD]` with the password you created
    - For Vercel, use the **Connection Pooling** URI (port 6543)

**Example:**
```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### Option B: Neon (Free Tier)

**Steps:**
1. Visit https://neon.tech
2. Click **"Sign Up"** (GitHub or email)
3. Click **"Create Project"**
4. Fill in:
   - **Name**: `simbusiness`
   - **Region**: Choose closest
   - **PostgreSQL version**: 15 or 16
5. Click **"Create Project"**
6. Once created, you'll see the connection string
7. Copy the connection string (it's already formatted)

**Example:**
```
postgresql://username:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Option C: Railway (Free Tier with Credit Card)

**Steps:**
1. Visit https://railway.app
2. Sign up with GitHub
3. Add a credit card (required, but free tier available)
4. Click **"New Project"**
5. Click **"Add PostgreSQL"**
6. Wait for database to provision
7. Click on the PostgreSQL service
8. Go to **Variables** tab
9. Copy the `DATABASE_URL` value

---

## 2. Gemini API Key

### Method 1: Google AI Studio (Recommended)

**Steps:**
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Choose to create in existing project or create new project
5. Copy the API key immediately (you won't see it again)
6. The key looks like: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`

**Note**: If the link doesn't work, try:
- https://makersuite.google.com/app/apikey
- Or search "Google AI Studio API key" in Google

### Method 2: Google Cloud Console

**Steps:**
1. Visit https://console.cloud.google.com
2. Sign in with Google account
3. Create a new project (or select existing)
4. Go to **APIs & Services** → **Credentials**
5. Click **"Create Credentials"** → **"API Key"**
6. Enable **Generative Language API** for the project
7. Copy the API key

**Important**: 
- Free tier includes 60 requests per minute
- For production, consider setting up billing for higher limits

---

## 3. JWT Secret

This is a random string used to sign authentication tokens. Generate one using any method:

### Method 1: Online Generator
1. Visit https://randomkeygen.com
2. Scroll to **"CodeIgniter Encryption Keys"**
3. Copy any 256-bit key (32 characters)

### Method 2: Node.js Command
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Method 3: Online Hex Generator
1. Visit https://www.random.org/strings/
2. Generate 32-character hexadecimal string

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 4. Init DB Secret (Optional)

This protects the database initialization endpoint. Generate another random string (same methods as JWT Secret).

**Why optional?** The database will auto-initialize on first use, but having this secret is more secure.

---

## Quick Reference

Once you have all credentials, they should look like:

```
DATABASE_URL=postgresql://postgres.xxxxx:password@host:port/database
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
INIT_DB_SECRET=q7w8e9r0t1y2u3i4o5p6a7s8d9f0g1h2
```

---

## Need Help?

If you're stuck getting any credential:
1. Check the specific service's documentation
2. Look for "Getting Started" guides
3. Contact support for the service (Supabase, Neon, etc.)

---

## Security Notes

- **Never commit** these credentials to Git
- **Never share** your API keys publicly
- **Rotate** keys if they're accidentally exposed
- Use **environment variables** in Vercel (not hardcoded)

