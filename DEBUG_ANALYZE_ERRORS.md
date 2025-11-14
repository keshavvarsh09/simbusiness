# 🔍 Debugging Product Analyze Errors

## Common Errors & Solutions

### Error 1: "Gemini model not found" / 404 Error

**Symptoms:**
- Error message: "Gemini model 'models/gemini-2.5-flash' not found"
- Status: 404

**Cause:**
- The Gemini model name is incorrect or deprecated
- Environment variable `GEMINI_MODEL_NAME` is not set correctly

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add/Update: `GEMINI_MODEL_NAME` = `models/gemini-2.5-flash`
3. Redeploy your application

**Test:**
Visit: `https://simbusiness-nine.vercel.app/api/test-gemini-models`
Should show `models/gemini-2.5-flash` as working ✅

---

### Error 2: "Gemini API key is missing or invalid"

**Symptoms:**
- Error message: "GEMINI_API_KEY is invalid or missing"
- Status: 401

**Cause:**
- `GEMINI_API_KEY` environment variable is not set in Vercel
- API key is incorrect or expired

**Solution:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Verify `GEMINI_API_KEY` exists and is correct
3. Get a new key from: https://aistudio.google.com/app/apikey
4. Update the variable and redeploy

**Test:**
Visit: `https://simbusiness-nine.vercel.app/api/debug`
Check `gemini.apiKeyValid` should be `true`

---

### Error 3: "Gemini API quota exceeded"

**Symptoms:**
- Error message: "Gemini API quota exceeded"
- Status: 429

**Cause:**
- You've exceeded the free tier rate limit (15 requests/minute)
- Daily quota exceeded

**Solution:**
1. Wait a few minutes and try again
2. Check your API usage at: https://aistudio.google.com/app/apikey
3. Consider upgrading to paid tier for higher limits

**Test:**
Wait 1 minute, then try analyzing again

---

### Error 4: "Connection error" / Timeout

**Symptoms:**
- Error message: "Failed to connect to Gemini API"
- Request times out

**Cause:**
- Network issues
- Gemini API is temporarily down
- Vercel function timeout

**Solution:**
1. Check Gemini API status
2. Try again in a few minutes
3. Check Vercel function logs for timeout errors

---

### Error 5: "Unauthorized" / 401

**Symptoms:**
- Error message: "Unauthorized"
- Status: 401

**Cause:**
- User is not logged in
- JWT token is missing or invalid

**Solution:**
1. Make sure you're logged in
2. Try signing out and signing back in
3. Check browser console for auth errors

---

### Error 6: "Invalid response from server"

**Symptoms:**
- Error message: "Invalid response from server"
- Analysis doesn't display

**Cause:**
- Gemini API returned unexpected format
- JSON parsing failed

**Solution:**
1. Check Vercel function logs
2. Try with a different product URL
3. Check `/api/debug` for system status

---

## 🔧 How to Debug

### Step 1: Check System Status

Visit: `https://simbusiness-nine.vercel.app/api/debug`

**Look for:**
- ✅ `database.connectionTest: "success"`
- ✅ `gemini.apiKeyValid: true`
- ✅ `gemini.modelName: "models/gemini-2.5-flash"`

### Step 2: Test Gemini Models

Visit: `https://simbusiness-nine.vercel.app/api/test-gemini-models`

**Look for:**
- ✅ `models/gemini-2.5-flash` in `workingModels` array
- ❌ If not working, check environment variables

### Step 3: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try analyzing a product
4. Look for error messages

### Step 4: Check Vercel Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" → Latest deployment
4. Click "View Function Logs"
5. Look for errors when you try to analyze

---

## 📋 Quick Checklist

Before reporting an error, check:

- [ ] You're logged in
- [ ] `GEMINI_API_KEY` is set in Vercel
- [ ] `GEMINI_MODEL_NAME` is set to `models/gemini-2.5-flash` (or not set, uses default)
- [ ] `/api/debug` shows all systems healthy
- [ ] `/api/test-gemini-models` shows working models
- [ ] You haven't exceeded rate limits
- [ ] Product URL is valid (Amazon, Myntra, etc.)

---

## 🐛 Common Issues

### Issue: "Failed to analyze product" (generic error)

**Debug:**
1. Check browser console for detailed error
2. Check Vercel function logs
3. Try `/api/debug` endpoint

### Issue: Analysis takes too long / times out

**Cause:**
- Gemini API is slow
- Large product pages take time to analyze

**Solution:**
- Wait for response (can take 10-30 seconds)
- Try with a simpler product URL
- Check Vercel function timeout settings

### Issue: Analysis returns but shows "N/A" for all fields

**Cause:**
- Gemini API returned text instead of JSON
- JSON parsing failed

**Solution:**
- Check Vercel logs for raw response
- The analysis might still be in `rawResponse` field
- Try a different product URL

---

## 📞 Getting Help

If you're still getting errors:

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard
   - Latest deployment → Function Logs
   - Copy the error message

2. **Check Debug Endpoint:**
   - Visit: `/api/debug`
   - Copy the full response

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Console tab
   - Copy any errors

4. **Share:**
   - Error message
   - Product URL you tried
   - Debug endpoint response
   - Vercel logs (if available)

---

## ✅ Expected Behavior

**When everything works:**
1. Enter product URL
2. Click "Analyze"
3. Shows "Analyzing..." for 10-30 seconds
4. Displays analysis with:
   - Product name
   - Feasibility score
   - Competition analysis
   - Vendor options
   - Risk factors
   - Overall assessment

**If you see this, it's working! ✅**

