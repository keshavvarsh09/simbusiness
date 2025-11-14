# 🚀 Update Vercel and Redeploy - Quick Steps

## ✅ Step 1: Update DATABASE_URL in Vercel

1. **Go to**: https://vercel.com/dashboard
2. **Select**: Your project (simbusiness)
3. **Click**: Settings → **Environment Variables**
4. **Find**: `DATABASE_URL` (or create it if it doesn't exist)
5. **Update Value** with:
   ```
   postgresql://postgres.njkxojqmqvnejkqnfeyt:Simbus%409999@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
   ```
   **Important**: The `@` in password is encoded as `%40`
6. **Make sure** all environments are selected:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
7. **Click**: Save

## ✅ Step 2: Redeploy

1. **Go to**: Deployments tab
2. **Click**: "..." (three dots) on the latest deployment
3. **Click**: "Redeploy"
4. **Wait** for deployment to complete

## ✅ Step 3: Verify

After redeployment, test:
- **Connection**: `https://your-app.vercel.app/api/test-db`
- **Tables**: `https://your-app.vercel.app/api/init-db` (should show all tables exist)

## 🎉 Done!

Your app should now be connected to Supabase and ready to use!

