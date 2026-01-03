import { NextRequest, NextResponse } from 'next/server';
import { generateWithGroq, isGroqAvailable } from '@/lib/groq';
import { chatWithGemini } from '@/lib/gemini-optimized';
import { LESSONS } from '@/lib/learning-engine';

// Generate quiz questions for a lesson
export async function POST(req: NextRequest) {
    try {
        const { lessonId, questionCount = 5 } = await req.json();

        if (!lessonId) {
            return NextResponse.json(
                { error: 'Missing lessonId' },
                { status: 400 }
            );
        }

        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson) {
            return NextResponse.json(
                { error: 'Lesson not found' },
                { status: 404 }
            );
        }

        const prompt = `You are creating a quiz for a dropshipping course. Generate ${questionCount} multiple choice questions for this lesson:

Lesson: ${lesson.title}
Description: ${lesson.description}
Topics to cover: ${lesson.quizTopics.join(', ')}

Key information from the lesson:
${lesson.content.keyPoints.join('\n')}

Generate questions that test understanding, not just memorization. Include scenario-based questions.

Respond in JSON format ONLY (no markdown code blocks):
{
  "questions": [
    {
      "id": 1,
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctIndex": <0-3>,
      "explanation": "<brief explanation why the answer is correct>"
    }
  ]
}`;

        let response: string;

        // Try Groq first (faster)
        if (isGroqAvailable()) {
            try {
                response = await generateWithGroq(prompt, {
                    temperature: 0.7,
                    maxTokens: 2000,
                    systemPrompt: 'You are an expert e-commerce educator. Generate quiz questions that are practical and test real understanding. Always respond with valid JSON only.',
                });
            } catch (error) {
                console.warn('Groq failed, trying Gemini:', error);
                response = await chatWithGemini(prompt, { role: 'educator' });
            }
        } else {
            response = await chatWithGemini(prompt, { role: 'educator' });
        }

        // Parse the response
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const quiz = JSON.parse(jsonMatch[0]);
                return NextResponse.json({ success: true, quiz });
            }
            throw new Error('No JSON found in response');
        } catch (parseError) {
            // Return fallback questions
            return NextResponse.json({
                success: true,
                quiz: {
                    questions: generateFallbackQuestions(lesson),
                },
            });
        }
    } catch (error: any) {
        console.error('Quiz generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate quiz' },
            { status: 500 }
        );
    }
}

// Fallback questions if AI fails
function generateFallbackQuestions(lesson: any) {
    const fallbacks: Record<number, any[]> = {
        1: [
            {
                id: 1,
                question: 'What is the main advantage of dropshipping?',
                options: ['High profit margins', 'No inventory needed', 'No marketing required', 'Guaranteed sales'],
                correctIndex: 1,
                explanation: 'Dropshipping allows you to sell without holding inventory - the supplier ships directly to customers.',
            },
            {
                id: 2,
                question: 'What is the profit formula in dropshipping?',
                options: [
                    'Revenue - Product Cost',
                    'Selling Price - (Product + Shipping + Ads)',
                    'Sales x Quantity',
                    'Revenue / 2',
                ],
                correctIndex: 1,
                explanation: 'Profit = Selling Price - (Product Cost + Shipping + Advertising)',
            },
            {
                id: 3,
                question: 'What\'s the biggest risk in dropshipping?',
                options: ['Too many customers', 'Low conversion rates', 'High starting capital', 'Too much profit'],
                correctIndex: 1,
                explanation: 'The biggest challenge is converting traffic to sales, especially with ads.',
            },
        ],
        2: [
            {
                id: 1,
                question: 'How many views should a winning product have on TikTok?',
                options: ['10K+', '50K+', '100K+', '1M+'],
                correctIndex: 2,
                explanation: 'Products with 100K+ views show proven interest and viral potential.',
            },
            {
                id: 2,
                question: 'What price range is ideal for dropshipping products?',
                options: ['$5-15', '$20-60', '$100-200', '$500+'],
                correctIndex: 1,
                explanation: '$20-60 allows for healthy margins while being an impulse purchase.',
            },
            {
                id: 3,
                question: 'If an ad has been running for 30+ days, what does that indicate?',
                options: ['The seller is losing money', 'The product is profitable', 'The ad is broken', 'Nothing significant'],
                correctIndex: 1,
                explanation: 'Ads running for 30+ days means the seller is profitable and the product works.',
            },
        ],
    };

    return fallbacks[lesson.id] || [
        {
            id: 1,
            question: `What is the main topic of "${lesson.title}"?`,
            options: [lesson.description, 'Random topic', 'Unrelated subject', 'None of the above'],
            correctIndex: 0,
            explanation: 'This lesson focuses on ' + lesson.description.toLowerCase(),
        },
    ];
}
