'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LESSONS, isLessonUnlocked, LearningProfile, createDefaultProfile } from '@/lib/learning-engine';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { FiArrowLeft, FiCheck, FiPlay, FiTarget, FiClock, FiAward } from 'react-icons/fi';

export default function LessonPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = parseInt(params.id as string);

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<LearningProfile | null>(null);
    const [currentSection, setCurrentSection] = useState(0);
    const [practiceComplete, setPracticeComplete] = useState(false);

    const lesson = LESSONS.find(l => l.id === lessonId);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const headers = isAuthenticated() ? getAuthHeaders() : {};
            const response = await fetch('/api/launcher/onboarding', { headers });
            const data = await response.json();

            if (data.profile) {
                setProfile(data.profile);

                // Check if lesson is unlocked
                if (!isLessonUnlocked(lessonId, data.profile.completedLessons)) {
                    router.push('/launcher');
                    return;
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !lesson) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isCompleted = profile?.completedLessons.includes(lessonId) || false;
    const totalSections = lesson.content.keyPoints.length + 2; // intro + key points + practice
    const progress = ((currentSection + 1) / totalSections) * 100;

    const handleTakeQuiz = () => {
        router.push(`/launcher/quiz/${lessonId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/launcher')}
                            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white/60 text-sm">Lesson {lessonId} of {LESSONS.length}</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                                +{lesson.xpReward} XP
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Lesson Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{lesson.icon}</span>
                        {isCompleted && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1">
                                <FiCheck /> Completed
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{lesson.title}</h1>
                    <p className="text-white/60">{lesson.description}</p>

                    <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
                        <span className="flex items-center gap-1"><FiClock /> {lesson.duration}</span>
                        {lesson.unlocksFeature && (
                            <span className="flex items-center gap-1"><FiTarget className="text-purple-400" /> Unlocks: {lesson.unlocksFeature}</span>
                        )}
                    </div>
                </motion.div>

                {/* Lesson Content */}
                <div className="space-y-6">
                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                    >
                        <h3 className="text-sm font-medium text-purple-400 mb-3 uppercase tracking-wider">Introduction</h3>
                        <p className="text-white/80 leading-relaxed">{lesson.content.intro}</p>
                    </motion.div>

                    {/* Key Points */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10"
                    >
                        <h3 className="text-sm font-medium text-purple-400 mb-4 uppercase tracking-wider">Key Takeaways</h3>
                        <div className="space-y-3">
                            {lesson.content.keyPoints.map((point, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-purple-400 text-xs font-medium">{i + 1}</span>
                                    </div>
                                    <p className="text-white/80">{point}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Practice Task */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`rounded-xl p-6 border ${practiceComplete ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'}`}
                    >
                        <h3 className="text-sm font-medium text-orange-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <FiTarget /> Practice Task
                        </h3>
                        <p className="text-white/80 mb-4">{lesson.content.practiceTask}</p>
                        <button
                            onClick={() => setPracticeComplete(!practiceComplete)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${practiceComplete
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            {practiceComplete ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                    </motion.div>
                </div>

                {/* Take Quiz CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl border border-purple-500/30"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-white mb-1">
                                {isCompleted ? 'Review Your Knowledge' : 'Ready to Test Your Knowledge?'}
                            </h3>
                            <p className="text-white/60 text-sm">
                                {isCompleted
                                    ? 'Retake the quiz to reinforce what you learned'
                                    : 'Pass the quiz to unlock the next lesson and earn XP!'
                                }
                            </p>
                        </div>
                        <button
                            onClick={handleTakeQuiz}
                            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
                        >
                            <FiPlay /> {isCompleted ? 'Retake Quiz' : 'Take Quiz'}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
