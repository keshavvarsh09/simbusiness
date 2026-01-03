'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiCheck, FiTarget, FiClock, FiTrendingUp, FiPackage } from 'react-icons/fi';

interface OnboardingStep {
    id: number;
    title: string;
    subtitle: string;
    options: {
        id: string;
        label: string;
        description?: string;
        icon?: string;
    }[];
    multiSelect?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 1,
        title: "What's your goal?",
        subtitle: "This helps us personalize your learning path",
        options: [
            { id: 'side_income', label: 'Side Income', description: 'Earn extra $500-2K/month', icon: '💰' },
            { id: 'full_time', label: 'Full-Time Business', description: 'Replace my 9-5 job', icon: '🚀' },
            { id: 'learn_skills', label: 'Learn Skills', description: 'Understand e-commerce', icon: '📚' },
        ],
    },
    {
        id: 2,
        title: "What's your experience level?",
        subtitle: "Be honest - we'll adjust the content for you",
        options: [
            { id: 'beginner', label: 'Complete Beginner', description: "Never sold anything online", icon: '🌱' },
            { id: 'tried', label: 'Tried Before', description: "Started but didn't succeed", icon: '🔄' },
            { id: 'some_success', label: 'Some Success', description: "Made a few sales", icon: '📈' },
            { id: 'experienced', label: 'Experienced', description: "Running a store already", icon: '⭐' },
        ],
    },
    {
        id: 3,
        title: "What products interest you?",
        subtitle: "Select all that apply",
        multiSelect: true,
        options: [
            { id: 'fashion', label: 'Fashion & Apparel', icon: '👕' },
            { id: 'electronics', label: 'Electronics & Gadgets', icon: '📱' },
            { id: 'home', label: 'Home & Living', icon: '🏠' },
            { id: 'beauty', label: 'Beauty & Skincare', icon: '💄' },
            { id: 'fitness', label: 'Fitness & Health', icon: '💪' },
            { id: 'toys', label: 'Toys & Games', icon: '🎮' },
        ],
    },
    {
        id: 4,
        title: "How much time can you invest?",
        subtitle: "Weekly commitment to learning and building",
        options: [
            { id: 'minimal', label: '2-5 hours/week', description: 'Casual learning pace', icon: '🐢' },
            { id: 'moderate', label: '5-15 hours/week', description: 'Steady progress', icon: '🚶' },
            { id: 'intensive', label: '15+ hours/week', description: 'Fast-track mode', icon: '🏃' },
        ],
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const step = ONBOARDING_STEPS[currentStep];
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    const handleSelect = (optionId: string) => {
        if (step.multiSelect) {
            const current = (answers[step.id] as string[]) || [];
            if (current.includes(optionId)) {
                setAnswers({ ...answers, [step.id]: current.filter(id => id !== optionId) });
            } else {
                setAnswers({ ...answers, [step.id]: [...current, optionId] });
            }
        } else {
            setAnswers({ ...answers, [step.id]: optionId });
        }
    };

    const isSelected = (optionId: string) => {
        const answer = answers[step.id];
        if (step.multiSelect) {
            return (answer as string[] || []).includes(optionId);
        }
        return answer === optionId;
    };

    const canContinue = () => {
        const answer = answers[step.id];
        if (step.multiSelect) {
            return (answer as string[] || []).length > 0;
        }
        return !!answer;
    };

    const handleNext = async () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit onboarding
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/launcher/onboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        goal: answers[1],
                        experience: answers[2],
                        interests: answers[3],
                        timeCommitment: answers[4],
                    }),
                });

                if (response.ok) {
                    router.push('/launcher');
                } else {
                    console.error('Failed to save onboarding');
                    router.push('/launcher');
                }
            } catch (error) {
                console.error('Onboarding error:', error);
                router.push('/launcher');
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`p-2 rounded-lg transition-all ${currentStep === 0
                                ? 'opacity-0 pointer-events-none'
                                : 'text-white/60 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="text-white/60 text-sm">
                        Step {currentStep + 1} of {ONBOARDING_STEPS.length}
                    </span>
                    <div className="w-9" /> {/* Spacer for alignment */}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Question */}
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    {step.title}
                                </h1>
                                <p className="text-white/60">
                                    {step.subtitle}
                                </p>
                            </div>

                            {/* Options */}
                            <div className={`grid gap-3 ${step.options.length > 4 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
                                {step.options.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${isSelected(option.id)
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                                            }`}
                                    >
                                        {/* Checkmark */}
                                        {isSelected(option.id) && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center"
                                            >
                                                <FiCheck className="w-4 h-4 text-white" />
                                            </motion.div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{option.icon}</span>
                                            <div>
                                                <div className="font-semibold text-white">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-sm text-white/50 mt-0.5">{option.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6">
                <div className="max-w-2xl mx-auto">
                    <motion.button
                        onClick={handleNext}
                        disabled={!canContinue() || isSubmitting}
                        whileHover={{ scale: canContinue() ? 1.02 : 1 }}
                        whileTap={{ scale: canContinue() ? 0.98 : 1 }}
                        className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${canContinue()
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : currentStep === ONBOARDING_STEPS.length - 1 ? (
                            <>Start Learning</>
                        ) : (
                            <>Continue <FiArrowRight /></>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
