'use client';

import { useState, useEffect } from 'react';
import {
    FiUsers, FiShoppingCart, FiCreditCard, FiCheckCircle,
    FiTrendingUp, FiTrendingDown, FiArrowRight, FiInfo
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface FunnelMetrics {
    visitors: number;
    productPageViews: number;
    addToCart: number;
    initiatedCheckout: number;
    completedPurchase: number;

    // Rates
    viewRate: number; // % visitors who view product
    addToCartRate: number; // % viewers who add to cart
    checkoutRate: number; // % ATC who initiate checkout
    purchaseRate: number; // % checkout who complete purchase
    overallConversionRate: number;

    // Sources
    organicTraffic: number;
    paidTraffic: number;
    directTraffic: number;

    // Revenue
    revenue: number;
    averageOrderValue: number;
}

interface SalesFunnelProps {
    day?: number;
    visitors?: number;
    orders?: number;
    revenue?: number;
    organicTraffic?: number;
    paidTraffic?: number;
}

export default function SalesFunnel({
    day = 0,
    visitors = 0,
    orders = 0,
    revenue = 0,
    organicTraffic = 0,
    paidTraffic = 0
}: SalesFunnelProps) {
    const [metrics, setMetrics] = useState<FunnelMetrics>({
        visitors: 0,
        productPageViews: 0,
        addToCart: 0,
        initiatedCheckout: 0,
        completedPurchase: 0,
        viewRate: 0,
        addToCartRate: 0,
        checkoutRate: 0,
        purchaseRate: 0,
        overallConversionRate: 0,
        organicTraffic: 0,
        paidTraffic: 0,
        directTraffic: 0,
        revenue: 0,
        averageOrderValue: 0
    });

    const [showTooltip, setShowTooltip] = useState<string | null>(null);

    // Calculate funnel metrics
    useEffect(() => {
        calculateFunnel();
    }, [visitors, orders, revenue, organicTraffic, paidTraffic]);

    const calculateFunnel = () => {
        // If no visitors, use defaults
        if (visitors === 0) {
            setMetrics({
                visitors: 0,
                productPageViews: 0,
                addToCart: 0,
                initiatedCheckout: 0,
                completedPurchase: 0,
                viewRate: 0,
                addToCartRate: 0,
                checkoutRate: 0,
                purchaseRate: 0,
                overallConversionRate: 0,
                organicTraffic: 0,
                paidTraffic: 0,
                directTraffic: 0,
                revenue: 0,
                averageOrderValue: 0
            });
            return;
        }

        // Calculate funnel stages (using industry averages)
        // These rates vary based on traffic source quality
        const baseViewRate = 0.45; // 45% of visitors view a product
        const baseAtcRate = 0.08; // 8% of viewers add to cart
        const baseCheckoutRate = 0.55; // 55% of ATC initiate checkout
        const basePurchaseRate = 0.65; // 65% of checkout complete

        // Organic traffic typically converts better
        const organicMultiplier = 1.3;
        const paidMultiplier = 0.9;

        const directTraffic = Math.max(0, visitors - organicTraffic - paidTraffic);
        const weightedVisitors = visitors;

        // Calculate each stage
        const productPageViews = Math.floor(visitors * baseViewRate);
        const addToCart = Math.floor(productPageViews * baseAtcRate);
        const initiatedCheckout = Math.floor(addToCart * baseCheckoutRate);
        const completedPurchase = orders > 0 ? orders : Math.floor(initiatedCheckout * basePurchaseRate);

        // Calculate rates
        const viewRate = visitors > 0 ? (productPageViews / visitors) * 100 : 0;
        const addToCartRate = productPageViews > 0 ? (addToCart / productPageViews) * 100 : 0;
        const checkoutRate = addToCart > 0 ? (initiatedCheckout / addToCart) * 100 : 0;
        const purchaseRate = initiatedCheckout > 0 ? (completedPurchase / initiatedCheckout) * 100 : 0;
        const overallConversionRate = visitors > 0 ? (completedPurchase / visitors) * 100 : 0;

        const averageOrderValue = completedPurchase > 0 ? revenue / completedPurchase : 0;

        setMetrics({
            visitors,
            productPageViews,
            addToCart,
            initiatedCheckout,
            completedPurchase,
            viewRate,
            addToCartRate,
            checkoutRate,
            purchaseRate,
            overallConversionRate,
            organicTraffic,
            paidTraffic,
            directTraffic,
            revenue,
            averageOrderValue
        });
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    const formatPercent = (value: number) => `${value.toFixed(1)}%`;
    const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

    const funnelStages = [
        {
            name: 'Visitors',
            value: metrics.visitors,
            icon: FiUsers,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
            tooltip: 'Total people who visited your store'
        },
        {
            name: 'Product Views',
            value: metrics.productPageViews,
            rate: metrics.viewRate,
            icon: FiTrendingUp,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            tooltip: 'Visitors who viewed a product page'
        },
        {
            name: 'Add to Cart',
            value: metrics.addToCart,
            rate: metrics.addToCartRate,
            icon: FiShoppingCart,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
            tooltip: 'Viewers who added items to cart'
        },
        {
            name: 'Checkout',
            value: metrics.initiatedCheckout,
            rate: metrics.checkoutRate,
            icon: FiCreditCard,
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
            tooltip: 'Users who started checkout'
        },
        {
            name: 'Purchased',
            value: metrics.completedPurchase,
            rate: metrics.purchaseRate,
            icon: FiCheckCircle,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            tooltip: 'Completed purchases'
        },
    ];

    return (
        <div className="bg-surface-primary rounded-2xl border border-border-primary shadow-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <FiTrendingUp className="text-accent-primary" />
                            Sales Funnel
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Watch visitors convert to customers
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                            {formatPercent(metrics.overallConversionRate)}
                        </div>
                        <div className="text-xs text-text-secondary">Overall Conversion</div>
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-purple-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-purple-600">{formatNumber(metrics.organicTraffic)}</div>
                        <div className="text-xs text-text-secondary">Organic</div>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">{formatNumber(metrics.paidTraffic)}</div>
                        <div className="text-xs text-text-secondary">Paid Ads</div>
                    </div>
                    <div className="bg-gray-500/10 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-gray-600">{formatNumber(metrics.directTraffic)}</div>
                        <div className="text-xs text-text-secondary">Direct</div>
                    </div>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="p-6">
                <div className="space-y-3">
                    {funnelStages.map((stage, index) => {
                        const widthPercent = metrics.visitors > 0
                            ? Math.max(20, (stage.value / metrics.visitors) * 100)
                            : 100 - (index * 15);

                        return (
                            <motion.div
                                key={stage.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div
                                    className={`${stage.bgColor} rounded-lg p-4 transition-all relative overflow-hidden`}
                                    style={{ width: `${widthPercent}%`, marginLeft: `${(100 - widthPercent) / 2}%` }}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <stage.icon className={`w-5 h-5 ${stage.color}`} />
                                            <span className="font-medium text-text-primary">{stage.name}</span>
                                            <button
                                                onMouseEnter={() => setShowTooltip(stage.name)}
                                                onMouseLeave={() => setShowTooltip(null)}
                                                className="text-text-secondary hover:text-accent-primary"
                                            >
                                                <FiInfo className="w-3 h-3" />
                                            </button>
                                            {showTooltip === stage.name && (
                                                <div className="absolute left-24 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-20">
                                                    {stage.tooltip}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-text-primary">{formatNumber(stage.value)}</span>
                                            {stage.rate !== undefined && (
                                                <span className={`ml-2 text-sm ${stage.rate > 50 ? 'text-green-600' : stage.rate > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    ({formatPercent(stage.rate)})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {index < funnelStages.length - 1 && (
                                    <div className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 z-10">
                                        <FiArrowRight className="w-4 h-4 text-text-secondary transform rotate-90" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Revenue Summary */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-text-primary">Revenue Generated</h4>
                            <p className="text-xs text-text-secondary">From {metrics.completedPurchase} orders</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.revenue)}</div>
                            <div className="text-sm text-text-secondary">
                                AOV: {formatCurrency(metrics.averageOrderValue)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drop-off Analysis */}
                {metrics.visitors > 0 && (
                    <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                        <h4 className="font-semibold text-red-600 mb-3">🔍 Drop-off Analysis</h4>
                        <div className="space-y-2 text-sm">
                            {metrics.viewRate < 50 && (
                                <div className="flex items-start gap-2">
                                    <FiTrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">
                                        <strong>{formatPercent(100 - metrics.viewRate)}</strong> of visitors leave without viewing products.
                                        Improve homepage design and product visibility.
                                    </span>
                                </div>
                            )}
                            {metrics.addToCartRate < 5 && metrics.productPageViews > 0 && (
                                <div className="flex items-start gap-2">
                                    <FiTrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">
                                        Low add-to-cart rate (<strong>{formatPercent(metrics.addToCartRate)}</strong>).
                                        Review product descriptions, images, and pricing.
                                    </span>
                                </div>
                            )}
                            {metrics.purchaseRate < 50 && metrics.initiatedCheckout > 0 && (
                                <div className="flex items-start gap-2">
                                    <FiTrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-text-secondary">
                                        <strong>{formatPercent(100 - metrics.purchaseRate)}</strong> abandon at checkout.
                                        Consider: free shipping, trust badges, simpler checkout.
                                    </span>
                                </div>
                            )}
                            {metrics.overallConversionRate >= 3 && (
                                <div className="flex items-start gap-2 text-green-600">
                                    <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>
                                        Great job! <strong>{formatPercent(metrics.overallConversionRate)}</strong> conversion rate
                                        is above industry average (2-3%).
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
