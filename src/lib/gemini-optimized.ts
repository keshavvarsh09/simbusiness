import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Model name - can be overridden via environment variable
// Updated to Gemini 2.5 models (June 2025)
// Recommended: models/gemini-2.5-flash (fast, stable)
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'models/gemini-2.5-flash';

// Fallback models in order of preference (if primary model fails)
const FALLBACK_MODELS = [
  'models/gemini-2.0-flash',        // Fast and reliable
  'models/gemini-2.0-flash-001',    // Stable version
  'models/gemini-2.5-flash-lite',  // Lightweight option
];

// Rate limiting configuration based on Gemini API documentation
// Gemini Free Tier: 15 requests per minute (RPM) = 1 request per 4 seconds
// Using conservative approach: minimum 5 seconds between requests for free tier (safer)
const RATE_LIMIT_RPM = parseInt(process.env.GEMINI_RATE_LIMIT_RPM || '15');
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MIN_REQUEST_INTERVAL_MS = Math.ceil((60 * 1000) / RATE_LIMIT_RPM); // Minimum time between requests (4 seconds for 15 RPM)
const REQUEST_COOLDOWN_MS = parseInt(process.env.GEMINI_COOLDOWN_MS || '5000'); // 5 seconds cooldown (conservative)

// Global request tracking to ensure only one request at a time
let lastRequestTime = 0;
let activeRequestCount = 0;
const MAX_CONCURRENT_REQUESTS = 1; // Only one request at a time

// Simple in-memory rate limiter (for serverless, consider Redis in production)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Request queue to ensure requests are spaced out and sequential
interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  execute: () => Promise<any>;
  timestamp: number;
  retries: number;
}

const requestQueue: QueuedRequest[] = [];
let isProcessingQueue = false;
let queueProcessingPromise: Promise<void> | null = null;

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
function checkRateLimit(identifier: string = 'default'): { allowed: boolean; waitTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    // Reset or create new entry
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return { allowed: true, waitTime: 0 };
  }

  if (entry.count >= RATE_LIMIT_RPM) {
    // Rate limit exceeded - calculate wait time
    const waitTime = entry.resetAt - now;
    return { allowed: false, waitTime };
  }

  entry.count++;
  return { allowed: true, waitTime: 0 };
}

/**
 * Wait for cooldown period (ensures minimum time between requests)
 */
async function waitForCooldown(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const cooldownNeeded = REQUEST_COOLDOWN_MS - timeSinceLastRequest;

  if (cooldownNeeded > 0) {
    console.log(`[Gemini] Cooldown: waiting ${cooldownNeeded}ms before next request...`);
    await new Promise(resolve => setTimeout(resolve, cooldownNeeded));
  }
}

/**
 * Process request queue sequentially with proper spacing
 */
