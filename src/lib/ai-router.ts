import { generateWithGroq, isGroqAvailable } from './groq';
import { chatWithGemini } from './gemini-optimized';

/**
 * AI Router - Intelligently routes requests to the best AI provider
 * 
 * Strategy:
 * - Text generation (chatbot, recommendations) → Groq (fast, free)
 * - Vision/multimodal tasks → Gemini (multimodal support)
 * - Fallback: If Groq fails → Gemini
 */

export interface AIContext {
  budget?: number;
  productGenre?: string;
  revenue?: number;
  expenses?: number;
  profit?: number;
  products?: { length: number };
}

/**
 * Generate chat response using best available AI
 * Tries Groq first (fast), falls back to Gemini if needed
 */
export async function generateChatResponse(
  message: string,
  context?: AIContext
): Promise<string> {
  // Try Groq first (faster, free tier generous)
  if (isGroqAvailable()) {
    try {
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

      const response = await generateWithGroq(message, {
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1024
      });

      console.log('[AI Router] Used Groq for chat response');
      return response;
    } catch (error: any) {
      // If Groq fails with rate limit or quota, try Gemini
      if (error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
        console.log('[AI Router] Groq rate limited, falling back to Gemini');
      } else if (error?.message?.includes('API_KEY')) {
        // If API key is invalid, don't try fallback
        throw error;
      } else {
        console.log('[AI Router] Groq error, falling back to Gemini:', error.message);
      }
    }
  }

  // Fallback to Gemini
  try {
    const response = await chatWithGemini(message, context);
    console.log('[AI Router] Used Gemini for chat response (fallback)');
    return response;
  } catch (error: any) {
    // If both fail, throw the last error
    throw new Error(`AI service unavailable. ${error.message}`);
  }
}

/**
 * Generate product recommendations using best available AI
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
7. Why it's a good choice

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
    "reason": "string"
  }
]`;

  // Try Groq first
  if (isGroqAvailable()) {
    try {
      const response = await generateWithGroq(prompt, {
        temperature: 0.7,
        maxTokens: 2048
      });

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
      console.log('[AI Router] Groq failed for recommendations, using Gemini');
    }
  }

  // Fallback to Gemini (import from gemini-optimized)
  const { getProductRecommendations } = await import('./gemini-optimized');
  return await getProductRecommendations(budget, genre);
}

/**
 * Check which AI providers are available
 */
export function getAvailableProviders(): {
  groq: boolean;
  gemini: boolean;
} {
  return {
    groq: isGroqAvailable(),
    gemini: !!process.env.GEMINI_API_KEY
  };
}

