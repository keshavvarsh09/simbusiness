import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Model name - can be overridden via environment variable
// Updated to Gemini 2.5 models (June 2025)
// Recommended: models/gemini-2.5-flash (fast, stable)
// Alternatives: models/gemini-2.5-pro, models/gemini-2.0-flash
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'models/gemini-2.5-flash';

// Fallback models in order of preference (if primary model fails)
const FALLBACK_MODELS = [
  'models/gemini-2.0-flash',        // Fast and reliable
  'models/gemini-2.0-flash-001',    // Stable version
  'models/gemini-2.5-flash-lite',  // Lightweight option
];

// Helper function to try models with fallback
async function tryModelsWithFallback(prompt: string | any[], isVision: boolean = false): Promise<string> {
  const modelsToTry = [MODEL_NAME, ...FALLBACK_MODELS.filter(m => m !== MODEL_NAME)];
  let lastError: any = null;

  for (const modelToTry of modelsToTry) {
    try {
      const modelInstance = genAI.getGenerativeModel({ model: modelToTry });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }

      if (modelToTry !== MODEL_NAME) {
        console.log(`[Gemini] Using fallback model: ${modelToTry} (primary ${MODEL_NAME} failed)`);
      }

      return text;
    } catch (error: any) {
      lastError = error;
      
      // If it's a 503 (overloaded) or 404 (not found), try next model
      if (error?.message?.includes('503') || error?.message?.includes('overloaded') || 
          error?.message?.includes('404') || error?.message?.includes('not found')) {
        console.log(`[Gemini] Model ${modelToTry} failed, trying next fallback...`);
        continue;
      }
      
      // For other errors, don't try fallbacks
      if (error?.message?.includes('API_KEY') || error?.message?.includes('401')) {
        throw new Error('GEMINI_API_KEY is invalid or missing');
      } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit') || error?.message?.includes('429')) {
        throw new Error('Gemini API quota exceeded. Please try again later.');
      } else if (error?.message?.includes('permission') || error?.message?.includes('403')) {
        throw new Error('Gemini API permission denied. Check your API key.');
      }
      
      // If we're on the last model, throw the error
      if (modelToTry === modelsToTry[modelsToTry.length - 1]) {
        throw error;
      }
    }
  }

  if (lastError) {
    console.error('Error calling Gemini API (all models failed):', lastError);
    throw lastError;
  }

  throw new Error('Failed to call Gemini API');
}

// Initialize Gemini models
const geminiPro = genAI.getGenerativeModel({ model: MODEL_NAME });
const geminiProVision = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Analyze product from URL (Amazon, Myntra, etc.)
 */
