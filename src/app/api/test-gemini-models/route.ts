import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY is not set'
      }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list available models using the REST API
    // Since @google/generative-ai doesn't have a direct listModels method,
    // we'll try different model names to see which ones work
    
    const modelsToTest = [
      // New Gemini 2.5 models (June 2025)
      'models/gemini-2.5-flash',      // Recommended - stable, fast
      'models/gemini-2.5-pro',        // More powerful
      'models/gemini-2.0-flash',       // Fast and versatile
      'models/gemini-2.0-flash-001',   // Stable version
      'models/gemini-2.5-flash-lite', // Lightweight option
      // Legacy models (for comparison - likely deprecated)
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash',
    ];

    const results: any[] = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a simple test call
        const result = await model.generateContent('test');
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          status: 'success',
          works: true,
          responsePreview: text.substring(0, 50)
        });
      } catch (error: any) {
        results.push({
          model: modelName,
          status: 'error',
          works: false,
          error: error.message
        });
      }
    }

    // Also try to fetch models list via REST API
    let restApiModels: any = null;
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        restApiModels = data.models?.map((m: any) => ({
          name: m.name,
          displayName: m.displayName,
          supportedMethods: m.supportedGenerationMethods,
          description: m.description
        })) || [];
      }
    } catch (e: any) {
      // Ignore REST API errors
    }

    return NextResponse.json({
      success: true,
      apiKeyPreview: apiKey.substring(0, 10) + '...',
      modelTests: results,
      availableModelsFromAPI: restApiModels,
      workingModels: results.filter(r => r.works).map(r => r.model)
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}


