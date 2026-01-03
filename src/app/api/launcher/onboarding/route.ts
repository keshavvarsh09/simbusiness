import { NextRequest, NextResponse } from 'next/server';

// POST - Save onboarding data (works without DB for demo mode)
export async function POST(req: NextRequest) {
    try {
        const { goal, experience, interests, timeCommitment } = await req.json();

        // Create learning profile
        const learningProfile = {
            goal,
            experience,
            interests,
            timeCommitment,
            currentLesson: 1,
            completedLessons: [] as number[],
            xp: 0,
            level: 1,
            streak: 0,
            lastActive: new Date().toISOString(),
            onboardingComplete: true,
        };

        return NextResponse.json({
            success: true,
            profile: learningProfile,
        });
    } catch (error) {
        console.error('Onboarding error:', error);
        return NextResponse.json(
            { error: 'Failed to save onboarding' },
            { status: 500 }
        );
    }
}

// GET - Check if onboarding is complete (uses localStorage via cookie for demo)
export async function GET(req: NextRequest) {
    try {
        // For demo mode, check if profile was set in cookie
        const profileCookie = req.cookies.get('learning_profile');

        if (profileCookie?.value) {
            try {
                const profile = JSON.parse(profileCookie.value);
                return NextResponse.json({
                    onboardingComplete: profile.onboardingComplete || false,
                    profile,
                });
            } catch {
                // Invalid cookie
            }
        }

        // No profile found - onboarding not complete
        return NextResponse.json({ onboardingComplete: false });
    } catch (error) {
        console.error('Onboarding check error:', error);
        return NextResponse.json({ onboardingComplete: false });
    }
}
