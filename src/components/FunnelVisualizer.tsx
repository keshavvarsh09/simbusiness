'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiEye, FiShoppingCart, FiCreditCard, FiPackage, FiThumbsUp,
    FiTrendingDown, FiArrowDown, FiInfo, FiRefreshCw
} from 'react-icons/fi';

interface FunnelStage {
    id: string;
    name: string;
    icon: React.ReactNode;
    visitors: number;
    color: string;
    description: string;
}

interface FunnelVisualizerProps {
    visitors?: number;
    productViews?: number;
    addToCarts?: number;
    checkouts?: number;
    purchases?: number;
}

export default function FunnelVisualizer({
    visitors = 10000,
    productViews = 4500,
    addToCarts = 900,
    checkouts = 450,
    purchases = 180,
}: FunnelVisualizerProps) {
    const [showInsights, setShowInsights] = useState(true);

    const stages: FunnelStage[] = [
        { id: 'visitors', name: 'Visitors', icon: <FiEye />, visitors, color: 'blue', description: 'Total site traffic' },
        { id: 'product_views', name: 'Product Views', icon: <FiShoppingCart />, visitors: productViews, color: 'purple', description: 'Viewed a product page' },
        { id: 'add_to_cart', name: 'Add to Cart', icon: <FiShoppingCart />, visitors: addToCarts, color: 'pink', description: 'Added item to cart' },
        { id: 'checkout', name: 'Checkout', icon: <FiCreditCard />, visitors: checkouts, color: 'orange', description: 'Started checkout' },
        { id: 'purchase', name: 'Purchase', icon: <FiPackage />, visitors: purchases, color: 'green', description: 'Completed purchase' },
    ];

    const getConversionRate = (current: number, previous: number) => {
        return previous > 0 ? ((current / previous) * 100).toFixed(1) : '0';
    };

    const getDropOffRate = (current: number, previous: number) => {
        return previous > 0 ? (((previous - current) / previous) * 100).toFixed(1) : '0';
    };

    const getInsights = () => {
        const insights: { type: 'warning' | 'success' | 'info'; message: string }[] = [];

        const viewRate = (productViews / visitors) * 100;
        const cartRate = (addToCarts / productViews) * 100;
        const checkoutRate = (checkouts / addToCarts) * 100;
        const purchaseRate = (purchases / checkouts) * 100;

        if (viewRate < 30) {
            insights.push({ type: 'warning', message: `Low product view rate (${viewRate.toFixed(1)}%). Improve homepage design and navigation.` });
        }
        if (cartRate < 10) {
            insights.push({ type: 'warning', message: `Low add-to-cart rate (${cartRate.toFixed(1)}%). Improve product pages, add urgency, better images.` });
        }
        if (checkoutRate < 40) {
            insights.push({ type: 'warning', message: `High cart abandonment (${(100 - checkoutRate).toFixed(1)}%). Add trust badges, simplify checkout.` });
        }
        if (purchaseRate < 30) {
            insights.push({ type: 'warning', message: `Checkout drop-off at ${(100 - purchaseRate).toFixed(1)}%. Offer more payment options, reduce shipping costs.` });
        }
        if ((purchases / visitors) * 100 > 3) {
            insights.push({ type: 'success', message: `Excellent overall conversion rate of ${((purchases / visitors) * 100).toFixed(2)}%!` });
        }

        return insights;
    };

    const insights = getInsights();

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <FiTrendingDown className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Conversion Funnel</h2>
                            <p className="text-sm text-gray-500">Track drop-off at each stage</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{((purchases / visitors) * 100).toFixed(2)}%</div>
                            <div className="text-xs text-gray-500">Overall Conversion</div>
                        </div>
                        <button
                            onClick={() => setShowInsights(!showInsights)}
                            className={`p-2 rounded-lg transition-colors ${showInsights ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}
                        >
                            <FiInfo />
                        </button>
                    </div>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="p-6">
                <div className="space-y-2">
                    {stages.map((stage, index) => {
                        const prevStage = index > 0 ? stages[index - 1] : null;
                        const widthPercent = (stage.visitors / visitors) * 100;
                        const conversionRate = prevStage ? getConversionRate(stage.visitors, prevStage.visitors) : '100';
                        const dropOffRate = prevStage ? getDropOffRate(stage.visitors, prevStage.visitors) : '0';

                        return (
                            <div key={stage.id}>
                                {/* Drop-off indicator between stages */}
                                {prevStage && (
                                    <div className="flex items-center justify-center py-1">
                                        <div className="flex items-center gap-2 text-sm">
                                            <FiArrowDown className="text-gray-400" />
                                            <span className="text-red-500 font-medium">-{dropOffRate}% drop-off</span>
                                            <span className="text-gray-400">({(prevStage.visitors - stage.visitors).toLocaleString()} lost)</span>
                                        </div>
                                    </div>
                                )}

                                {/* Stage bar */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                >
                                    <div
                                        className={`bg-${stage.color}-100 rounded-lg overflow-hidden`}
                                        style={{ width: '100%' }}
                                    >
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${widthPercent}%` }}
                                            transition={{ duration: 0.8, delay: index * 0.1 }}
                                            className={`bg-gradient-to-r ${stage.color === 'blue' ? 'from-blue-400 to-blue-500' :
                                                    stage.color === 'purple' ? 'from-purple-400 to-purple-500' :
                                                        stage.color === 'pink' ? 'from-pink-400 to-pink-500' :
                                                            stage.color === 'orange' ? 'from-orange-400 to-orange-500' :
                                                                'from-green-400 to-green-500'
                                                } p-4 rounded-lg flex items-center justify-between min-w-[200px]`}
                                        >
                                            <div className="flex items-center gap-3 text-white">
                                                <span className="text-xl">{stage.icon}</span>
                                                <div>
                                                    <div className="font-semibold">{stage.name}</div>
                                                    <div className="text-xs opacity-80">{stage.description}</div>
                                                </div>
                                            </div>
                                            <div className="text-right text-white">
                                                <div className="text-xl font-bold">{stage.visitors.toLocaleString()}</div>
                                                <div className="text-xs opacity-80">{conversionRate}% of previous</div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Insights */}
            {showInsights && insights.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FiThumbsUp className="text-indigo-500" />
                        Optimization Insights
                    </h3>
                    <div className="space-y-2">
                        {insights.map((insight, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg text-sm ${insight.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                                        insight.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                                            'bg-blue-50 text-blue-800 border border-blue-200'
                                    }`}
                            >
                                {insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : 'ℹ️'} {insight.message}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Benchmarks */}
            <div className="p-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Industry Benchmarks</h3>
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">45%</div>
                        <div className="text-xs text-gray-500">View Rate</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">10-15%</div>
                        <div className="text-xs text-gray-500">Cart Rate</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">50%</div>
                        <div className="text-xs text-gray-500">Checkout Rate</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="font-medium text-gray-900">1-3%</div>
                        <div className="text-xs text-gray-500">Overall Conv.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
