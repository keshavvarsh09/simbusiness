# 🆓 Free APIs Setup Guide for Product Scraping

## 📋 **Available Free APIs**

### **1. ScraperAPI (Recommended)**
- **Free Tier:** 1,000 API credits/month
- **Sign Up:** https://www.scraperapi.com
- **Features:**
  - Handles proxies, browsers, CAPTCHAs
  - Simple API calls
  - Good for Alibaba, AliExpress scraping

**Setup:**
1. Sign up at https://www.scraperapi.com
2. Get your API key
3. Add to Vercel: `SCRAPER_API_KEY=your-key-here`

**Usage:**
```typescript
const apiUrl = `http://api.scraperapi.com?api_key=${key}&url=${targetUrl}`;
```

---

### **2. Page2API**
- **Free Tier:** 1,000 API calls
- **Sign Up:** https://page2api.com
- **Features:**
  - Web scraping API
  - JSON responses
  - Good for structured data

**Setup:**
1. Sign up at https://page2api.com
2. Get your API key
3. Add to Vercel: `PAGE2API_KEY=your-key-here`

---

### **3. AbstractAPI Web Scraping**
- **Free Tier:** Limited requests
- **Sign Up:** https://abstractapi.com/api/web-scraping-api
- **Features:**
  - HTML extraction
  - Configurable options

**Setup:**
1. Sign up at https://abstractapi.com
2. Get your API key
3. Add to Vercel: `ABSTRACT_API_KEY=your-key-here`

---

## 🖼️ **Free Image APIs**

### **1. Unsplash API (Recommended)**
- **Free Tier:** Unlimited (with attribution)
- **Sign Up:** https://unsplash.com/developers
- **Features:**
  - High-quality product images
  - Free, unlimited
  - No credit card required

**Setup:**
1. Go to https://unsplash.com/developers
2. Create an app
3. Get Access Key
4. Add to Vercel: `UNSPLASH_ACCESS_KEY=your-key-here`

**Usage:**
```typescript
const url = `https://api.unsplash.com/search/photos?query=${productName}&client_id=${key}`;
```

---

### **2. Pexels API**
- **Free Tier:** 200 requests/hour
- **Sign Up:** https://www.pexels.com/api
- **Features:**
  - Free stock photos
  - Good quality
  - 200 requests/hour

**Setup:**
1. Go to https://www.pexels.com/api
2. Get API key
3. Add to Vercel: `PEXELS_API_KEY=your-key-here`

---

## 🎯 **Recommended Setup**

### **Minimum Setup (Works without APIs):**
- ✅ Product search links (no API needed)
- ✅ Placeholder images
- ✅ Estimated prices from AI

### **Enhanced Setup (With Free APIs):**
1. **Unsplash API** - Product images
2. **ScraperAPI** - Real product data scraping
3. **Price comparison** - From scraped data

### **Full Setup (All Features):**
1. ✅ Unsplash API - Images
2. ✅ ScraperAPI - Product scraping
3. ✅ Page2API - Backup scraping
4. ✅ Pexels API - Backup images

---

## 📝 **Environment Variables to Add**

Add these to Vercel (Settings → Environment Variables):

```env
# Scraping APIs (choose one)
SCRAPER_API_KEY=your-scraperapi-key
# OR
PAGE2API_KEY=your-page2api-key

# Image APIs (choose one or both)
UNSPLASH_ACCESS_KEY=your-unsplash-key
PEXELS_API_KEY=your-pexels-key
```

---

## 🚀 **Quick Start**

### **Step 1: Get Unsplash API Key (2 minutes)**
1. Visit: https://unsplash.com/developers
2. Click "Register as a developer"
3. Create an app
4. Copy your Access Key

### **Step 2: Get ScraperAPI Key (2 minutes)**
1. Visit: https://www.scraperapi.com
2. Sign up (free)
3. Copy your API key

### **Step 3: Add to Vercel**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add:
   - `UNSPLASH_ACCESS_KEY`
   - `SCRAPER_API_KEY`
4. Redeploy

---

## 💡 **How It Works**

### **Without APIs:**
- ✅ Search links work (direct to platform search)
- ✅ Placeholder images
- ✅ AI-estimated prices

### **With Unsplash API:**
- ✅ Real product images
- ✅ High-quality photos
- ✅ Better visual experience

### **With ScraperAPI:**
- ✅ Real product prices
- ✅ Actual supplier data
- ✅ Live price comparison
- ✅ Real ratings and reviews

---

## 📊 **Free Tier Limits**

| API | Free Tier | Best For |
|-----|-----------|----------|
| **ScraperAPI** | 1,000 credits/month | Product scraping |
| **Page2API** | 1,000 calls | Backup scraping |
| **Unsplash** | Unlimited | Product images |
| **Pexels** | 200/hour | Backup images |

**For 1,000 users/month:**
- ScraperAPI: ~100 credits (well within limit) ✅
- Unsplash: Unlimited ✅
- **Total Cost: $0** 🎉

---

## ✅ **Current Implementation**

The code is ready to use:
- ✅ Works without APIs (fallback mode)
- ✅ Automatically uses APIs if keys are set
- ✅ Graceful fallback if APIs fail
- ✅ No breaking changes

**Just add API keys to enable enhanced features!**

