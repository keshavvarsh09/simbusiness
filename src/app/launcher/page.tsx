'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSONS, MODULES, getLevelFromXp, getLevelProgress, isLessonUnlocked, getNextLesson, getLessonsForModule, getModuleProgress, LearningProfile } from '@/lib/learning-engine';
import { FiLock, FiCheck, FiPlay, FiAward, FiZap, FiChevronRight, FiChevronDown, FiBook } from 'react-icons/fi';

export default function LauncherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LearningProfile | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const storedProfile = localStorage.getItem('learning_profile');
      if (storedProfile) {
        try {
          const parsed = JSON.parse(storedProfile);
          if (parsed.onboardingComplete) {
            setProfile(parsed);
            // Auto-expand module with next lesson
            const nextLesson = getNextLesson(parsed.completedLessons || []);
            if (nextLesson) {
              setExpandedModule(nextLesson.moduleId);
            }
            setLoading(false);
            return;
          }
        } catch (e) {
          localStorage.removeItem('learning_profile');
        }
      }
      router.push('/launcher/onboarding');
    } catch (error) {
      console.error('Failed to check onboarding:', error);
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

  if (!profile) return null;

  const level = getLevelFromXp(profile.xp);
  const levelProgress = getLevelProgress(profile.xp);
  const nextLesson = getNextLesson(profile.completedLessons || []);
  const completedCount = profile.completedLessons?.length || 0;
  const completionPercent = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <FiZap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Dropship Academy</h1>
                <p className="text-xs text-white/50">{completedCount}/{LESSONS.length} lessons ({completionPercent}%)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <FiAward className="text-yellow-400" />
                <span className="text-white font-medium">{profile.xp} XP</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
                {level}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Continue Learning Card */}
        {nextLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-1">Continue where you left off</p>
                <h2 className="text-xl font-bold text-white mb-1">{nextLesson.title}</h2>
                <p className="text-white/50 text-sm">{nextLesson.duration} • {nextLesson.xpReward} XP</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/launcher/lesson/${nextLesson.id}`)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <FiPlay /> Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Modules */}
        <div className="space-y-4">
          {MODULES.map((module, moduleIndex) => {
            const moduleLessons = getLessonsForModule(module.id);
            const moduleProgress = getModuleProgress(module.id, profile.completedLessons || []);
            const isExpanded = expandedModule === module.id;
            const hasLessons = moduleLessons.length > 0;
            const firstLessonUnlocked = moduleLessons.length > 0 && isLessonUnlocked(moduleLessons[0].id, profile.completedLessons || []);

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: moduleIndex * 0.1 }}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  className="w-full p-4 sm:p-5 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {module.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-white/40 font-medium">MODULE {module.id}</span>
                      {moduleProgress === 100 && <FiCheck className="text-green-400 text-sm" />}
                    </div>
                    <h3 className="text-white font-semibold">{module.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[150px]">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/40">{hasLessons ? moduleLessons.length : '0'} lessons</span>
                    </div>
                  </div>
                  <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <FiChevronDown className="text-white/40 text-xl" />
                  </div>
                </button>

                {/* Module Lessons */}
                <AnimatePresence>
                  {isExpanded && hasLessons && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-2 sm:p-3 space-y-1">
                        {moduleLessons.map((lesson) => {
                          const isCompleted = profile.completedLessons?.includes(lesson.id);
                          const isUnlocked = isLessonUnlocked(lesson.id, profile.completedLessons || []);
                          const isCurrent = nextLesson?.id === lesson.id;

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => isUnlocked && router.push(`/launcher/lesson/${lesson.id}`)}
                              disabled={!isUnlocked}
                              className={`w-full p-3 sm:p-4 rounded-lg flex items-center gap-3 transition-all text-left ${isCompleted
                                  ? 'bg-green-500/10 hover:bg-green-500/15'
                                  : isCurrent
                                    ? 'bg-purple-500/20 ring-1 ring-purple-500/50'
                                    : isUnlocked
                                      ? 'hover:bg-white/5'
                                      : 'opacity-40 cursor-not-allowed'
                                }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isCompleted
                                  ? 'bg-green-500/30 text-green-400'
                                  : isUnlocked
                                    ? 'bg-white/10 text-white/60'
                                    : 'bg-white/5 text-white/30'
                                }`}>
                                {isCompleted ? <FiCheck /> : isUnlocked ? <span className="text-lg">{lesson.icon}</span> : <FiLock className="text-sm" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium truncate ${isCompleted ? 'text-green-400' : 'text-white'}`}>
                                  {lesson.title}
                                </p>
                                <p className="text-white/40 text-xs">{lesson.duration} • {lesson.xpReward} XP</p>
                              </div>
                              {isUnlocked && !isCompleted && (
                                <FiChevronRight className="text-white/30 flex-shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {isExpanded && !hasLessons && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 p-6 text-center"
                    >
                      <p className="text-white/40 text-sm">Coming soon...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{completedCount}</p>
            <p className="text-xs text-white/40">Completed</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{profile.xp}</p>
            <p className="text-xs text-white/40">Total XP</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">Lv.{level}</p>
            <p className="text-xs text-white/40">Your Level</p>
          </div>
        </div>
      </main>
    </div>
  );
}
