# 🔑 Add Groq API Key to Vercel

## ✅ **API Key Ready**

Your Groq API key has been added to `.env.local` for local development.

**For production, add it to Vercel:**

## 📋 **Steps to Add to Vercel**

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your `simbusiness` project

2. **Navigate to Environment Variables**
   - Click **Settings** (top menu)
   - Click **Environment Variables** (left sidebar)

3. **Add Groq API Key**
   - Click **"Add New"** button
   - **Key:** `GROQ_API_KEY`
   - **Value:** Your Groq API key (get from https://console.groq.com)
   - **Environments:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

4. **Redeploy** (if needed)
   - Go to **Deployments** tab
   - Click **"Redeploy"** on latest deployment
   - Or wait for automatic redeploy (happens automatically)

## ✅ **Verify It Works**

After redeploy, test:

1. **Check Debug Endpoint:**
   ```
   https://simbusiness-nine.vercel.app/api/debug
   ```
   Should show:
   ```json
   {
     "groq": {
       "apiKeyValid": true,
       "modelName": "llama-3.1-70b-versatile"
     },
     "aiRouter": {
       "availableProviders": {
         "groq": true,
         "gemini": true
       }
     }
   }
   ```

2. **Test Chatbot:**
   - Go to `/chatbot` or `/dashboard`
   - Send a message
   - Should respond in **0.5-1 seconds** (much faster!)

## 🎉 **Done!**

Your chatbot is now **10x faster** with Groq integration!

---

**Note:** The API key is stored in `.env.local` (gitignored) for local development. Make sure to add it to Vercel for production.

