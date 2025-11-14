# ✅ How to Check Your Deployment

## 🚀 Quick Check Methods

### Method 1: Check Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project**: `simbusiness`
3. **Check Deployments tab**:
   - ✅ Green checkmark = Success
   - ⏳ Building = In progress
   - ❌ Red X = Failed (check logs)

### Method 2: Test Your Live API Endpoints

Your app URL: **https://simbusiness-nine.vercel.app**

#### Test 1: Health Check (No auth needed)
```
https://simbusiness-nine.vercel.app/api/health
```
**Expected**: `{"status":"ok","timestamp":"..."}`

#### Test 2: Test Gemini Models (Check if new 2.5 models work)
```
https://simbusiness-nine.vercel.app/api/test-gemini-models
```
**Expected**: Should show `models/gemini-2.5-flash` as working ✅

#### Test 3: Full Diagnostics
```
https://simbusiness-nine.vercel.app/api/debug
```
**Expected**: 
- `database.connectionTest: "success"`
- `gemini.apiKeyValid: true`
- `gemini.modelName: "models/gemini-2.5-flash"`

#### Test 4: Database Connection
```
https://simbusiness-nine.vercel.app/api/test-db
```
**Expected**: `{"success":true,"message":"Database connection successful"}`

---

## 🔍 Detailed Checks

### Check 1: Vercel Deployment Status

**In Browser:**
1. Visit: https://vercel.com/dashboard
2. Click on `simbusiness` project
3. Go to **"Deployments"** tab
4. Look at the latest deployment:
   - Status should be **"Ready"** ✅
   - Build should show **"Build Completed"** ✅
   - Should show commit: `4dc0921` (your latest commit)

**If deployment failed:**
- Click on the failed deployment
- Check **"Build Logs"** for errors
- Common issues:
  - Missing environment variables
  - Build errors
  - TypeScript errors

---

### Check 2: Environment Variables

**In Vercel Dashboard:**
1. Go to: Settings → Environment Variables
2. Verify these exist:
   - ✅ `DATABASE_URL`
   - ✅ `GEMINI_API_KEY`
   - ✅ `JWT_SECRET`
   - ✅ `GEMINI_MODEL_NAME` (optional, defaults to `models/gemini-2.5-flash`)

**To add GEMINI_MODEL_NAME (recommended):**
- Key: `GEMINI_MODEL_NAME`
- Value: `models/gemini-2.5-flash`
- Environments: ✅ Production ✅ Preview ✅ Development

---

### Check 3: Test API Endpoints (PowerShell)

**Open PowerShell and run:**

```powershell
# Test 1: Health Check
Invoke-RestMethod -Uri "https://simbusiness-nine.vercel.app/api/health"

# Test 2: Test Gemini Models
Invoke-RestMethod -Uri "https://simbusiness-nine.vercel.app/api/test-gemini-models" | ConvertTo-Json -Depth 10

# Test 3: Full Diagnostics
Invoke-RestMethod -Uri "https://simbusiness-nine.vercel.app/api/debug" | ConvertTo-Json -Depth 10

# Test 4: Database
Invoke-RestMethod -Uri "https://simbusiness-nine.vercel.app/api/test-db" | ConvertTo-Json
```

---

### Check 4: Test in Browser

**Just open these URLs in your browser:**

1. **Health**: https://simbusiness-nine.vercel.app/api/health
2. **Gemini Test**: https://simbusiness-nine.vercel.app/api/test-gemini-models
3. **Debug**: https://simbusiness-nine.vercel.app/api/debug
4. **Homepage**: https://simbusiness-nine.vercel.app

---

## ✅ Success Indicators

### ✅ Deployment Successful If:
- Vercel shows green checkmark
- `/api/health` returns `{"status":"ok"}`
- `/api/test-gemini-models` shows `models/gemini-2.5-flash` as working
- `/api/debug` shows all systems healthy
- Homepage loads without errors

### ❌ Deployment Failed If:
- Vercel shows red X
- API endpoints return 500 errors
- Build logs show errors
- Environment variables missing

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" on API endpoints
**Solution**: Wait 1-2 minutes after deployment, then try again. Vercel needs time to propagate.

### Issue: "500 Internal Server Error"
**Solution**: 
1. Check Vercel function logs
2. Verify environment variables are set
3. Check `/api/debug` for specific errors

### Issue: Gemini models not working
**Solution**:
1. Check `GEMINI_API_KEY` is set in Vercel
2. Verify API key is valid
3. Check `/api/test-gemini-models` to see which models work

### Issue: Database connection failed
**Solution**:
1. Verify `DATABASE_URL` is correct in Vercel
2. Check Supabase database is running
3. Test with `/api/test-db`

---

## 📊 Quick Status Check Script

**Save this as `check-deployment.ps1`:**

```powershell
$baseUrl = "https://simbusiness-nine.vercel.app"

Write-Host "🔍 Checking Deployment Status..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/health"
    Write-Host "   ✅ Health: OK" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Health: FAILED" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Gemini Models
Write-Host "2. Gemini Models Test..." -ForegroundColor Yellow
try {
    $models = Invoke-RestMethod -Uri "$baseUrl/api/test-gemini-models"
    $working = $models.workingModels
    if ($working.Count -gt 0) {
        Write-Host "   ✅ Working Models: $($working -join ', ')" -ForegroundColor Green
    } else {
        Write-Host "   ❌ No working models found" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Models Test: FAILED" -ForegroundColor Red
}

# Test 3: Debug
Write-Host "3. Full Diagnostics..." -ForegroundColor Yellow
try {
    $debug = Invoke-RestMethod -Uri "$baseUrl/api/debug"
    $diag = $debug.diagnostics
    
    Write-Host "   Database: $($diag.database.connectionTest)" -ForegroundColor $(if($diag.database.connectionTest -eq 'success'){'Green'}else{'Red'})
    Write-Host "   Gemini: $($diag.gemini.apiKeyValid)" -ForegroundColor $(if($diag.gemini.apiKeyValid){'Green'}else{'Red'})
    if ($diag.gemini.modelName) {
        Write-Host "   Model: $($diag.gemini.modelName)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Debug: FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Check complete!" -ForegroundColor Green
```

**Run it:**
```powershell
.\check-deployment.ps1
```

---

## 🎯 What to Look For

### ✅ Good Signs:
- All API endpoints return 200 status
- Gemini 2.5 models show as working
- Database connection successful
- No errors in Vercel logs

### ❌ Bad Signs:
- 404 or 500 errors
- "Model not found" errors
- Database connection errors
- Missing environment variables

---

## 📞 Need Help?

If something's not working:
1. Check Vercel deployment logs
2. Run `/api/debug` endpoint
3. Check environment variables
4. Verify GitHub push was successful

