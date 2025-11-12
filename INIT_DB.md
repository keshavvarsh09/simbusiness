# 🗄️ Initialize Database

## Quick Method: Browser

**Just visit this URL in your browser** (replace `YOUR_APP_URL` with your Vercel URL):

```
https://YOUR_APP_URL.vercel.app/api/init-db?secret=f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3
```

**Example** (if your URL is `https://simbusiness-abc123.vercel.app`):
```
https://simbusiness-abc123.vercel.app/api/init-db?secret=f9e6c3a8d5b2e7f4a1c8d5b2e9f6c3a7d4b1e8f5c2a9d6b3e7f4a1c8d5b2e9f6c3
```

**Expected Response:**
```json
{"success":true,"message":"Database initialized successfully"}
```

---

## What's Your Vercel URL?

**To find your Vercel URL:**

1. Go to https://vercel.com
2. Click on your `simbusiness` project
3. You'll see your deployment URL at the top (e.g., `simbusiness-xyz.vercel.app`)
4. Copy that URL

**Or tell me your Vercel URL and I'll give you the exact link to visit!**

---

## Alternative: Command Line

If you have Node.js installed:

```bash
node init-database.js
```

Then enter your Vercel URL when prompted.

---

## Note

If you get an error, don't worry! The database will automatically initialize when:
- Someone signs up for the first time
- Any API endpoint is called that uses the database

---

**Just share your Vercel URL and I'll give you the exact link to click!** 🚀

