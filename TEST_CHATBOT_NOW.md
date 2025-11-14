# 🧪 Test Chatbot - Diagnostic Steps

## ✅ MCP Configured!

Your MCP config looks good! You may need to **restart Cursor** for it to connect.

---

## 🔍 Let's Debug the Chatbot Issue

### Step 1: Use Diagnostic Endpoint

**After Vercel redeploys** (should be done by now):

1. **Make sure you're signed in** to your app
2. **Visit**: `https://simbusiness-nine.vercel.app/api/debug`
3. **Copy the entire JSON response**
4. **Share it with me**

This will show:
- ✅ Environment variables status
- ✅ Database connection
- ✅ Authentication status
- ✅ Gemini API key status
- ✅ Any errors

---

### Step 2: Check Browser Console

1. **Open your app**: https://simbusiness-nine.vercel.app
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Try sending a message** in the chatbot
5. **Check for errors** in the console
6. **Go to Network tab**
7. **Find the `/api/chatbot` request**
8. **Click on it** → Check "Response" tab
9. **Share the error message** you see

---

### Step 3: Manual Vercel Check

**Go to Vercel Dashboard**:
1. https://vercel.com/keshavs-projects-fd093435
2. **Click on your `simbusiness` project**
3. **Settings** → **Environment Variables**
4. **Verify these 4 exist**:
   - `DATABASE_URL` (should be Connection Pooling URL)
   - `GEMINI_API_KEY` = `AIzaSyBLHI3Zzw4BgH8JYMtOobmQ0TmgI-U8BHM`
   - `JWT_SECRET`
   - `INIT_DB_SECRET`
5. **For each**: Make sure Production, Preview, Development are selected

---

## 🎯 Most Likely Issues

Based on the error "Failed to process message", it's probably:

1. **GEMINI_API_KEY not set** in Vercel
2. **DATABASE_URL wrong** (still using old direct connection)
3. **Token expired** (sign out and sign in again)

---

## 🚀 Quick Fixes

### If GEMINI_API_KEY is missing:
- Add it in Vercel → Settings → Environment Variables
- Value: `AIzaSyBLHI3Zzw4BgH8JYMtOobmQ0TmgI-U8BHM`
- Select all environments
- Redeploy

### If DATABASE_URL is wrong:
- Get Connection Pooling URL from Supabase
- Update in Vercel
- Redeploy

---

**Visit `/api/debug` and share the output, or check Vercel environment variables!** 🔍


