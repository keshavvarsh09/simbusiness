# 📰 News APIs Setup Guide for Missions

## 🎯 **Purpose**

The missions system uses news APIs to fetch real-world events that affect supply chain, shipping, and business operations. These events are automatically converted into time-bound missions.

## 📋 **Free News APIs Available**

### **1. NewsAPI.org (Recommended)**
- **Free Tier:** 100 requests/day
- **Sign Up:** https://newsapi.org/register
- **Features:**
  - Comprehensive news coverage
  - Good search functionality
  - Reliable API

**Setup:**
1. Sign up at https://newsapi.org/register
2. Get your API key
3. Add to Vercel: `NEWS_API_KEY=your-key-here`

**Usage:**
```typescript
const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${key}`;
```

---

### **2. GNews API**
- **Free Tier:** 100 requests/day
- **Sign Up:** https://gnews.io/api
- **Features:**
  - Good for international news
  - Simple API

**Setup:**
1. Sign up at https://gnews.io/api
2. Get your API key
3. Add to Vercel: `GNEWS_API_KEY=your-key-here`

---

### **3. Currents API**
- **Free Tier:** 200 requests/day
- **Sign Up:** https://currentsapi.services
- **Features:**
  - Good free tier limit
  - Multiple sources

**Setup:**
1. Sign up at https://currentsapi.services
2. Get your API key
3. Add to Vercel: `CURRENTS_API_KEY=your-key-here`

---

### **4. NewsData.io**
- **Free Tier:** 200 requests/day
- **Sign Up:** https://newsdata.io
- **Features:**
  - Good free tier
  - Multiple categories

**Setup:**
1. Sign up at https://newsdata.io
2. Get your API key
3. Add to Vercel: `NEWSDATA_API_KEY=your-key-here`

---

## 🎯 **Recommended Setup**

### **Minimum Setup (Works without APIs):**
- ✅ Standard mission templates (no API needed)
- ✅ Festival-based missions (calculated locally)
- ✅ System-generated missions (labour, curfew)

### **Enhanced Setup (With News APIs):**
1. **NewsAPI.org** - Primary news source
2. **GNews API** - Backup/fallback
3. **Currents API** - Additional backup

### **Full Setup (All Features):**
1. ✅ NewsAPI.org - Primary
2. ✅ GNews API - Backup
3. ✅ Currents API - Additional backup
4. ✅ NewsData.io - Extra coverage

---

## 📝 **Environment Variables to Add**

Add these to Vercel (Settings → Environment Variables):

```env
# News APIs (choose one or more)
NEWS_API_KEY=your-newsapi-key
# OR
GNEWS_API_KEY=your-gnews-key
# OR
CURRENTS_API_KEY=your-currents-key
```

**Note:** The system will try APIs in order and fall back gracefully if none are configured.

---

## 🚀 **Quick Start**

### **Step 1: Get NewsAPI.org Key (2 minutes)**
1. Visit: https://newsapi.org/register
2. Sign up (free)
3. Copy your API key

### **Step 2: Add to Vercel**
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add: `NEWS_API_KEY`
4. Redeploy

---

## 💡 **How It Works**

### **Without APIs:**
- ✅ Standard missions work (predefined templates)
- ✅ Festival missions work (calculated locally)
- ✅ System missions work (labour, curfew)

### **With News APIs:**
- ✅ Real-world news events → Missions
- ✅ Location-based relevance
- ✅ Automatic mission generation
- ✅ News article links in missions

### **Event Types Detected:**
- **Supply Chain Disruptions** - Manufacturing delays
- **Shipping Delays** - Logistics issues
- **Labour Unavailability** - Strikes, worker issues
- **Curfew/Restrictions** - Government restrictions
- **Disasters** - Emergencies, accidents
- **Festivals** - Holiday delays

---

## 📊 **Free Tier Limits**

| API | Free Tier | Best For |
|-----|-----------|----------|
| **NewsAPI.org** | 100/day | Primary source |
| **GNews** | 100/day | Backup |
| **Currents API** | 200/day | Additional backup |
| **NewsData.io** | 200/day | Extra coverage |

**For 1,000 users/month:**
- Average: ~30 API calls/day (well within limits) ✅
- **Total Cost: $0** 🎉

---

## ✅ **Current Implementation**

The code is ready to use:
- ✅ Works without APIs (fallback mode)
- ✅ Automatically uses APIs if keys are set
- ✅ Graceful fallback if APIs fail
- ✅ Multiple API support (tries in order)
- ✅ No breaking changes

**Just add API keys to enable enhanced features!**

---

## 🔍 **Example Events That Become Missions**

1. **"Delhi Bomb Blast - Shipments Delayed"**
   - News event → Mission: "Emergency Situation: Delhi Bomb Blast"
   - Impact: Shipments held, 30% sales drop
   - Location: Delhi
   - News link included

2. **"Diwali Festival Approaching"**
   - Festival event → Mission: "Diwali Festival - Supply Chain Impact"
   - Impact: 3-5 day delays expected
   - Location: All India

3. **"Labour Strike in Mumbai"**
   - News event → Mission: "Labour Unavailability in Mumbai"
   - Impact: Manufacturing delayed, 20% sales drop
   - Location: Mumbai

---

## 🎯 **Mission Generation Flow**

1. **Auto-Generate Button Clicked**
   - Fetches news from APIs
   - Checks upcoming festivals
   - Generates system events

2. **Event → Mission Conversion**
   - News article → Mission with news link
   - Festival → Mission with date
   - System event → Standard mission

3. **Mission Display**
   - Real-time countdown timer
   - Event source badge
   - Affected location
   - News article link (if available)

---

## 📚 **Resources**

- NewsAPI.org: https://newsapi.org
- GNews API: https://gnews.io/api
- Currents API: https://currentsapi.services
- NewsData.io: https://newsdata.io

---

## ✨ **Benefits**

1. **Real-World Relevance** - Missions based on actual events
2. **Location Awareness** - Affects relevant regions
3. **News Integration** - Users can read source articles
4. **Automatic Updates** - New events = new missions
5. **Educational** - Users learn about real business challenges

