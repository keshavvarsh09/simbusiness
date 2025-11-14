# 🔗 How to Get Your Supabase Connection String

## 📍 You're on the Right Page!

You're on: **Settings → Database**

Now you need to find the **Connection string** section.

---

## 🔍 Where to Find It

### Option 1: Connection String Section (Direct Connection)

1. **Scroll down** on the Database Settings page
2. Look for a section called **"Connection string"** or **"Connection info"**
3. You should see tabs like:
   - **URI** (this is what you need!)
   - **JDBC**
   - **Golang**
   - etc.
4. **Click on "URI"** tab
5. **Copy the connection string**
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.njkxojqmqvnejkqnfeyt.supabase.co:5432/postgres`
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

### Option 2: Connection Pooling (Recommended for Vercel)

1. **Scroll down** to find **"Connection pooling"** section
2. You should see different modes:
   - **Session mode**
   - **Transaction mode**
3. **Click on "Session mode"**
4. **Copy the connection string**
   - Format: `postgresql://postgres.njkxojqmqvnejkqnfeyt:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
   - **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

---

## 🎯 What You Need

**For Vercel, use Connection Pooling (port 6543)** - it's better for serverless functions!

The connection string should look like:
```
postgresql://postgres.njkxojqmqvnejkqnfeyt:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Replace `YOUR_PASSWORD` with your actual database password!**

---

## 📋 Quick Steps

1. **Scroll down** on the Database Settings page
2. **Find** "Connection pooling" section
3. **Click** "Session mode"
4. **Copy** the connection string
5. **Replace** `[YOUR-PASSWORD]` with your password
6. **Update** `DATABASE_URL` in Vercel
7. **Redeploy**

---

## 💡 Can't Find It?

If you don't see the connection string section:
1. Try clicking on **"Database"** in the left sidebar (not Settings)
2. Look for **"Connection string"** or **"Connection info"** there
3. Or check the **"Project Settings"** → **"Database"** section

---

**Once you have the connection string, update it in Vercel and redeploy!** 🚀



