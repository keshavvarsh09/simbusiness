// Learning Engine - Core logic for the learning platform

export interface Lesson {
    id: number;
    moduleId: number;
    title: string;
    description: string;
    duration: string;
    icon: string;
    content: {
        intro: string;
        keyPoints: string[];
        practiceTask: string;
    };
    quizTopics: string[];
    xpReward: number;
    unlocksFeature?: string;
}

export interface LearningProfile {
    goal: string;
    experience: string;
    interests: string[];
    timeCommitment: string;
    currentLesson: number;
    completedLessons: number[];
    xp: number;
    level: number;
    streak: number;
    lastActive: string;
    onboardingComplete: boolean;
}

// Define all lessons
export const LESSONS: Lesson[] = [
    {
        id: 1,
        moduleId: 1,
        title: 'Understanding Dropshipping',
        description: 'Learn what dropshipping is and why it works',
        duration: '10 min',
        icon: '📚',
        content: {
            intro: 'Dropshipping is a business model where you sell products without holding inventory. When a customer orders, the supplier ships directly to them.',
            keyPoints: [
                'No upfront inventory investment needed',
                'Low risk - you only pay after making a sale',
                'Focus on marketing, not logistics',
                'Profit = Selling Price - (Product Cost + Shipping + Ads)',
            ],
            practiceTask: 'Calculate the profit margin for a $30 product that costs $10 to source with $5 shipping',
        },
        quizTopics: ['dropshipping basics', 'business model', 'profit margins'],
        xpReward: 100,
    },
    {
        id: 2,
        moduleId: 1,
        title: 'Finding Winning Products',
        description: 'Discover products that are already selling well',
        duration: '15 min',
        icon: '🔍',
        content: {
            intro: 'A winning product solves a problem, has "wow factor", and is already proven to sell on social media.',
            keyPoints: [
                'Look for products with 100K+ views on TikTok',
                'Check if ads are running for 30+ days (means profitable)',
                'Avoid saturated products everyone is selling',
                'Target $20-60 price range for best margins',
            ],
            practiceTask: 'Find 3 products on TikTok with over 100K views in the last 7 days',
        },
        quizTopics: ['product research', 'market validation', 'price points'],
        xpReward: 150,
        unlocksFeature: '/products',
    },
    {
        id: 3,
        moduleId: 2,
        title: 'Creating Viral Hooks',
        description: 'Master the first 3 seconds that stop the scroll',
        duration: '12 min',
        icon: '🎣',
        content: {
            intro: 'The hook is the most important part of your video. You have 3 seconds to grab attention before they scroll.',
            keyPoints: [
                'Start with movement or unexpected visuals',
                'Use pattern interrupts (controversy, surprise)',
                'Call out your target audience directly',
                'Create a curiosity gap they need to close',
            ],
            practiceTask: 'Write 5 different hooks for a posture corrector product',
        },
        quizTopics: ['viral hooks', 'attention grabbing', 'content creation'],
        xpReward: 150,
        unlocksFeature: '/content',
    },
    {
        id: 4,
        moduleId: 2,
        title: 'Video Script Formulas',
        description: 'Proven structures for converting viewers to buyers',
        duration: '15 min',
        icon: '📝',
        content: {
            intro: 'Great videos follow a structure: Hook → Problem → Solution → Proof → CTA',
            keyPoints: [
                'Problem-Agitate-Solution (PAS) works best for beginners',
                'Show the product in action within first 10 seconds',
                'Use testimonials or before/after as proof',
                'End with clear call-to-action (link in bio)',
            ],
            practiceTask: 'Write a 30-second script using the PAS formula',
        },
        quizTopics: ['video scripts', 'content formulas', 'call to action'],
        xpReward: 150,
    },
    {
        id: 5,
        moduleId: 3,
        title: 'TikTok Algorithm Secrets',
        description: 'How TikTok decides what goes viral',
        duration: '12 min',
        icon: '📱',
        content: {
            intro: 'TikTok shows your video to a small test group first. If they engage, it gets pushed to more people.',
            keyPoints: [
                'Watch time is the #1 factor - keep videos under 30s',
                'Posting time matters less than consistency',
                'Comments and shares > likes for virality',
                'Post 3-5 times daily minimum',
            ],
            practiceTask: 'Plan your first week of content (21-35 videos)',
        },
        quizTopics: ['TikTok algorithm', 'social media strategy', 'posting schedule'],
        xpReward: 200,
    },
    {
        id: 6,
        moduleId: 3,
        title: 'Going Organic First',
        description: 'Validate your product without spending on ads',
        duration: '15 min',
        icon: '🌱',
        content: {
            intro: 'Never spend on ads until you have organic proof. Organic validation saves thousands in failed ad tests.',
            keyPoints: [
                'Reach $1K-10K in sales organically first',
                'Organic content has 50%+ margins vs 20% with ads',
                'Use organic winners as ad creatives later',
                'Build an audience that trusts you',
            ],
            practiceTask: 'Set a goal: How much will you make before running ads?',
        },
        quizTopics: ['organic marketing', 'validation strategy', 'profit margins'],
        xpReward: 200,
    },
    {
        id: 7,
        moduleId: 4,
        title: 'When to Start Paid Ads',
        description: 'Know the right time to scale with advertising',
        duration: '15 min',
        icon: '💰',
        content: {
            intro: 'Start paid ads only after organic proof and with content that already works.',
            keyPoints: [
                'Wait until $5K-10K organic revenue',
                'Use your best performing organic content',
                'Start with $20-50/day budget',
                'Target 2x ROAS minimum to be profitable',
            ],
            practiceTask: 'Calculate your break-even ROAS for your product',
        },
        quizTopics: ['paid advertising', 'ROAS', 'ad budgets'],
        xpReward: 250,
        unlocksFeature: '/dashboard',
    },
];

// Calculate XP needed for each level
export function getXpForLevel(level: number): number {
    return level * 200;
}

// Calculate current level from XP
export function getLevelFromXp(xp: number): number {
    let level = 1;
    let xpNeeded = 0;
    while (xp >= xpNeeded + getXpForLevel(level)) {
        xpNeeded += getXpForLevel(level);
        level++;
    }
    return level;
}

// Get progress to next level (0-100)
export function getLevelProgress(xp: number): number {
    const level = getLevelFromXp(xp);
    let xpAtLevelStart = 0;
    for (let i = 1; i < level; i++) {
        xpAtLevelStart += getXpForLevel(i);
    }
    const xpInCurrentLevel = xp - xpAtLevelStart;
    const xpNeededForNextLevel = getXpForLevel(level);
    return Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100);
}

// Check if a lesson is unlocked
export function isLessonUnlocked(lessonId: number, completedLessons: number[]): boolean {
    if (lessonId === 1) return true;
    return completedLessons.includes(lessonId - 1);
}

// Get next lesson to complete
export function getNextLesson(completedLessons: number[]): Lesson | null {
    for (const lesson of LESSONS) {
        if (!completedLessons.includes(lesson.id)) {
            return lesson;
        }
    }
    return null;
}

// Create default learning profile
export function createDefaultProfile(): LearningProfile {
    return {
        goal: '',
        experience: '',
        interests: [],
        timeCommitment: '',
        currentLesson: 1,
        completedLessons: [],
        xp: 0,
        level: 1,
        streak: 0,
        lastActive: new Date().toISOString(),
        onboardingComplete: false,
    };
}
