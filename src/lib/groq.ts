import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY || '';
const groq = apiKey ? new Groq({ apiKey }) : null;

// Model configuration
// Groq supports: llama-3.1-70b-versatile, mixtral-8x7b-32768, gemma2-9b-it
const DEFAULT_MODEL = process.env.GROQ_MODEL_NAME || 'llama-3.1-70b-versatile';

// Rate limiting (Groq free tier: ~30 requests/minute)
const RATE_LIMIT_RPM = parseInt(process.env.GROQ_RATE_LIMIT_RPM || '30');
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// Request timeout (20 seconds)
const REQUEST_TIMEOUT_MS = 20000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

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
 * Generate text using Groq API
 * Fast, free, and reliable for text generation tasks
 */
export async function generateWithGroq(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<string> {
  if (!groq || !apiKey) {
    throw new Error('GROQ_API_KEY is not set or is empty');
  }

  // Check rate limit
  if (!checkRateLimit('groq')) {
    throw new Error(`Groq rate limit exceeded. Maximum ${RATE_LIMIT_RPM} requests per minute. Please try again in a moment.`);
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 2048,
    systemPrompt
  } = options;

  try {
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

    // Create timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`)), REQUEST_TIMEOUT_MS);
    });

    // Create API call promise
    const apiPromise = groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    // Race between API call and timeout
    const completion = await Promise.race([apiPromise, timeoutPromise]);

    const response = completion.choices[0]?.message?.content;
    
    if (!response || response.trim() === '') {
      throw new Error('Empty response from Groq API');
    }

    return response;
  } catch (error: any) {
    console.error('Error calling Groq API:', error);

    // Provide specific error messages
    if (error?.message?.includes('API_KEY') || error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
      throw new Error('GROQ_API_KEY is invalid or missing');
    } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit') || error?.message?.includes('429')) {
      throw new Error('Groq API quota exceeded. Please try again later.');
    } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
      throw new Error('Groq API permission denied. Check your API key.');
    }

    throw error;
  }
}

/**
 * Check if Groq is available and configured
 */
export function isGroqAvailable(): boolean {
  return !!(groq && apiKey && apiKey.trim() !== '');
}

/**
 * Get available Groq models
 */
export const GROQ_MODELS = {
  'llama-3.1-70b-versatile': 'Llama 3.1 70B (Recommended - Best quality)',
  'mixtral-8x7b-32768': 'Mixtral 8x7B (Fast, good quality)',
  'gemma2-9b-it': 'Gemma 2 9B (Lightweight, fast)',
};

