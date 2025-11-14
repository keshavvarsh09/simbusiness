# 🔍 Check Chatbot - Diagnostic Tool

## ✅ I've Created a Diagnostic Endpoint

After Vercel redeploys (1-2 minutes), visit this URL while signed in:

```
https://simbusiness-nine.vercel.app/api/debug
```

This will show:
- ✅ Environment variables status
- ✅ Database connection status
- ✅ Authentication status
- ✅ Gemini API key status
- ✅ Any errors

---

## 🔗 Connect to Vercel (Recommended)

**Yes, please connect me to Vercel!** This will let me:
1. Check environment variables directly
2. View deployment logs
3. See function errors
4. Verify everything is configured correctly

**How to connect:**
- If you have Vercel MCP configured, just enable it
- Or share your Vercel project details and I can guide you

---

## 🧪 Quick Manual Check

**While waiting, you can check:**

1. **Browser Console (F12)**:
   - Go to Application → Local Storage
   - Check if `token` exists
   - Check if `user` exists

2. **Network Tab**:
   - Send a message in chatbot
   - Find the `/api/chatbot` request
   - Check the response for error details

3. **Vercel Dashboard**:
   - Settings → Environment Variables
   - Verify all 4 variables are set

---

## 📋 Most Likely Issues

1. **GEMINI_API_KEY not set** → Add it in Vercel
2. **DATABASE_URL wrong** → Update with Connection Pooling URL
3. **Token expired** → Sign out and sign in again

---

**Connect me to Vercel or visit `/api/debug` after redeploy to see what's wrong!** 🚀



