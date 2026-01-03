// Learning Engine - Core logic for the learning platform
// Updated to use comprehensive curriculum

import { CURRICULUM, MODULES, getLessonsByModule, getLessonById, LessonContent } from './curriculum-content';

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

// Convert curriculum content to lesson format
function curriculumToLesson(content: LessonContent): Lesson {
    // Flatten sections into keyPoints
    const keyPoints: string[] = [];
    content.content.sections.forEach(section => {
        if (section.keyPoints) {
            keyPoints.push(...section.keyPoints);
        }
    });

    return {
        id: content.id,
        moduleId: content.moduleId,
        title: content.title,
        description: content.description,
        duration: content.duration,
        icon: content.icon,
        content: {
            intro: content.content.intro,
            keyPoints: keyPoints.slice(0, 8), // Limit to 8 key points for display
            practiceTask: content.content.practiceTask,
        },
        quizTopics: content.quizTopics,
        xpReward: content.xpReward,
        unlocksFeature: content.unlocksFeature,
    };
}

// Export all lessons from curriculum
export const LESSONS: Lesson[] = CURRICULUM.map(curriculumToLesson);

// Re-export modules
export { MODULES, getLessonsByModule, getLessonById };

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

// Get lessons by module ID
export function getLessonsForModule(moduleId: number): Lesson[] {
    return LESSONS.filter(lesson => lesson.moduleId === moduleId);
}

// Get module progress
export function getModuleProgress(moduleId: number, completedLessons: number[]): number {
    const moduleLessons = getLessonsForModule(moduleId);
    if (moduleLessons.length === 0) return 0;
    const completed = moduleLessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / moduleLessons.length) * 100);
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

// Get total lesson count
export function getTotalLessonCount(): number {
    return LESSONS.length;
}

// Get total module count
export function getTotalModuleCount(): number {
    return MODULES.length;
}
