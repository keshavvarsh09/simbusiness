import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Model name - can be overridden via environment variable
// Updated to Gemini 2.5 models (June 2025)
// Recommended: models/gemini-2.5-flash (fast, stable)
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'models/gemini-2.5-flash';

// Rate limiting configuration
// Gemini Free Tier: 15 requests per minute (RPM)
// Paid Tier: 60+ RPM depending on plan
const RATE_LIMIT_RPM = parseInt(process.env.GEMINI_RATE_LIMIT_RPM || '15');
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Simple in-memory rate limiter (for serverless, consider Redis in production)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Simple cache for responses (consider Redis for production)
interface CacheEntry {
  response: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const responseCache = new Map<string, CacheEntry>();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes default

/**
 * Check rate limit
 */
function checkRateLimit(identifier: string = 'default'): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Reset or create new entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_RPM) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

/**
 * Get cached response if available
 */
function getCachedResponse(cacheKey: string): any | null {
  const entry = responseCache.get(cacheKey);
  if (!entry) return null;

  const now = Date.now();
  if (now > entry.timestamp + entry.ttl) {
    responseCache.delete(cacheKey);
    return null;
  }

  return entry.response;
}

/**
 * Cache a response
 */
function setCachedResponse(cacheKey: string, response: any, ttl: number = DEFAULT_CACHE_TTL): void {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    ttl
  });

  // Clean up old entries periodically (simple cleanup)
  if (responseCache.size > 100) {
    const now = Date.now();
    for (const [key, entry] of Array.from(responseCache.entries())) {
      if (now > entry.timestamp + entry.ttl) {
        responseCache.delete(key);
      }
    }
  }
}

/**
 * Generate a cache key from prompt
 */
function generateCacheKey(prompt: string, context?: any): string {
  const contextStr = context ? JSON.stringify(context) : '';
  return `gemini:${MODEL_NAME}:${Buffer.from(prompt + contextStr).toString('base64').substring(0, 100)}`;
}

/**
 * Optimized Gemini API call with rate limiting and caching
 */
async function callGeminiAPI(
  prompt: string,
  options: {
    useCache?: boolean;
    cacheTTL?: number;
    context?: any;
    model?: string;
  } = {}
): Promise<string> {
  const {
    useCache = true,
    cacheTTL = DEFAULT_CACHE_TTL,
    context,
    model = MODEL_NAME
  } = options;

  // Check cache first
  if (useCache) {
    const cacheKey = generateCacheKey(prompt, context);
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      console.log('[Gemini] Cache hit');
      return cached;
    }
  }

  // Check rate limit
  if (!checkRateLimit('api')) {
    throw new Error(`Rate limit exceeded. Maximum ${RATE_LIMIT_RPM} requests per minute. Please try again in a moment.`);
  }

  try {
    const modelInstance = genAI.getGenerativeModel({ model });
    const result = await modelInstance.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }

    // Cache the response
    if (useCache) {
      const cacheKey = generateCacheKey(prompt, context);
      setCachedResponse(cacheKey, text, cacheTTL);
    }

    return text;
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);

    // Provide more specific error messages
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401')) {
      throw new Error('GEMINI_API_KEY is invalid or missing');
    } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit') || error?.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
      throw new Error('Gemini API permission denied. Check your API key.');
    } else if (error?.message?.includes('404')) {
      throw new Error(`Model "${model}" not found. Please check GEMINI_MODEL_NAME environment variable.`);
    }

    throw error;
  }
}

/**
 * Optimized product analysis with shorter prompts
 */