async function processRequestQueue(): Promise<void> {
  // Prevent multiple queue processors
  if (isProcessingQueue) {
    return;
  }

  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    // Ensure only one request at a time
    if (activeRequestCount >= MAX_CONCURRENT_REQUESTS) {
      await new Promise(resolve => setTimeout(resolve, 100));
      continue;
    }

    const request = requestQueue.shift();
    if (!request) break;

    activeRequestCount++;

    try {
      // Always wait for cooldown before making request
      await waitForCooldown();

      // Check rate limit
      const { allowed, waitTime } = checkRateLimit('api');
      
      if (!allowed) {
        // Rate limit exceeded, wait and re-queue
        console.log(`[Gemini] Rate limit exceeded, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        requestQueue.unshift({ ...request, retries: (request.retries || 0) + 1 }); // Re-queue at front
        activeRequestCount--;
        continue;
      }

      // Execute request
      console.log(`[Gemini] Processing request (queue: ${requestQueue.length} remaining)...`);
      lastRequestTime = Date.now();
      const result = await request.execute();
      request.resolve(result);
    } catch (error: any) {
      // Handle 429 errors by waiting and retrying instead of failing
      if (error?.message?.includes('429') || error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
        const retryDelay = Math.min(30000, (request.retries || 0) * 2000 + 5000); // Exponential backoff, max 30s
        console.log(`[Gemini] 429 error, waiting ${retryDelay}ms before retry (attempt ${(request.retries || 0) + 1})...`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Re-queue for retry (max 3 retries)
        if ((request.retries || 0) < 3) {
          requestQueue.unshift({ ...request, retries: (request.retries || 0) + 1 });
        } else {
          request.reject(new Error('Gemini API rate limit exceeded. Please try again in a few minutes.'));
        }
      } else {
        // Other errors - reject immediately
        request.reject(error);
      }
    } finally {
      activeRequestCount--;
    }
  }

  isProcessingQueue = false;
}

/**
 * Queue a request to ensure proper spacing and sequential processing
 */
function queueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      resolve,
      reject,
      execute,
      timestamp: Date.now(),
      retries: 0
    });

    // Start processing queue if not already processing
    if (!queueProcessingPromise) {
      queueProcessingPromise = processRequestQueue().finally(() => {
        queueProcessingPromise = null;
      });
    }
  });
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

  // Queue the request to ensure proper spacing
  return queueRequest(async () => {
    // Try primary model first, then fallbacks
    const modelsToTry = [model, ...FALLBACK_MODELS.filter(m => m !== model)];
    let lastError: any = null;
    let retryDelay = 1000; // Start with 1 second delay for retries

    for (const modelToTry of modelsToTry) {
      try {
        const modelInstance = genAI.getGenerativeModel({ model: modelToTry });
        const result = await modelInstance.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim() === '') {
          throw new Error('Empty response from Gemini API');
        }

        // Log if we used a fallback model
        if (modelToTry !== model) {
          console.log(`[Gemini] Using fallback model: ${modelToTry} (primary ${model} failed)`);
        }

        // Cache the response
        if (useCache) {
          const cacheKey = generateCacheKey(prompt, context);
          setCachedResponse(cacheKey, text, cacheTTL);
        }

        return text;
      } catch (error: any) {
        lastError = error;
        
        // Handle 429 (Too Many Requests) - throw to let queue handler retry
        if (error?.message?.includes('429') || error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
          // Let the queue handler retry this with proper backoff
          throw error; // Will be caught by queue handler
        }
        
        // If it's a 503 (overloaded) or 404 (not found), wait and try next model
        if (error?.message?.includes('503') || error?.message?.includes('overloaded') || 
            error?.message?.includes('404') || error?.message?.includes('not found')) {
          console.log(`[Gemini] Model ${modelToTry} failed, waiting before trying next fallback...`);
          await waitForCooldown(); // Wait before trying next model
          continue; // Try next model
        }
        
        // For other errors (API key, etc.), don't try fallbacks
        if (error?.message?.includes('API_KEY') || error?.message?.includes('401')) {
          throw new Error('GEMINI_API_KEY is invalid or missing');
        } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
          throw new Error('Gemini API permission denied. Check your API key.');
        }
        
        // If we're on the last model, throw the error
        if (modelToTry === modelsToTry[modelsToTry.length - 1]) {
          throw error;
        }
      }
    }

    // If all models failed, throw the last error
    if (lastError) {
      console.error('Error calling Gemini API (all models failed):', lastError);
      throw lastError;
    }

    throw new Error('Failed to call Gemini API');
  });
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

For each product, provide:
1. Product name and category
2. Estimated cost and selling price
3. Profit margin
4. Market demand (high/medium/low)
5. Competition level (high/medium/low)
6. Recommended MOQ
7. Search terms for finding on Alibaba, AliExpress, IndiaMart (specific keywords)
8. Why it's a good choice

**IMPORTANT: Respond ONLY with valid JSON array, no markdown, no code blocks, no explanations before or after.**

JSON array format:
[
  {
    "name": "string",
    "category": "string",
    "estimatedCost": number,
    "sellingPrice": number,
    "profitMargin": number,
    "demand": "high|medium|low",
    "competition": "high|medium|low",
    "recommendedMOQ": number,
    "searchTerms": "string (keywords for Alibaba/AliExpress/IndiaMart search)",
    "reason": "string"
  }
]

Generate the recommendations now:`;

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

