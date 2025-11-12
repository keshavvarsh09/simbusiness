# 🗄️ Database Initialization - Updated

## ✅ Code Updated!

I've updated the code to accept the secret as a query parameter. Vercel is automatically redeploying (takes 1-2 minutes).

---

## Method 1: Browser (Easiest - After Redeploy)

**Wait 1-2 minutes for Vercel to redeploy, then visit:**

```
https://simbusiness-nine.vercel.app/api/init-db?secret=f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3
```

**Expected Response:**
```json
{"success":true,"message":"Database initialized successfully"}
```

---

## Method 2: Using Header (Works Now)

If you want to try now (before redeploy), use this PowerShell command:

```powershell
$headers = @{'x-init-secret' = 'f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3'}
Invoke-RestMethod -Uri "https://simbusiness-nine.vercel.app/api/init-db" -Method Get -Headers $headers
```

---

## Check Vercel Deployment

1. Go to https://vercel.com
2. Click on your `simbusiness` project
3. Check the latest deployment status
4. Wait for it to finish (green checkmark)

---

## After Initialization

Once you see the success message, your database is ready! You can now:
- ✅ Sign up for accounts
- ✅ Use all features
- ✅ Everything should work!

---

**The easiest way: Wait 2 minutes, then visit the URL in Method 1!** 🚀

