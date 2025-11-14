# 🔗 Connect to Vercel

## How to Connect

If you have Vercel MCP configured, I can access:
- Environment variables
- Deployment logs
- Function logs
- Project settings

## What I'll Check

Once connected, I'll verify:
1. ✅ `DATABASE_URL` is set correctly (Connection Pooling URL)
2. ✅ `GEMINI_API_KEY` is set to: `AIzaSyBLHI3Zzw4BgH8JYMtOobmQ0TmgI-U8BHM`
3. ✅ `JWT_SECRET` is set
4. ✅ `INIT_DB_SECRET` is set
5. ✅ Latest deployment is successful
6. ✅ Function logs show any errors

## Alternative: Manual Check

If you can't connect me, you can check:

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
   - Verify all 4 variables exist
   - Check they're set for Production, Preview, Development

2. **Deployments** → Latest → **View Function Logs**
   - Look for errors when chatbot is called
   - Check for "GEMINI_API_KEY" or "DATABASE_URL" errors

3. **Browser Console** (F12)
   - Network tab → Find `/api/chatbot` request
   - Check the response for error details

---

**Connect me to Vercel and I'll diagnose everything!** 🚀



