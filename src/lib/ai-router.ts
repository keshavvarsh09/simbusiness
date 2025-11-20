import { generateWithGroq, isGroqAvailable } from './groq';
import { chatWithGemini } from './gemini-optimized';
import { chatWithOpenAI, isOpenAIAvailable } from './openai';

/**
 * AI Router - Intelligently routes requests to the best FREE AI provider
 * 
 * Strategy (Priority Order - FREE TIER FOCUSED):
 * 1. Groq (FASTEST free tier - 30 RPM, very fast responses)
 * 2. Gemini (Free tier - 15 RPM, good quality)
 * 3. OpenAI (Only if available - may require paid tier for production)
 * 
 * Features:
 * - Automatic failover with timeout handling (20s timeout)
 * - Response caching for better performance
 * - Rate limit management
 * - Retry logic with exponential backoff
 * - All APIs are free tier compatible
 */

export interface AIContext {
  budget?: number;
  productGenre?: string;
  revenue?: number;
  expenses?: number;
  profit?: number;
  products?: { length: number };
}

// Request timeout (20 seconds)
const REQUEST_TIMEOUT_MS = 20000;

/**
 * Create a timeout promise
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

/**
 * Generate chat response using best available FREE AI
 * Priority: Groq (fastest free) → Gemini (good free) → OpenAI (optional)
 */
export async function generateChatResponse(
  message: string,
  context?: AIContext
): Promise<string> {
  const systemPrompt = `You are an AI business advisor for a dropshipping simulation platform. Help users with their business questions and decisions.

${context ? `
User Context:
- Budget: ${context.budget || 'Not set'}
- Product Genre: ${context.productGenre || 'Not set'}
- Current Products: ${context.products?.length || 0}
- Revenue: $${context.revenue || 0}
- Expenses: $${context.expenses || 0}
- Profit: $${context.profit || 0}
` : ''}

Provide helpful, actionable advice. Be concise but thorough. Consider the user's context when giving recommendations.`;

  // Priority 1: Try Groq FIRST (FASTEST free tier - 30 RPM, very fast responses ~200ms)
  if (isGroqAvailable()) {
    try {
      const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
      const apiPromise = generateWithGroq(message, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1024
      });
      
      const response = await Promise.race([apiPromise, timeoutPromise]);
      console.log('[AI Router] Used Groq for chat response (fastest free option)');
      return response;
    } catch (error: any) {
      // If Groq fails, log and try next
      if (error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
        console.log('[AI Router] Groq rate limited, falling back to Gemini');
      } else if (error?.message?.includes('API_KEY')) {
        console.log('[AI Router] Groq API key issue, trying Gemini');
      } else if (error?.message?.includes('timeout')) {
        console.log('[AI Router] Groq timeout, trying Gemini');
      } else {
        console.log('[AI Router] Groq error, falling back to Gemini:', error.message);
      }
    }
  }

  // Priority 2: Try Gemini (Free tier - 15 RPM, good quality)
  try {
    const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
    const apiPromise = chatWithGemini(message, context);
    
    const response = await Promise.race([apiPromise, timeoutPromise]);
    console.log('[AI Router] Used Gemini for chat response (free tier)');
    return response;
  } catch (error: any) {
    // Priority 3: Try OpenAI as last resort (may require paid tier)
    if (isOpenAIAvailable()) {
      try {
        const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
        const apiPromise = chatWithOpenAI(message, context);
        
        const response = await Promise.race([apiPromise, timeoutPromise]);
        console.log('[AI Router] Used OpenAI for chat response (fallback)');
        return response;
      } catch (openaiError: any) {
        console.log('[AI Router] OpenAI also failed:', openaiError.message);
      }
    }
    
    // If all fail, provide helpful error message
    const errorMsg = error?.message || 'Unknown error';
    throw new Error(`All AI services unavailable. Last error: ${errorMsg}. Please check your API keys (GROQ_API_KEY or GEMINI_API_KEY recommended for free tier).`);
  }
}

/**
 * Generate product recommendations using best available AI
 * Includes search terms for finding products on Alibaba, AliExpress, and IndiaMart
 */
export async function generateProductRecommendations(
  budget: number,
  genre: string
): Promise<any> {
  const prompt = `Recommend 10 dropshipping products for budget $${budget}, genre "${genre}".

For each product, provide:
1. Product name and category
2. Estimated cost and selling price
3. Profit margin
4. Market demand (high/medium/low)
5. Competition level
6. Recommended MOQ
7. Search terms for finding on Alibaba, AliExpress, IndiaMart (specific keywords that will find this product)
8. Why it's a good choice

Format as JSON array:
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
]`;

  // Priority 1: Try Groq FIRST (fastest free tier)
  if (isGroqAvailable()) {
    try {
      const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
      const apiPromise = generateWithGroq(prompt, {
        temperature: 0.7,
        maxTokens: 2048
      });
      
      const response = await Promise.race([apiPromise, timeoutPromise]);

      // Try to parse JSON
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // If JSON parsing fails, return text
      }

      return { recommendations: response, rawResponse: response };
    } catch (error: any) {
      console.log('[AI Router] Groq failed for recommendations, trying Gemini');
    }
  }

  // Priority 2: Try Gemini (free tier)
  try {
    const { getProductRecommendations } = await import('./gemini-optimized');
    const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
    const apiPromise = getProductRecommendations(budget, genre);
    
    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    // Try to parse JSON if it's a string
    if (typeof response === 'string') {
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // If JSON parsing fails, return as is
      }
    }
    
    return response;
  } catch (error: any) {
    // Priority 3: Try OpenAI as last resort (may require paid tier)
    if (isOpenAIAvailable()) {
      try {
        const { generateWithOpenAI } = await import('./openai');
        const timeoutPromise = createTimeout(REQUEST_TIMEOUT_MS);
        const apiPromise = generateWithOpenAI(prompt, {
          temperature: 0.7,
          maxTokens: 2048,
          useCache: true,
          cacheTTL: 30 * 60 * 1000 // 30 min cache
        });
        
        const response = await Promise.race([apiPromise, timeoutPromise]);

        // Try to parse JSON
        try {
          const jsonMatch = response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        } catch (e) {
          // If JSON parsing fails, return text
        }

        return { recommendations: response, rawResponse: response };
      } catch (openaiError: any) {
        console.log('[AI Router] OpenAI also failed for recommendations');
      }
    }
    
    throw error;
  }
}

/**
 * Check which AI providers are available
 */
export function getAvailableProviders(): {
  openai: boolean;
  groq: boolean;
  gemini: boolean;
} {
  return {
    openai: isOpenAIAvailable(),
    groq: isGroqAvailable(),
    gemini: !!process.env.GEMINI_API_KEY
  };
}