export async function analyzeProductFromUrl(url: string, userBudget?: number, productGenre?: string) {
  try {
    const prompt = `Analyze this product from the URL: ${url}

Please provide a comprehensive analysis including:
1. Product name, category, and description
2. Current selling price and estimated cost
3. Competition analysis (similar products, pricing, reviews)
4. Feasibility assessment (market demand, profit potential)
5. Recommended MOQ (Minimum Order Quantity) for dropshipping
6. Potential vendors on IndiaMart, Alibaba, or AliExpress with estimated MOQs
7. Overall recommendation (good to have, solves a problem, or not recommended)
8. Risk factors

${userBudget ? `User's budget: $${userBudget}` : ''}
${productGenre ? `Product genre preference: ${productGenre}` : ''}

Format the response as JSON with the following structure:
{
  "productName": "string",
  "category": "string",
  "currentPrice": number,
  "estimatedCost": number,
  "profitMargin": number,
  "competition": {
    "similarProducts": number,
    "averagePrice": number,
    "marketSaturation": "high|medium|low"
  },
  "feasibility": {
    "score": number (0-100),
    "demand": "high|medium|low",
    "profitPotential": "high|medium|low",
    "recommendation": "strongly_recommend|recommend|neutral|not_recommend"
  },
  "vendors": [
    {
      "platform": "indiamart|alibaba|aliexpress",
      "estimatedMOQ": number,
      "estimatedPrice": number
    }
  ],
  "riskFactors": ["string"],
  "overallAssessment": "string"
}`;

    const text = await tryModelsWithFallback(prompt, false);
    
    // Try to parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      analysis: text,
      rawResponse: text
    };
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
 * Analyze Meta dashboard image
 */
export async function analyzeMetaDashboard(imageBase64: string, mimeType: string = 'image/png', customPrompt?: string) {
  try {
    const prompt = `Analyze this Meta (Facebook) advertising dashboard screenshot. 

Extract and analyze:
1. Key performance metrics (impressions, clicks, CTR, CPC, CPM, conversions, ROAS)
2. Campaign performance trends
3. Ad spend vs results
4. Profitability analysis
5. Recommendations for optimization
6. Current statistics assessment (good, needs improvement, critical)

Provide a detailed analysis with specific numbers and actionable recommendations.

Format as JSON:
{
  "metrics": {
    "impressions": number,
    "clicks": number,
    "ctr": number,
    "cpc": number,
    "cpm": number,
    "conversions": number,
    "roas": number,
    "adSpend": number,
    "revenue": number
  },
  "performance": {
    "status": "excellent|good|needs_improvement|poor",
    "profitability": number (profit margin %),
    "trend": "improving|stable|declining"
  },
  "recommendations": ["string"],
  "assessment": "string"
}`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    };

    const text = await tryModelsWithFallback([prompt, imagePart], true);
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      analysis: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error analyzing Meta dashboard:', error);
    throw error;
  }
}

/**
 * Get product recommendations based on budget and genre
 */
export async function getProductRecommendations(budget: number, genre: string) {
  try {
    const prompt = `Based on a budget of $${budget} and product genre "${genre}", recommend top 10 performing products for dropshipping in 2024.

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

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      recommendations: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error getting product recommendations:', error);
    throw error;
  }
}

/**
 * Chatbot conversation with context
 */
export async function chatWithGemini(message: string, userContext?: any) {
  try {
    // Check if API key is set
    if (!apiKey || apiKey === '') {
      throw new Error('GEMINI_API_KEY is not set or is empty');
    }

    const contextPrompt = userContext ? `
User Context:
- Budget: ${userContext.budget || 'Not set'}
- Product Genre: ${userContext.productGenre || 'Not set'}
- Current Products: ${userContext.products?.length || 0}
- Revenue: $${userContext.revenue || 0}
- Expenses: $${userContext.expenses || 0}
- Profit: $${userContext.profit || 0}
` : '';

    const prompt = `You are an AI business advisor for a dropshipping simulation platform. Help the user with their business questions and decisions.

${contextPrompt}

User message: ${message}

Provide helpful, actionable advice. Be concise but thorough. Consider the user's context when giving recommendations.`;

    const text = await tryModelsWithFallback(prompt, false);
    
    if (!text || text.trim() === '') {
      throw new Error('Empty response from Gemini API');
    }
    
    return text;
  } catch (error: any) {
    console.error('Error in chatbot:', error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API_KEY')) {
      throw new Error('GEMINI_API_KEY is invalid or missing');
    } else if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error?.message?.includes('permission')) {
      throw new Error('Gemini API permission denied. Check your API key.');
    }
    
    throw error;
  }
}

/**
 * Analyze TikTok/Reel content performance
 */
