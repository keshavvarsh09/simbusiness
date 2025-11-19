# 🚀 Free API Setup Guide for AI Business Advisor

## ✅ Recommended FREE API Configuration

The AI Business Advisor is optimized to use **FREE APIs** with intelligent fallback chains.

### Priority Order (Fastest to Slowest):

1. **Groq** (FASTEST - ~200ms response time)
   - Free tier: 30 requests/minute
   - Very fast responses
   - Best for real-time chat

2. **Gemini** (Good quality - ~2-5s response time)
   - Free tier: 15 requests/minute
   - Good quality responses
   - Reliable fallback

3. **OpenAI** (Optional - may require paid tier)
   - Free tier: Very limited (3 requests/minute)
   - Best quality but slower
   - Only used as last resort

---

## 🔑 Getting FREE API Keys

### 1. Groq API (RECOMMENDED - Fastest Free Option)

1. Go to: https://console.groq.com/
2. Sign up for free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key

**Free Tier Limits:**
- 30 requests per minute
- Very fast responses (~200ms)
- No credit card required

**Add to `.env`:**
```env
GROQ_API_KEY=gsk_your_key_here
```

---

### 2. Gemini API (Google - Good Fallback)

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Create API key
4. Copy the key

**Free Tier Limits:**
- 15 requests per minute
- Good quality responses
- No credit card required

**Add to `.env`:**
```env
GEMINI_API_KEY=your_key_here
```

---

### 3. OpenAI API (Optional - Limited Free Tier)

1. Go to: https://platform.openai.com/api-keys
2. Sign up (get $5 free credit)
3. Create API key
4. Copy the key

**Free Tier Limits:**
- $5 free credit (then pay-as-you-go)
- 3 requests per minute (free tier)
- Best quality but slower

**Add to `.env`:**
```env
OPENAI_API_KEY=sk-your_key_here
```

---

## ⚡ How the Fallback System Works

The system automatically tries APIs in this order:

```
User Request
    ↓
1. Try Groq (fastest free)
    ↓ (if fails)
2. Try Gemini (good free fallback)
    ↓ (if fails)
3. Try OpenAI (optional, may require paid)
    ↓ (if all fail)
Error with helpful message
```

### Features:
- ✅ **Automatic failover** - If one API fails, tries next one
- ✅ **Timeout protection** - 20 second timeout per request
- ✅ **Rate limit handling** - Respects free tier limits
- ✅ **Response caching** - Reduces API calls
- ✅ **Error recovery** - Graceful degradation

---

## 🎯 Recommended Setup (Free Tier)

For best performance with FREE APIs, use this configuration:

```env
# Primary (fastest free option)
GROQ_API_KEY=gsk_your_groq_key_here

# Fallback (good free option)
GEMINI_API_KEY=your_gemini_key_here

# Optional (limited free tier)
# OPENAI_API_KEY=sk-your_openai_key_here
```

**With this setup:**
- ✅ Groq handles most requests (fastest)
- ✅ Gemini handles overflow (when Groq rate limited)
- ✅ Both are completely FREE
- ✅ No credit card required

---

## 📊 Performance Comparison

| API | Free Tier | Speed | Quality | Setup Difficulty |
|-----|-----------|-------|---------|------------------|
| **Groq** | 30 RPM | ⚡⚡⚡⚡⚡ (~200ms) | ⭐⭐⭐⭐ | Easy |
| **Gemini** | 15 RPM | ⚡⚡⚡ (~2-5s) | ⭐⭐⭐⭐⭐ | Easy |
| **OpenAI** | 3 RPM | ⚡⚡⚡ (~1-3s) | ⭐⭐⭐⭐⭐ | Easy |

**Recommendation:** Use Groq + Gemini for best free tier experience.

---

## 🔧 Troubleshooting

### "All AI services unavailable"
- Check that at least one API key is set
- Verify API keys are correct
- Check internet connection

### "Rate limit exceeded"
- Wait 1 minute and try again
- The system will automatically try the next API
- Consider adding more API keys for better fallback

### Slow responses
- Groq is fastest - make sure GROQ_API_KEY is set
- Check your internet connection
- Response caching helps with repeated queries

---

## 💡 Tips for Production

1. **Use Groq as primary** - Fastest free option
2. **Add Gemini as fallback** - Handles rate limits gracefully
3. **Enable caching** - Already enabled by default
4. **Monitor rate limits** - System handles automatically
5. **Add OpenAI only if needed** - For premium features

---

## ✅ Quick Start

1. Get Groq API key: https://console.groq.com/
2. Get Gemini API key: https://aistudio.google.com/app/apikey
3. Add both to `.env` file
4. Restart your application
5. Enjoy fast, free AI responses! 🚀

---

**All APIs are FREE to start - no credit card required for Groq and Gemini!**

