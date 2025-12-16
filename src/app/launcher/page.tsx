'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiVideo, FiTrendingUp, FiDollarSign, FiMail, FiTarget,
  FiLock, FiCheck, FiPlay, FiChevronRight, FiChevronDown, FiAward,
  FiClock, FiBookOpen, FiZap, FiBarChart2
} from 'react-icons/fi';

// Module definitions based on our product roadmap
const LEARNING_MODULES = [
  {
    id: 1,
    title: 'Product Research & Sourcing',
    description: 'Find viral products, validate demand, calculate margins with CAC',
    icon: FiPackage,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    lessons: [
      { id: '1.1', title: 'Find Viral Products', description: 'Discover products with 100K+ views', duration: '15 min', route: '/products' },
      { id: '1.2', title: 'Validate Demand', description: 'Use Google Trends and competitor analysis', duration: '20 min', route: '/products' },
      { id: '1.3', title: 'Source from Suppliers', description: 'AliExpress vs IndiaMART vs Alibaba', duration: '25 min', route: '/products' },
      { id: '1.4', title: 'Calculate Margins', description: 'Include CAC for real profitability', duration: '15 min', route: '/dashboard' },
    ],
    unlockCondition: null, // Always unlocked
  },
  {
    id: 2,
    title: 'Content Creation',
    description: 'Create hooks, scripts, and content calendars for viral videos',
    icon: FiVideo,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    lessons: [
      { id: '2.1', title: 'Hook Creation', description: 'First 3 seconds that stop the scroll', duration: '20 min', route: '/content' },
      { id: '2.2', title: 'Video Script Templates', description: 'Copy and improve existing viral content', duration: '25 min', route: '/content' },
      { id: '2.3', title: 'Content Calendar', description: 'Schedule 8-14 posts per day', duration: '15 min', route: '/content' },
    ],
    unlockCondition: { module: 1, minProgress: 50 },
  },
  {
    id: 3,
    title: 'Organic Marketing',
    description: 'Master TikTok, Instagram, and YouTube with zero ad spend',
    icon: FiTrendingUp,
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    lessons: [
      { id: '3.1', title: 'TikTok Strategy', description: 'Algorithm secrets and posting times', duration: '30 min', route: '/dashboard' },
      { id: '3.2', title: 'Instagram Reels', description: 'Repurpose TikTok content effectively', duration: '20 min', route: '/dashboard' },
      { id: '3.3', title: 'Going Viral', description: 'Trigger controversy and engagement', duration: '25 min', route: '/dashboard' },
      { id: '3.4', title: 'Convert Viewers', description: 'Bio links and call-to-actions', duration: '15 min', route: '/dashboard' },
    ],
    unlockCondition: { module: 2, minProgress: 75 },
  },
  {
    id: 4,
    title: 'Paid Advertising',
    description: 'Scale with Facebook and TikTok ads after organic validation',
    icon: FiDollarSign,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    lessons: [
      { id: '4.1', title: 'When to Start Ads', description: 'Only after $10K organic profit', duration: '15 min', route: '/dashboard' },
      { id: '4.2', title: 'Facebook Ads Setup', description: 'Targeting, creatives, and budgets', duration: '35 min', route: '/dashboard' },
      { id: '4.3', title: 'TikTok Ads', description: 'Spark Ads and GMV Max strategies', duration: '30 min', route: '/dashboard' },
      { id: '4.4', title: 'ROAS Optimization', description: 'Scale winners, kill losers fast', duration: '25 min', route: '/dashboard' },
    ],
    unlockCondition: { module: 3, minProgress: 100 },
  },
  {
    id: 5,
    title: 'Email & Funnels',
    description: 'Abandoned carts, email sequences, and upsell funnels',
    icon: FiMail,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    lessons: [
      { id: '5.1', title: 'Email Sequences', description: 'Welcome, nurture, and win-back flows', duration: '25 min', route: '/dashboard' },
      { id: '5.2', title: 'Abandoned Cart Recovery', description: 'Recover 60-70% abandoned carts', duration: '20 min', route: '/dashboard' },
      { id: '5.3', title: 'Upsell Funnels', description: 'Increase AOV with order bumps', duration: '20 min', route: '/dashboard' },
    ],
    unlockCondition: { module: 4, minProgress: 50 },
  },
  {
    id: 6,
    title: 'Scaling & Brand Building',
    description: 'Multi-channel strategy, budget allocation, and brand value',
    icon: FiTarget,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    lessons: [
      { id: '6.1', title: 'Ready to Scale?', description: 'Key metrics that signal scaling opportunity', duration: '15 min', route: '/dashboard' },
      { id: '6.2', title: 'Budget Allocation', description: 'Organic vs Paid by revenue stage', duration: '25 min', route: '/dashboard' },
      { id: '6.3', title: 'Multi-Channel', description: 'TikTok Shop + Facebook + Amazon', duration: '30 min', route: '/dashboard' },
      { id: '6.4', title: 'Brand Building', description: 'From dropshipping to real brand', duration: '20 min', route: '/dashboard' },
    ],
    unlockCondition: { module: 5, minProgress: 75 },
  },
];

