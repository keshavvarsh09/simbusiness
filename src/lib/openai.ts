import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY || '';
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Model configuration - GPT-3.5 Turbo is fast and cost-effective
const DEFAULT_MODEL = process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo';

// Rate limiting (OpenAI free tier: 3 RPM, paid: 3,500 RPM)
const RATE_LIMIT_RPM = parseInt(process.env.OPENAI_RATE_LIMIT_RPM || '3500');
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Request timeout (30 seconds)
const REQUEST_TIMEOUT_MS = 30000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Response cache
interface CacheEntry {
  response: string;
  timestamp: number;
  ttl: number;
}

const responseCache = new Map<string, CacheEntry>();
const DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Check rate limit
 */
function checkRateLimit(identifier: string = 'default'): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT_RPM) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Get cached response
 */
function getCachedResponse(cacheKey: string): string | null {
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
function setCachedResponse(cacheKey: string, response: string, ttl: number = DEFAULT_CACHE_TTL): void {
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now(),
    ttl
  });

  // Clean up old entries
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
 * Generate cache key
 */
function generateCacheKey(prompt: string, context?: any): string {
  const contextStr = context ? JSON.stringify(context) : '';
  return `openai:${DEFAULT_MODEL}:${Buffer.from(prompt + contextStr).toString('base64').substring(0, 100)}`;
}

/**
 * Create a timeout promise
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

/**
 * Generate text using OpenAI API with timeout and retry
 */
export async function generateWithOpenAI(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    useCache?: boolean;
    cacheTTL?: number;
    context?: any;
    retries?: number;
  } = {}
): Promise<string> {
  if (!openai || !apiKey) {
    throw new Error('OPENAI_API_KEY is not set or is empty');
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 1024,
    systemPrompt,
    useCache = true,
    cacheTTL = DEFAULT_CACHE_TTL,
    context,
    retries = 2
  } = options;

  // Check cache first
  if (useCache) {
    const cacheKey = generateCacheKey(prompt, context);
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      console.log('[OpenAI] Cache hit');
      return cached;
    }
  }

  // Check rate limit
  if (!checkRateLimit('openai')) {
    throw new Error(`OpenAI rate limit exceeded. Maximum ${RATE_LIMIT_RPM} requests per minute. Please try again in a moment.`);
  }

  const messages: any[] = [];
  
  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt
    });
  }
  
  messages.push({
    role: 'user',
    content: prompt
  });

  // Retry logic with exponential backoff
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create timeout promise
      const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
      
      // Create API call promise
      const apiPromise = openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      // Race between API call and timeout
      const completion = await Promise.race([apiPromise, timeoutPromise]);
      
      const response = completion.choices[0]?.message?.content;
      
      if (!response || response.trim() === '') {
        throw new Error('Empty response from OpenAI API');
      }

      // Cache the response
      if (useCache) {
        const cacheKey = generateCacheKey(prompt, context);
        setCachedResponse(cacheKey, response, cacheTTL);
      }

      return response;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        throw new Error('OPENAI_API_KEY is invalid or missing');
      } else if (error?.message?.includes('quota') || error?.message?.includes('429')) {
        throw new Error('OpenAI API quota exceeded. Please try again later.');
      } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
        throw new Error('OpenAI API permission denied. Check your API key.');
      } else if (error?.message?.includes('timeout')) {
        // Retry on timeout
        if (attempt < retries) {
          const backoffMs = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`[OpenAI] Timeout, retrying in ${backoffMs}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
      } else if (error?.message?.includes('rate limit') || error?.status === 429) {
        // Retry on rate limit with backoff
        if (attempt < retries) {
          const backoffMs = Math.pow(2, attempt) * 2000; // Longer backoff for rate limits
          console.log(`[OpenAI] Rate limited, retrying in ${backoffMs}ms... (attempt ${attempt + 1}/${retries + 1})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
      }
      
      // If we've exhausted retries or it's a non-retryable error, throw
      if (attempt === retries) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Failed to call OpenAI API');
}

/**
 * Chat with OpenAI (optimized for business advisor)
 */
export async function chatWithOpenAI(message: string, userContext?: any): Promise<string> {
  const systemPrompt = `You are an AI business advisor for a dropshipping simulation platform. Help users with their business questions and decisions.

${userContext ? `
User Context:
- Budget: ${userContext.budget || 'Not set'}
- Product Genre: ${userContext.productGenre || 'Not set'}
- Current Products: ${userContext.products?.length || 0}
- Revenue: $${userContext.revenue || 0}
- Expenses: $${userContext.expenses || 0}
- Profit: $${userContext.profit || 0}
` : ''}

Provide helpful, actionable advice. Be concise but thorough. Consider the user's context when giving recommendations.`;

  return await generateWithOpenAI(message, {
    systemPrompt,
    temperature: 0.7,
    maxTokens: 1024,
    useCache: false, // Don't cache conversational messages
    context: userContext
  });
}

/**
 * Check if OpenAI is available and configured
 */
export function isOpenAIAvailable(): boolean {
  return !!(openai && apiKey && apiKey.trim() !== '');
}

/**
 * Get available OpenAI models
 */
export const OPENAI_MODELS = {
  'gpt-3.5-turbo': 'GPT-3.5 Turbo (Recommended - Fast & Cost-effective)',
  'gpt-4': 'GPT-4 (Best quality, slower)',
  'gpt-4-turbo': 'GPT-4 Turbo (Best quality, faster than GPT-4)',
  'gpt-4o': 'GPT-4o (Latest, optimized)',
  'gpt-4o-mini': 'GPT-4o Mini (Fast, cost-effective)',
};

