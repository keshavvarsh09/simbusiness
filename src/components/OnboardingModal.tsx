'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    FiArrowRight, FiCheck, FiPackage, FiVideo, FiTrendingUp,
    FiDollarSign, FiTarget, FiZap
} from 'react-icons/fi';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        title: 'Find Winning Products',
        description: 'Discover products that are already going viral. Look for 100K+ views on TikTok in the last 2 weeks.',
        icon: <FiPackage />,
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 2,
        title: 'Create Viral Content',
        description: 'Post 8-14 videos daily. The first 3 seconds (hook) determine if your video goes viral.',
        icon: <FiVideo />,
        color: 'from-purple-500 to-pink-500',
    },
    {
        id: 3,
        title: 'Go Organic First',
        description: 'Reach $10K profit with zero ad spend. Organic content has 50% profit margins vs 20% with ads.',
        icon: <FiTrendingUp />,
        color: 'from-green-500 to-green-600',
    },
    {
        id: 4,
        title: 'Scale with Paid Ads',
        description: 'Only after $10K organic profit, start testing ads. Use winning organic content as ad creatives.',
        icon: <FiDollarSign />,
        color: 'from-orange-500 to-orange-600',
    },
    {
        id: 5,
        title: 'Build Your Brand',
        description: 'Move from dropshipping to a real brand. Multi-channel: TikTok Shop + Facebook + Amazon.',
        icon: <FiTarget />,
        color: 'from-indigo-500 to-indigo-600',
    },
];

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
            router.push('/launcher');
        }
    };

    const handleSkip = () => {
        onComplete();
        router.push('/launcher');
    };

    if (!isOpen) return null;

    const step = ONBOARDING_STEPS[currentStep];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                {/* Progress */}
                <div className="flex gap-1 p-4">
                    {ONBOARDING_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="px-8 py-6"
                    >
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                            <span className="text-white text-3xl">{step.icon}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                            {step.title}
                        </h2>

                        <p className="text-gray-600 text-center leading-relaxed">
                            {step.description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="px-8 pb-8 flex gap-3">
                    <button
                        onClick={handleSkip}
                        className="flex-1 py-3 text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleNext}
                        className={`flex-1 py-3 bg-gradient-to-r ${step.color} text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                    >
                        {currentStep === ONBOARDING_STEPS.length - 1 ? (
                            <>
                                <FiZap /> Start Learning
                            </>
                        ) : (
                            <>
                                Next <FiArrowRight />
                            </>
                        )}
                    </button>
                </div>

                {/* Step indicator */}
                <div className="pb-6 text-center">
                    <span className="text-sm text-gray-400">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

// Quick intro card for the launcher
export function QuickStartCard() {
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-4 sm:mb-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold mb-2">🚀 Michael Bernstein's Playbook</h2>
                    <p className="text-blue-100 mb-4 text-sm sm:text-base max-w-md">
                        The strategy that built multiple 7-figure dropshipping brands.
                        Start organic, validate fast, scale with data.
                    </p>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                            ✅ Organic First
                        </div>
                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                            ✅ 8-14 Videos/Day
                        </div>
                        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-xs sm:text-sm">
                            ✅ $10K Before Ads
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/content')}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white text-purple-600 rounded-xl font-medium hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 touch-target"
                >
                    <FiVideo /> Create Content
                </button>
            </div>
        </motion.div>
    );
}
