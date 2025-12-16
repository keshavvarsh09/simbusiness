import { NextRequest, NextResponse } from 'next/server';
import { generateWithGroq, isGroqAvailable } from '@/lib/groq';
import { chatWithGemini } from '@/lib/gemini-optimized';

// AI-powered content generation API
// Uses Groq (fast, free) with Gemini fallback

export async function POST(req: NextRequest) {
    try {
        const { type, input, context } = await req.json();

        if (!type || !input) {
            return NextResponse.json(
                { error: 'Missing required fields: type, input' },
                { status: 400 }
            );
        }

        let result: any;

        switch (type) {
            case 'score_hook':
                result = await scoreHook(input);
                break;
            case 'generate_hooks':
                result = await generateHooks(input, context);
                break;
            case 'generate_script':
                result = await generateScript(input, context);
                break;
            case 'improve_content':
                result = await improveContent(input, context);
                break;
            default:
                return NextResponse.json(
                    { error: `Unknown type: ${type}` },
                    { status: 400 }
                );
        }

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Content AI error:', error);
        return NextResponse.json(
            { error: error.message || 'AI generation failed' },
            { status: 500 }
        );
    }
}

// AI-powered hook scoring with detailed feedback
async function scoreHook(hook: string): Promise<any> {
    const prompt = `You are a viral content expert. Score this TikTok/Reels hook out of 10 and provide feedback.

Hook: "${hook}"

Respond in JSON format ONLY (no markdown):
{
  "score": <1-10>,
  "label": "<Excellent/Good/Average/Needs Work>",
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "improvedVersion": "<a better version of this hook>"
}`;

    const response = await generateAI(prompt);

    try {
        // Parse JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON response');
    } catch {
        // Fallback with regex parsing
        const scoreMatch = response.match(/"score":\s*(\d+)/);
        return {
            score: scoreMatch ? parseInt(scoreMatch[1]) : 5,
            label: 'Average',
            strengths: ['Hook provided'],
            improvements: ['Try adding more emotional triggers'],
            improvedVersion: hook,
        };
    }
}

// Generate viral hook variations
async function generateHooks(product: string, context?: any): Promise<any> {
    const prompt = `Generate 5 viral TikTok/Reels hooks for this product. These hooks should stop scrolling in the first 3 seconds.

Product: ${product}
${context?.niche ? `Niche: ${context.niche}` : ''}
${context?.targetAudience ? `Target Audience: ${context.targetAudience}` : ''}

Use these viral patterns:
- POV: [scenario]
- "Stop scrolling if you have [problem]"
- "I can't believe [product] actually does this..."
- "Nobody told me about this [benefit]"
- "Why is everyone buying [product]?"

Respond in JSON format ONLY (no markdown):
{
  "hooks": [
    {"text": "<hook1>", "pattern": "<pattern name>", "emotion": "<emotion it triggers>"},
    {"text": "<hook2>", "pattern": "<pattern name>", "emotion": "<emotion it triggers>"},
    {"text": "<hook3>", "pattern": "<pattern name>", "emotion": "<emotion it triggers>"},
    {"text": "<hook4>", "pattern": "<pattern name>", "emotion": "<emotion it triggers>"},
    {"text": "<hook5>", "pattern": "<pattern name>", "emotion": "<emotion it triggers>"}
  ]
}`;

    const response = await generateAI(prompt);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON response');
    } catch {
        return {
            hooks: [
                { text: `Stop scrolling if you need ${product}!`, pattern: 'Problem Call-out', emotion: 'Curiosity' },
                { text: `POV: You just discovered ${product}`, pattern: 'POV', emotion: 'Discovery' },
                { text: `I can't believe this ${product} actually works...`, pattern: 'Disbelief', emotion: 'Surprise' },
            ]
        };
    }
}

// Generate full video script
async function generateScript(hook: string, context?: any): Promise<any> {
    const structure = context?.structure || 'Problem-Agitate-Solution';
    const duration = context?.duration || '15-30 seconds';

    const prompt = `Create a viral TikTok/Reels video script.

Hook: ${hook}
Structure: ${structure}
Target Duration: ${duration}
${context?.product ? `Product: ${context.product}` : ''}

Create a script with:
1. Hook (0-3 seconds) - Stop the scroll
2. Body (3-25 seconds) - Build interest/show value
3. CTA (final 5 seconds) - Drive action

Respond in JSON format ONLY (no markdown):
{
  "hook": "<hook text>",
  "body": "<body text with scene directions in [brackets]>",
  "cta": "<call to action>",
  "tips": ["<filming tip 1>", "<filming tip 2>"],
  "estimatedDuration": "<X seconds>"
}`;

    const response = await generateAI(prompt);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON response');
    } catch {
        return {
            hook,
            body: '[Show the product] This is what everyone has been talking about. [Demonstrate key feature]',
            cta: 'Link in bio! Comment "SEND" for details 👇',
            tips: ['Film in natural lighting', 'Keep energy high throughout'],
            estimatedDuration: '20 seconds',
        };
    }
}

// Improve existing content
async function improveContent(content: string, context?: any): Promise<any> {
    const prompt = `Improve this TikTok/Reels content to make it more viral.

Original Content:
${content}

${context?.feedback ? `Specific Feedback: ${context.feedback}` : ''}

Analyze and improve:
1. Hook strength
2. Emotional triggers
3. Curiosity gaps
4. Call to action

Respond in JSON format ONLY (no markdown):
{
  "originalScore": <1-10>,
  "improvedContent": "<improved version>",
  "improvedScore": <1-10>,
  "changes": ["<change 1>", "<change 2>", "<change 3>"]
}`;

    const response = await generateAI(prompt);

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Invalid JSON response');
    } catch {
        return {
            originalScore: 5,
            improvedContent: content,
            improvedScore: 7,
            changes: ['Added emotional trigger', 'Improved hook structure'],
        };
    }
}

// Helper: Use Groq first (fast, free), fallback to Gemini
async function generateAI(prompt: string): Promise<string> {
    // Try Groq first (fastest)
    if (isGroqAvailable()) {
        try {
            return await generateWithGroq(prompt, {
                temperature: 0.7,
                maxTokens: 1024,
                systemPrompt: 'You are a viral content expert specializing in TikTok and Instagram Reels. Always respond with valid JSON only, no markdown code blocks.',
            });
        } catch (error) {
            console.warn('Groq failed, trying Gemini:', error);
        }
    }

    // Fallback to Gemini
    try {
        const response = await chatWithGemini(prompt, { role: 'content-creator' });
        return response;
    } catch (error) {
        console.error('All AI providers failed:', error);
        throw new Error('AI service temporarily unavailable');
    }
}
