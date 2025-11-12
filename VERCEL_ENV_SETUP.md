# Vercel Environment Variables Setup

## Your Database URL

I've received your Supabase database URL. For Vercel deployment, you should use the **Connection Pooling** URL instead of the direct connection.

### Current URL (Direct Connection):
```
postgresql://postgres:Simbus@9999@db.njkxojqmqvnejkqnfeyt.supabase.co:5432/postgres
```

### Recommended URL (Connection Pooling - Better for Vercel):
1. Go to your Supabase project
2. Settings → Database
3. Scroll to "Connection Pooling"
4. Copy the "Connection string" under "Session mode" or "Transaction mode"
5. It should look like:
   ```
   postgresql://postgres.njkxojqmqvnejkqnfeyt:Simbus@9999@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

**Why?** Connection pooling is better for serverless functions (Vercel) as it handles many concurrent connections efficiently.

---

## Environment Variables to Add in Vercel

After you get your remaining credentials, add these in Vercel:

| Variable | Value | Notes |
|---------|-------|-------|
| `DATABASE_URL` | Your Supabase connection string | Use pooling URL if available |
| `GEMINI_API_KEY` | Your Gemini API key | Get from https://aistudio.google.com/app/apikey |
| `JWT_SECRET` | Random 32+ char string | I can generate this |
| `INIT_DB_SECRET` | Random string | I can generate this |

---

## Still Need:

1. ✅ **DATABASE_URL** - Received! (Consider using pooling URL)
2. ⏳ **GEMINI_API_KEY** - Still needed
3. ⏳ **JWT_SECRET** - I can generate this for you
4. ⏳ **INIT_DB_SECRET** - I can generate this for you