interface ModuleProgress {
  moduleId: number;
  completedLessons: string[];
  progress: number;
}

export default function LauncherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [userStats, setUserStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    currentStreak: 0,
    simulationDay: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
      return;
    }
    loadProgress();
  }, [router]);

  const loadProgress = async () => {
    try {
      // Load user's module progress
      const response = await fetch('/api/launcher/progress', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setModuleProgress(data.progress || []);
          setUserStats(data.stats || userStats);
        }
      }

      // Initialize with default progress if empty
      if (moduleProgress.length === 0) {
        const defaultProgress = LEARNING_MODULES.map(m => ({
          moduleId: m.id,
          completedLessons: [],
          progress: 0,
        }));
        setModuleProgress(defaultProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Initialize with default
      const defaultProgress = LEARNING_MODULES.map(m => ({
        moduleId: m.id,
        completedLessons: [],
        progress: 0,
      }));
      setModuleProgress(defaultProgress);
    } finally {
      setLoading(false);
    }
  };

  const isModuleUnlocked = (module: typeof LEARNING_MODULES[0]) => {
    if (!module.unlockCondition) return true;
    const reqModule = moduleProgress.find(p => p.moduleId === module.unlockCondition!.module);
    return reqModule ? reqModule.progress >= module.unlockCondition.minProgress : false;
  };

  const getModuleProgress = (moduleId: number) => {
    const progress = moduleProgress.find(p => p.moduleId === moduleId);
    return progress?.progress || 0;
  };

  const getCompletedLessons = (moduleId: number) => {
    const progress = moduleProgress.find(p => p.moduleId === moduleId);
    return progress?.completedLessons || [];
  };

  const handleLessonClick = async (moduleId: number, lessonId: string, route: string) => {
    // Mark lesson as complete and save progress
    const updatedProgress = moduleProgress.map(p => {
      if (p.moduleId === moduleId && !p.completedLessons.includes(lessonId)) {
        const newCompleted = [...p.completedLessons, lessonId];
        const module = LEARNING_MODULES.find(m => m.id === moduleId);
        const newProgress = module ? Math.round((newCompleted.length / module.lessons.length) * 100) : 0;
        return { ...p, completedLessons: newCompleted, progress: newProgress };
      }
      return p;
    });

    setModuleProgress(updatedProgress);

    // Save to backend
    try {
      await fetch('/api/launcher/progress', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress: updatedProgress }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }

    // Navigate to the lesson route
    router.push(route);
  };

  const totalProgress = moduleProgress.length > 0
    ? Math.round(moduleProgress.reduce((sum, p) => sum + p.progress, 0) / LEARNING_MODULES.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiZap className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dropshipping Mastery</h1>
                <p className="text-sm text-gray-500">Your journey to $10K/month</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiClock className="text-blue-500" />
                  <span>Day {userStats.simulationDay}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiBarChart2 className="text-green-500" />
                  <span>${userStats.revenue.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <FiPlay className="text-sm" />
                Run Simulation
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Learning Progress</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">{totalProgress}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {moduleProgress.reduce((sum, p) => sum + p.completedLessons.length, 0)}
                </div>
                <div className="text-xs text-gray-600">Lessons Done</div>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {moduleProgress.filter(p => p.progress === 100).length}
                </div>
                <div className="text-xs text-gray-600">Modules</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{userStats.currentStreak}</div>
                <div className="text-xs text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Path */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiBookOpen className="text-blue-500" />
            Learning Path
          </h2>

          {LEARNING_MODULES.map((module, index) => {
            const isUnlocked = isModuleUnlocked(module);
            const progress = getModuleProgress(module.id);
            const completedLessons = getCompletedLessons(module.id);
            const isExpanded = expandedModule === module.id;
            const Icon = module.icon;

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl border ${isUnlocked ? 'border-gray-200' : 'border-gray-100'} overflow-hidden shadow-sm`}
              >
                {/* Module Header */}
                <button
                  onClick={() => isUnlocked && setExpandedModule(isExpanded ? null : module.id)}
                  disabled={!isUnlocked}
                  className={`w-full p-6 flex items-center justify-between text-left transition-all ${isUnlocked ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg`}>
                      {isUnlocked ? (
                        <Icon className="text-white text-2xl" />
                      ) : (
                        <FiLock className="text-white text-xl" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400 uppercase">Module {module.id}</span>
                        {progress === 100 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full flex items-center gap-1">
                            <FiCheck className="text-xs" /> Complete
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isUnlocked && (
                      <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-gray-900">{progress}% Complete</div>
                        <div className="text-xs text-gray-500">{completedLessons.length}/{module.lessons.length} lessons</div>
                      </div>
                    )}
                    {isUnlocked ? (
                      isExpanded ? <FiChevronDown className="text-gray-400 text-xl" /> : <FiChevronRight className="text-gray-400 text-xl" />
                    ) : (
                      <div className="text-sm text-gray-400">
                        Complete Module {module.unlockCondition?.module} first
                      </div>
                    )}
                  </div>
                </button>

                {/* Module Progress Bar */}
                {isUnlocked && (
                  <div className="px-6 pb-2">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${module.color} rounded-full transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Expanded Lessons */}
                <AnimatePresence>
                  {isExpanded && isUnlocked && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-100"
                    >
                      <div className="p-4 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const isComplete = completedLessons.includes(lesson.id);

                          return (
                            <motion.button
                              key={lesson.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: lessonIndex * 0.05 }}
                              onClick={() => handleLessonClick(module.id, lesson.id, lesson.route)}
                              className={`w-full p-4 rounded-xl flex items-center gap-4 text-left transition-all ${isComplete
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isComplete ? 'bg-green-500' : module.bgColor
                                }`}>
                                {isComplete ? (
                                  <FiCheck className="text-white" />
                                ) : (
                                  <span className={`text-sm font-medium ${module.color.includes('blue') ? 'text-blue-600' : 'text-gray-600'}`}>
                                    {lesson.id}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-medium ${isComplete ? 'text-green-800' : 'text-gray-900'}`}>
                                  {lesson.title}
                                </h4>
                                <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
                                  {lesson.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-400">
                                <FiClock />
                                <span>{lesson.duration}</span>
                              </div>
                              <FiChevronRight className={isComplete ? 'text-green-500' : 'text-gray-400'} />
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white text-left hover:opacity-90 transition-opacity"
          >
            <FiPlay className="text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Run Simulation</h3>
            <p className="text-sm text-blue-100 mt-1">Continue your dropshipping business</p>
          </button>

          <button
            onClick={() => router.push('/products')}
            className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white text-left hover:opacity-90 transition-opacity"
          >
            <FiPackage className="text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Product Manager</h3>
            <p className="text-sm text-purple-100 mt-1">Add and manage your products</p>
          </button>

          <button
            onClick={() => router.push('/inventory')}
            className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl text-white text-left hover:opacity-90 transition-opacity"
          >
            <FiBarChart2 className="text-3xl mb-3" />
            <h3 className="text-lg font-semibold">Inventory & SKU</h3>
            <p className="text-sm text-green-100 mt-1">Track stock and manage SKUs</p>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
