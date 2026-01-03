'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { LESSONS, getLevelFromXp, getLevelProgress, isLessonUnlocked, getNextLesson, LearningProfile, createDefaultProfile } from '@/lib/learning-engine';
import { FiLock, FiCheck, FiPlay, FiAward, FiZap, FiChevronRight, FiBook, FiTarget } from 'react-icons/fi';

export default function LauncherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      // Check if user has completed onboarding
      const headers = isAuthenticated() ? getAuthHeaders() : {};
      const response = await fetch('/api/launcher/onboarding', { headers });
      const data = await response.json();

      if (!data.onboardingComplete) {
        // Redirect to onboarding
        router.push('/launcher/onboarding');
        return;
      }

      setProfile(data.profile || createDefaultProfile());
    } catch (error) {
      console.error('Failed to check onboarding:', error);
      // Show onboarding for new users
      router.push('/launcher/onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const level = getLevelFromXp(profile.xp);
  const levelProgress = getLevelProgress(profile.xp);
  const nextLesson = getNextLesson(profile.completedLessons);
  const completionPercent = Math.round((profile.completedLessons.length / LESSONS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FiZap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Dropship Academy</h1>
                <p className="text-xs text-white/50">{completionPercent}% complete</p>
              </div>
            </div>

            {/* XP & Level */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <FiAward className="text-yellow-400" />
                <span className="text-white font-medium">{profile.xp} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
                  {level}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome & Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {profile.completedLessons.length === 0
                  ? "Let's Start Your Journey! 🚀"
                  : nextLesson
                    ? "Continue Learning 📚"
                    : "You've Completed Everything! 🎉"
                }
              </h2>
              <p className="text-white/60 text-sm sm:text-base">
                {nextLesson
                  ? `Next up: ${nextLesson.title}`
                  : "You've mastered all the fundamentals!"
                }
              </p>

              {/* Level Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                  <span>Level {level}</span>
                  <span>{levelProgress}% to Level {level + 1}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {nextLesson && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/launcher/lesson/${nextLesson.id}`)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-shadow"
              >
                <FiPlay /> {profile.completedLessons.length === 0 ? 'Start Now' : 'Continue'}
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Learning Path */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiBook className="text-purple-400" />
            Your Learning Path
          </h3>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4">
          {LESSONS.map((lesson, index) => {
            const isCompleted = profile.completedLessons.includes(lesson.id);
            const isUnlocked = isLessonUnlocked(lesson.id, profile.completedLessons);
            const isCurrent = nextLesson?.id === lesson.id;

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id);
                  }
                }}
                className={`
                  relative p-4 sm:p-5 rounded-xl border cursor-pointer transition-all
                  ${isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : isCurrent
                      ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30'
                      : isUnlocked
                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        : 'bg-white/[0.02] border-white/5 opacity-50'
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
                    ${isCompleted
                      ? 'bg-green-500/20'
                      : isUnlocked
                        ? 'bg-white/10'
                        : 'bg-white/5'
                    }
                  `}>
                    {isCompleted ? (
                      <FiCheck className="text-green-400 text-xl" />
                    ) : !isUnlocked ? (
                      <FiLock className="text-white/30 text-lg" />
                    ) : (
                      <span>{lesson.icon}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-white/40'}`}>
                          {lesson.title}
                        </h4>
                        <p className={`text-sm mt-0.5 ${isUnlocked ? 'text-white/60' : 'text-white/30'}`}>
                          {lesson.description}
                        </p>
                      </div>

                      {isUnlocked && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-white/40">{lesson.duration}</span>
                          <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">
                            +{lesson.xpReward} XP
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {selectedLesson === lesson.id && isUnlocked && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <p className="text-sm text-white/70 mb-3">
                            {lesson.content.intro}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/launcher/lesson/${lesson.id}`);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                            >
                              {isCompleted ? 'Review' : 'Start Lesson'} <FiChevronRight />
                            </button>
                            {lesson.unlocksFeature && (
                              <span className="px-3 py-2 bg-white/5 text-white/50 text-xs rounded-lg flex items-center gap-1">
                                <FiTarget className="text-purple-400" />
                                Unlocks: {lesson.unlocksFeature}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Current indicator */}
                {isCurrent && (
                  <div className="absolute -left-px top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Lessons Done', value: profile.completedLessons.length, icon: '📚' },
            { label: 'Total XP', value: profile.xp, icon: '⭐' },
            { label: 'Current Level', value: level, icon: '🏆' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
