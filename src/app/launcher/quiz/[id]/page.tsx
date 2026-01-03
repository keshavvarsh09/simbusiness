'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSONS, LearningProfile } from '@/lib/learning-engine';
import { isAuthenticated, getAuthHeaders } from '@/lib/auth';
import { FiArrowLeft, FiCheck, FiX, FiAward, FiArrowRight } from 'react-icons/fi';

interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizState {
    questions: QuizQuestion[];
    currentIndex: number;
    answers: (number | null)[];
    showResult: boolean;
    isSubmitted: boolean;
}

export default function QuizPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = parseInt(params.id as string);

    const [loading, setLoading] = useState(true);
    const [quiz, setQuiz] = useState<QuizState | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [profile, setProfile] = useState<LearningProfile | null>(null);
    const [saving, setSaving] = useState(false);

    const lesson = LESSONS.find(l => l.id === lessonId);

    useEffect(() => {
        loadQuiz();
    }, [lessonId]);

    const loadQuiz = async () => {
        try {
            // Load profile
            const headers = isAuthenticated() ? getAuthHeaders() : {};
            const profileRes = await fetch('/api/launcher/onboarding', { headers });
            const profileData = await profileRes.json();
            setProfile(profileData.profile);

            // Generate quiz
            const quizRes = await fetch('/api/ai/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, questionCount: 3 }),
            });
            const quizData = await quizRes.json();

            if (quizData.quiz?.questions) {
                setQuiz({
                    questions: quizData.quiz.questions,
                    currentIndex: 0,
                    answers: new Array(quizData.quiz.questions.length).fill(null),
                    showResult: false,
                    isSubmitted: false,
                });
            }
        } catch (error) {
            console.error('Failed to load quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (optionIndex: number) => {
        if (showExplanation) return;
        setSelectedAnswer(optionIndex);
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer === null || !quiz) return;

        const newAnswers = [...quiz.answers];
        newAnswers[quiz.currentIndex] = selectedAnswer;

        setQuiz({ ...quiz, answers: newAnswers });
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (!quiz) return;

        if (quiz.currentIndex < quiz.questions.length - 1) {
            setQuiz({ ...quiz, currentIndex: quiz.currentIndex + 1 });
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            // Show results
            setQuiz({ ...quiz, showResult: true });
        }
    };

    const handleComplete = async () => {
        if (!quiz || !profile) return;

        setSaving(true);

        const correctCount = quiz.questions.reduce((count, q, i) => {
            return count + (quiz.answers[i] === q.correctIndex ? 1 : 0);
        }, 0);

        const passed = correctCount >= Math.ceil(quiz.questions.length * 0.7);

        if (passed) {
            try {
                // Save completion
                await fetch('/api/launcher/complete-lesson', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(isAuthenticated() ? getAuthHeaders() : {}),
                    },
                    body: JSON.stringify({ lessonId }),
                });
            } catch (error) {
                console.error('Failed to save completion:', error);
            }
        }

        setSaving(false);
        router.push('/launcher');
    };

    if (loading || !quiz || !lesson) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/60">Generating your quiz...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[quiz.currentIndex];
    const progress = ((quiz.currentIndex + 1) / quiz.questions.length) * 100;

    // Calculate results
    const correctCount = quiz.questions.reduce((count, q, i) => {
        return count + (quiz.answers[i] === q.correctIndex ? 1 : 0);
    }, 0);
    const passed = correctCount >= Math.ceil(quiz.questions.length * 0.7);

    // Results screen
    if (quiz.showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-md w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/20' : 'bg-orange-500/20'
                            }`}
                    >
                        {passed ? (
                            <FiAward className="w-12 h-12 text-green-400" />
                        ) : (
                            <FiX className="w-12 h-12 text-orange-400" />
                        )}
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {passed ? '🎉 Congratulations!' : 'Almost There!'}
                    </h2>

                    <p className="text-white/60 mb-6">
                        You got {correctCount} out of {quiz.questions.length} correct
                        {passed ? `. You've earned +${lesson.xpReward} XP!` : '. You need 70% to pass.'}
                    </p>

                    {/* Score Bar */}
                    <div className="mb-8">
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(correctCount / quiz.questions.length) * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                                className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-orange-500'}`}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-white/40 mt-2">
                            <span>0%</span>
                            <span>70% to pass</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {!passed && (
                            <button
                                onClick={() => {
                                    setQuiz({
                                        ...quiz,
                                        currentIndex: 0,
                                        answers: new Array(quiz.questions.length).fill(null),
                                        showResult: false,
                                        isSubmitted: false,
                                    });
                                    setSelectedAnswer(null);
                                    setShowExplanation(false);
                                }}
                                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                        <button
                            onClick={handleComplete}
                            disabled={saving}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-shadow flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Continue <FiArrowRight /></>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push(`/launcher/lesson/${lessonId}`)}
                            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="text-white font-medium">{lesson.title} Quiz</span>
                        <span className="text-white/60 text-sm">
                            {quiz.currentIndex + 1}/{quiz.questions.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={quiz.currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Question */}
                        <div className="text-center mb-8">
                            <span className="text-purple-400 text-sm uppercase tracking-wider">Question {quiz.currentIndex + 1}</span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                                {currentQuestion.question}
                            </h2>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, i) => {
                                const isCorrect = i === currentQuestion.correctIndex;
                                const isSelected = selectedAnswer === i;
                                const showColors = showExplanation;

                                return (
                                    <motion.button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        disabled={showExplanation}
                                        whileHover={!showExplanation ? { scale: 1.02 } : {}}
                                        whileTap={!showExplanation ? { scale: 0.98 } : {}}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${showColors
                                                ? isCorrect
                                                    ? 'border-green-500 bg-green-500/20'
                                                    : isSelected
                                                        ? 'border-red-500 bg-red-500/20'
                                                        : 'border-white/10 bg-white/5'
                                                : isSelected
                                                    ? 'border-purple-500 bg-purple-500/20'
                                                    : 'border-white/10 bg-white/5 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${showColors
                                                    ? isCorrect
                                                        ? 'bg-green-500'
                                                        : isSelected
                                                            ? 'bg-red-500'
                                                            : 'bg-white/10'
                                                    : isSelected
                                                        ? 'bg-purple-500'
                                                        : 'bg-white/10'
                                                }`}>
                                                {showColors && isCorrect ? (
                                                    <FiCheck className="text-white" />
                                                ) : showColors && isSelected && !isCorrect ? (
                                                    <FiX className="text-white" />
                                                ) : (
                                                    <span className={isSelected ? 'text-white' : 'text-white/60'}>
                                                        {String.fromCharCode(65 + i)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={showColors && isCorrect ? 'text-green-400' : 'text-white'}>
                                                {option}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                                >
                                    <p className="text-blue-300 text-sm">
                                        <strong>Explanation:</strong> {currentQuestion.explanation}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* Action Button */}
                <div className="mt-8">
                    {!showExplanation ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={selectedAnswer === null}
                            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${selectedAnswer !== null
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                                }`}
                        >
                            Check Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-shadow flex items-center justify-center gap-2"
                        >
                            {quiz.currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                            <FiArrowRight />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
