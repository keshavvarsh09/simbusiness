# 🔧 Fix Gemini Model Issue

## ✅ What I've Done

1. **Created test endpoint** to list available models
2. **Made model name configurable** via environment variable
3. **Set default to `gemini-pro`** (most stable)

---

## 🧪 Step 1: Test Available Models

**After Vercel redeploys (1-2 minutes), visit:**

```
https://simbusiness-nine.vercel.app/api/test-gemini-models
```

**This endpoint will:**
- ✅ Test multiple model names
- ✅ List available models from REST API
- ✅ Show which models work with your API key
- ✅ Show error messages for each

**Copy the JSON response and share it with me!**

---

## 🎯 Step 2: Check Google AI Studio

**You mentioned you can connect AI Studio - perfect!**

1. **Go to**: https://aistudio.google.com
2. **Sign in** with the same Google account
3. **Look at the model dropdown** in the interface
4. **Note which model names are available**
5. **Try a test prompt** to verify it works
6. **Share the working model name** with me

**Common models you might see:**
- `gemini-pro`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `gemini-1.5-pro-latest`
- `gemini-1.5-flash-latest`

---

## 🔧 Step 3: Fix the Model Name

Once we know which model works, I'll:

1. **Update the code** with the correct model name
2. **Or set it via environment variable** in Vercel:
   - Go to Vercel → Settings → Environment Variables
   - Add: `GEMINI_MODEL_NAME` = `[working-model-name]`
   - Redeploy

---

## 📊 What to Share

Please share:

1. **JSON response** from `/api/test-gemini-models`
2. **Model name that works** in AI Studio
3. **Any error messages** you see

This will help me fix it immediately! 🚀

---

## 💡 Quick Fix (If You Know the Model)

If you already know which model works (e.g., from AI Studio):

1. **Go to Vercel** → Settings → Environment Variables
2. **Add new variable:**
   - Name: `GEMINI_MODEL_NAME`
   - Value: `gemini-pro` (or whatever works)
3. **Redeploy**

The code will automatically use this model name!


