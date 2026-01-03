import { NextRequest, NextResponse } from 'next/server';
import { LESSONS, getLevelFromXp } from '@/lib/learning-engine';

// POST - Complete a lesson (works without DB for demo mode)
export async function POST(req: NextRequest) {
    try {
        const { lessonId } = await req.json();

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

        // Return success with XP info (actual tracking done client-side for demo)
        return NextResponse.json({
            success: true,
            xpEarned: lesson.xpReward,
            unlockedFeature: lesson.unlocksFeature,
        });
    } catch (error) {
        console.error('Complete lesson error:', error);
        return NextResponse.json(
            { error: 'Failed to complete lesson' },
            { status: 500 }
        );
    }
}
