'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiTrendingUp, FiVideo, FiMail, FiTarget, FiInfo } from 'react-icons/fi';

interface BudgetCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    percentage: number;
    minRecommended: number;
    description: string;
}

interface BudgetAllocatorProps {
    totalBudget: number;
    revenue: number;
    onAllocationChange?: (allocations: Record<string, number>) => void;
}

// Budget recommendations by revenue stage (Michael Bernstein methodology)
const REVENUE_STAGES = [
    { max: 10000, label: '$0-10K', strategy: 'ORGANIC FIRST', description: '100% organic content. No paid ads yet.' },
    { max: 50000, label: '$10K-50K', strategy: 'TEST ADS', description: '70% organic, 30% testing paid ads.' },
    { max: 100000, label: '$50K-100K', strategy: 'SCALE', description: '40% organic, 60% scaling paid ads.' },
    { max: Infinity, label: '$100K+', strategy: 'MULTI-CHANNEL', description: 'Full multi-channel with TikTok Shop + FB + Amazon.' },
];

export default function BudgetAllocatorStrategic({ totalBudget, revenue, onAllocationChange }: BudgetAllocatorProps) {
    const [categories, setCategories] = useState<BudgetCategory[]>([
        { id: 'organic', name: 'Organic Content', icon: <FiVideo />, color: 'purple', percentage: 60, minRecommended: 20, description: 'TikTok, Instagram, YouTube content creation' },
        { id: 'paid', name: 'Paid Ads', icon: <FiTarget />, color: 'blue', percentage: 25, minRecommended: 0, description: 'Facebook, TikTok, Google advertising' },
        { id: 'email', name: 'Email Marketing', icon: <FiMail />, color: 'green', percentage: 10, minRecommended: 5, description: 'Email sequences, abandoned cart recovery' },
        { id: 'influencer', name: 'Influencer/UGC', icon: <FiTrendingUp />, color: 'pink', percentage: 5, minRecommended: 0, description: 'Creator partnerships and UGC' },
    ]);

    // Get current revenue stage
    const currentStage = REVENUE_STAGES.find(stage => revenue < stage.max) || REVENUE_STAGES[REVENUE_STAGES.length - 1];

    // Auto-recommend allocations based on revenue
    useEffect(() => {
        const recommendedAllocations = getRecommendedAllocations(revenue);
        setCategories(prev => prev.map(cat => ({
            ...cat,
            percentage: recommendedAllocations[cat.id] || cat.percentage
        })));
    }, [revenue]);

    const getRecommendedAllocations = (rev: number): Record<string, number> => {
        if (rev < 10000) {
            return { organic: 80, paid: 0, email: 15, influencer: 5 };
        } else if (rev < 50000) {
            return { organic: 50, paid: 30, email: 15, influencer: 5 };
        } else if (rev < 100000) {
            return { organic: 30, paid: 50, email: 15, influencer: 5 };
        } else {
            return { organic: 25, paid: 55, email: 15, influencer: 5 };
        }
    };

    const handleSliderChange = (id: string, newValue: number) => {
        const otherCategories = categories.filter(c => c.id !== id);
        const currentOtherTotal = otherCategories.reduce((sum, c) => sum + c.percentage, 0);
        const maxAllowed = 100 - otherCategories.reduce((sum, c) => sum + c.minRecommended, 0);

        const clampedValue = Math.min(Math.max(newValue, 0), maxAllowed);
        const remaining = 100 - clampedValue;
        const scaleFactor = currentOtherTotal > 0 ? remaining / currentOtherTotal : 1;

        setCategories(prev => prev.map(cat => {
            if (cat.id === id) {
                return { ...cat, percentage: clampedValue };
            }
            return { ...cat, percentage: Math.round(cat.percentage * scaleFactor) };
        }));

        if (onAllocationChange) {
            const allocations: Record<string, number> = {};
            categories.forEach(cat => {
                allocations[cat.id] = cat.id === id ? clampedValue : Math.round(cat.percentage * scaleFactor);
            });
            onAllocationChange(allocations);
        }
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; bar: string; text: string }> = {
            purple: { bg: 'bg-purple-100', bar: 'bg-gradient-to-r from-purple-500 to-purple-600', text: 'text-purple-600' },
            blue: { bg: 'bg-blue-100', bar: 'bg-gradient-to-r from-blue-500 to-blue-600', text: 'text-blue-600' },
            green: { bg: 'bg-green-100', bar: 'bg-gradient-to-r from-green-500 to-green-600', text: 'text-green-600' },
            pink: { bg: 'bg-pink-100', bar: 'bg-gradient-to-r from-pink-500 to-pink-600', text: 'text-pink-600' },
        };
        return colors[color] || colors.purple;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <FiDollarSign className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Budget Allocator</h2>
                            <p className="text-sm text-gray-500">Strategic marketing budget distribution</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Monthly Budget</div>
                    </div>
                </div>
            </div>

            {/* Revenue Stage Indicator */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {currentStage.label}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{currentStage.strategy}</span>
                    <span className="text-sm text-gray-500">• {currentStage.description}</span>
                </div>

                {/* Revenue Progress */}
                <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        {REVENUE_STAGES.slice(0, -1).map((stage, i) => (
                            <div
                                key={i}
                                className={`h-full inline-block ${revenue >= stage.max ? 'bg-green-500' :
                                        revenue >= (i > 0 ? REVENUE_STAGES[i - 1].max : 0) ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                style={{ width: '33.33%' }}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">${revenue.toLocaleString()}</span>
                </div>
            </div>

            {/* Budget Sliders */}
            <div className="p-6 space-y-6">
                {categories.map(category => {
                    const colors = getColorClasses(category.color);
                    const amount = Math.round((category.percentage / 100) * totalBudget);

                    return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                                        <span className={colors.text}>{category.icon}</span>
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{category.name}</div>
                                        <div className="text-xs text-gray-500">{category.description}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-bold ${colors.text}`}>{category.percentage}%</div>
                                    <div className="text-sm text-gray-500">${amount.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${colors.bar} rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${category.percentage}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={category.percentage}
                                    onChange={(e) => handleSliderChange(category.id, parseInt(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Insights */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-start gap-3">
                    <FiInfo className="text-blue-500 mt-0.5" />
                    <div className="text-sm text-gray-600">
                        <strong className="text-gray-900">Michael Bernstein's Rule:</strong> Start 100% organic until $10K profit.
                        Then test paid ads with 30% of budget. Scale to 60% paid only after consistent ROAS above 2x.
                    </div>
                </div>
            </div>
        </div>
    );
}