export async function analyzeContentPerformance(contentUrl: string, engagementMetrics: any) {
  try {
    const prompt = `Analyze this social media content performance:

Content URL: ${contentUrl}
Engagement Metrics: ${JSON.stringify(engagementMetrics)}

Provide:
1. Performance assessment
2. What's working well
3. Areas for improvement
4. Content recommendations
5. Tools to improve production

Format as JSON:
{
  "performance": "excellent|good|needs_improvement|poor",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "tools": ["string"],
  "detailedAnalysis": "string"
}`;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      analysis: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
}

/**
 * Get Meta Ads strategy recommendations
 */
export async function getMetaAdsStrategy(productInfo: any, budget: number) {
  try {
    const prompt = `Provide a detailed Meta (Facebook/Instagram) ads strategy for this product:

Product: ${JSON.stringify(productInfo)}
Budget: $${budget}

Include:
1. Campaign structure
2. Target audience recommendations
3. Ad creative suggestions
4. Budget allocation
5. Bidding strategy
6. Optimization tips
7. Expected results

Format as JSON:
{
  "campaignStructure": "string",
  "targetAudience": {
    "demographics": "string",
    "interests": ["string"],
    "behaviors": ["string"]
  },
  "adCreative": {
    "format": "string",
    "messaging": "string",
    "visuals": "string"
  },
  "budgetAllocation": {
    "dailyBudget": number,
    "campaignDuration": number,
    "breakdown": "string"
  },
  "biddingStrategy": "string",
  "optimizationTips": ["string"],
  "expectedResults": {
    "impressions": number,
    "clicks": number,
    "conversions": number,
    "roas": number
  },
  "detailedStrategy": "string"
}`;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      strategy: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error getting Meta ads strategy:', error);
    throw error;
  }
}

/**
 * Get Google Ads strategy recommendations
 */
export async function getGoogleAdsStrategy(productInfo: any, budget: number) {
  try {
    const prompt = `Provide a detailed Google Ads strategy for this product:

Product: ${JSON.stringify(productInfo)}
Budget: $${budget}

Include:
1. Campaign type (Search, Display, Shopping, etc.)
2. Keyword strategy
3. Ad copy recommendations
4. Budget allocation
5. Bidding strategy
6. Optimization tips
7. Expected results

Format as JSON:
{
  "campaignType": "string",
  "keywords": {
    "primary": ["string"],
    "longTail": ["string"],
    "negative": ["string"]
  },
  "adCopy": {
    "headlines": ["string"],
    "descriptions": ["string"]
  },
  "budgetAllocation": {
    "dailyBudget": number,
    "campaignDuration": number,
    "breakdown": "string"
  },
  "biddingStrategy": "string",
  "optimizationTips": ["string"],
  "expectedResults": {
    "impressions": number,
    "clicks": number,
    "conversions": number,
    "roas": number
  },
  "detailedStrategy": "string"
}`;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      strategy: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error getting Google Ads strategy:', error);
    throw error;
  }
}

/**
 * Analyze bankruptcy risk
 */
export async function analyzeBankruptcyRisk(businessData: any) {
  try {
    const prompt = `Analyze the bankruptcy risk for this business:

Business Data: ${JSON.stringify(businessData)}

Provide:
1. Bankruptcy risk score (0-100)
2. Key risk factors
3. Current financial health
4. Critical issues
5. Recommendations to avoid bankruptcy
6. Time until potential bankruptcy (if at risk)

Format as JSON:
{
  "riskScore": number (0-100),
  "status": "safe|warning|critical|bankrupt",
  "riskFactors": [
    {
      "factor": "string",
      "severity": "high|medium|low",
      "impact": "string"
    }
  ],
  "financialHealth": {
    "cashFlow": "positive|negative|critical",
    "profitability": "profitable|breakeven|losing",
    "liquidity": "good|moderate|poor"
  },
  "criticalIssues": ["string"],
  "recommendations": ["string"],
  "timeUntilBankruptcy": "string (if applicable)",
  "detailedAnalysis": "string"
}`;

    const result = await geminiPro.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // If JSON parsing fails, return text response
    }
    
    return {
      analysis: text,
      rawResponse: text
    };
  } catch (error) {
    console.error('Error analyzing bankruptcy risk:', error);
    throw error;
  }
}