export async function analyzeProductFromUrl(url: string, userBudget?: number, productGenre?: string) {
  const cacheKey = `product:${url}:${userBudget || ''}:${productGenre || ''}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  // Optimized prompt - shorter and more focused
  const prompt = `Analyze product from: ${url}
Budget: ${userBudget || 'Not specified'}, Genre: ${productGenre || 'Any'}

Provide JSON:
{
  "productName": "string",
  "category": "string",
  "currentPrice": number,
  "estimatedCost": number,
  "profitMargin": number,
  "competition": {"similarProducts": number, "averagePrice": number, "marketSaturation": "high|medium|low"},
  "feasibility": {"score": 0-100, "demand": "high|medium|low", "profitPotential": "high|medium|low", "recommendation": "strongly_recommend|recommend|neutral|not_recommend"},
  "vendors": [{"platform": "indiamart|alibaba|aliexpress", "estimatedMOQ": number, "estimatedPrice": number}],
  "riskFactors": ["string"],
  "overallAssessment": "string"
}`;

  try {
    const text = await callGeminiAPI(prompt, { useCache: true, cacheTTL: 10 * 60 * 1000 }); // 10 min cache for product analysis
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setCachedResponse(cacheKey, result, 10 * 60 * 1000);
        return result;
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    const result = { analysis: text, rawResponse: text };
    setCachedResponse(cacheKey, result, 10 * 60 * 1000);
    return result;
  } catch (error: any) {
    console.error('Error analyzing product:', error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401')) {
      throw new Error('GEMINI_API_KEY is invalid or missing');
    } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit') || error?.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
      throw new Error('Gemini API permission denied. Check your API key.');
    } else if (error?.message?.includes('404') || error?.message?.includes('not found')) {
      throw new Error(`Gemini model "${MODEL_NAME}" not found. Please check GEMINI_MODEL_NAME environment variable.`);
    }
    
    throw error;
  }
}

/**
 * Optimized chatbot with conversation context
 */
export async function chatWithGemini(message: string, userContext?: any) {
  if (!apiKey || apiKey === '') {
    throw new Error('GEMINI_API_KEY is not set or is empty');
  }

  // Don't cache chatbot messages (they're conversational)
  const contextPrompt = userContext ? `
Context: Budget: ${userContext.budget || 'N/A'}, Genre: ${userContext.productGenre || 'N/A'}, Products: ${userContext.products?.length || 0}, Revenue: $${userContext.revenue || 0}, Profit: $${userContext.profit || 0}` : '';

  const prompt = `You are an AI business advisor for dropshipping. Be concise and actionable.

${contextPrompt}

User: ${message}

Provide helpful, actionable advice.`;

  return await callGeminiAPI(prompt, { useCache: false, context: userContext });
}

/**
 * Optimized product recommendations
 */
export async function getProductRecommendations(budget: number, genre: string) {
  const cacheKey = `recommendations:${budget}:${genre}`;
  const cached = getCachedResponse(cacheKey);
  if (cached) return cached;

  const prompt = `Recommend 10 dropshipping products for budget $${budget}, genre "${genre}".

JSON array:
[{"name": "string", "category": "string", "estimatedCost": number, "sellingPrice": number, "profitMargin": number, "demand": "high|medium|low", "competition": "high|medium|low", "recommendedMOQ": number, "reason": "string"}]`;

  try {
    const text = await callGeminiAPI(prompt, { useCache: true, cacheTTL: 30 * 60 * 1000 }); // 30 min cache
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        setCachedResponse(cacheKey, result, 30 * 60 * 1000);
        return result;
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    const result = { recommendations: text, rawResponse: text };
    setCachedResponse(cacheKey, result, 30 * 60 * 1000);
    return result;
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw error;
  }
}

// Re-export other functions - keeping original implementations for now
// These can be optimized later if needed
import { 
  analyzeMetaDashboard as _analyzeMetaDashboard,
  analyzeContentPerformance as _analyzeContentPerformance,
  getMetaAdsStrategy as _getMetaAdsStrategy,
  getGoogleAdsStrategy as _getGoogleAdsStrategy,
  analyzeBankruptcyRisk as _analyzeBankruptcyRisk
} from './gemini';

export const analyzeMetaDashboard = _analyzeMetaDashboard;
export const analyzeContentPerformance = _analyzeContentPerformance;
export const getMetaAdsStrategy = _getMetaAdsStrategy;
export const getGoogleAdsStrategy = _getGoogleAdsStrategy;
export const analyzeBankruptcyRisk = _analyzeBankruptcyRisk;

