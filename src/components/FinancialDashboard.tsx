'use client';

import { useState, useEffect } from 'react';
import {
    FiDollarSign, FiTrendingUp, FiTrendingDown, FiPercent,
    FiShoppingCart, FiPackage, FiCreditCard, FiRefreshCw,
    FiArrowUp, FiArrowDown, FiInfo
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getAuthHeaders } from '@/lib/auth';

interface FinancialMetrics {
    // Revenue
    grossRevenue: number;
    refunds: number;
    netRevenue: number;

    // Cost of Goods Sold
    productCost: number;
    shippingCostToCustomer: number;
    shippingCostFromSupplier: number;

    // Gross Profit
    grossProfit: number;
    grossMargin: number;

    // Operating Expenses
    adSpend: number;
    platformFees: number; // Shopify monthly
    paymentProcessingFees: number; // Stripe 2.9% + $0.30
    appSubscriptions: number;
    otherExpenses: number;

    // Net Profit
    netProfit: number;
    netMargin: number;

    // Key Performance Indicators
    totalOrders: number;
    averageOrderValue: number;
    customerAcquisitionCost: number;
    lifetimeValue: number;
    roas: number;
    breakEvenRoas: number;
}

interface FinancialDashboardProps {
    revenue?: number;
    expenses?: number;
    orders?: number;
    adSpend?: number;
}

export default function FinancialDashboard({
    revenue = 0,
    expenses = 0,
    orders = 0,
    adSpend = 0
}: FinancialDashboardProps) {
    const [metrics, setMetrics] = useState<FinancialMetrics>({
        grossRevenue: 0,
        refunds: 0,
        netRevenue: 0,
        productCost: 0,
        shippingCostToCustomer: 0,
        shippingCostFromSupplier: 0,
        grossProfit: 0,
        grossMargin: 0,
        adSpend: 0,
        platformFees: 29, // Shopify Basic
        paymentProcessingFees: 0,
        appSubscriptions: 0,
        otherExpenses: 0,
        netProfit: 0,
        netMargin: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        customerAcquisitionCost: 0,
        lifetimeValue: 0,
        roas: 0,
        breakEvenRoas: 0
    });

    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');
    const [showTooltip, setShowTooltip] = useState<string | null>(null);

    // Calculate metrics based on simulation data
    useEffect(() => {
        calculateMetrics();
    }, [revenue, expenses, orders, adSpend]);

    const calculateMetrics = () => {
        // Assume typical dropshipping breakdown
        const avgOrderValue = orders > 0 ? revenue / orders : 50;
        const refundRate = 0.05; // 5% refund rate
        const productCostRate = 0.35; // 35% of revenue goes to product cost
        const shippingCostRate = 0.10; // 10% shipping to customer
        const supplierShippingRate = 0.08; // 8% shipping from supplier

        // Revenue breakdown
        const grossRevenue = revenue;
        const refunds = grossRevenue * refundRate;
        const netRevenue = grossRevenue - refunds;

        // COGS
        const productCost = netRevenue * productCostRate;
        const shippingCostToCustomer = netRevenue * shippingCostRate;
        const shippingCostFromSupplier = netRevenue * supplierShippingRate;
        const totalCogs = productCost + shippingCostToCustomer + shippingCostFromSupplier;

        // Gross Profit
        const grossProfit = netRevenue - totalCogs;
        const grossMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;

        // Operating Expenses
        const platformFees = 29; // Shopify Basic
        const paymentProcessingFees = (netRevenue * 0.029) + (orders * 0.30); // Stripe fees
        const appSubscriptions = Math.min(orders * 0.5, 50); // Estimated app costs
        const otherExpenses = Math.max(0, expenses - productCost - shippingCostToCustomer);

        const totalOperatingExpenses = adSpend + platformFees + paymentProcessingFees + appSubscriptions + otherExpenses;

        // Net Profit
        const netProfit = grossProfit - totalOperatingExpenses;
        const netMargin = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

        // KPIs
        const customerAcquisitionCost = orders > 0 && adSpend > 0 ? adSpend / orders : 0;
        const lifetimeValue = avgOrderValue * 1.3; // Assume 30% repeat customers
        const roas = adSpend > 0 ? netRevenue / adSpend : 0;

        // Break-even ROAS calculation
        // Break-even ROAS = 1 / (1 - (COGS% + Other Costs%))
        const cogsPercent = netRevenue > 0 ? totalCogs / netRevenue : 0.5;
        const otherCostsPercent = netRevenue > 0 ? (platformFees + paymentProcessingFees + appSubscriptions) / netRevenue : 0.1;
        const breakEvenRoas = 1 / Math.max(0.01, 1 - cogsPercent - otherCostsPercent);

        setMetrics({
            grossRevenue,
            refunds,
            netRevenue,
            productCost,
            shippingCostToCustomer,
            shippingCostFromSupplier,
            grossProfit,
            grossMargin,
            adSpend,
            platformFees,
            paymentProcessingFees,
            appSubscriptions,
            otherExpenses,
            netProfit,
            netMargin,
            totalOrders: orders,
            averageOrderValue: avgOrderValue,
            customerAcquisitionCost,
            lifetimeValue,
            roas,
            breakEvenRoas
        });
    };

    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value);
        if (absValue >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (absValue >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toFixed(2)}`;
    };

    const formatPercent = (value: number) => `${value.toFixed(1)}%`;

    const tooltips: Record<string, string> = {
        grossRevenue: 'Total revenue before any deductions',
        refunds: 'Money returned to customers (estimated 5%)',
        productCost: 'Cost to purchase products from suppliers (~35%)',
        shippingToCustomer: 'Shipping cost you charge customers (~10%)',
        shippingFromSupplier: 'Shipping cost from supplier to customer (~8%)',
        platformFees: 'Monthly Shopify subscription ($29/mo Basic)',
        paymentFees: 'Stripe/PayPal fees (2.9% + $0.30 per transaction)',
        cac: 'Cost to acquire one customer (Ad Spend ÷ Orders)',
        ltv: 'Estimated lifetime revenue per customer',
        roas: 'Return on Ad Spend (Revenue ÷ Ad Spend)',
        breakEvenRoas: 'Minimum ROAS needed to not lose money'
    };

    return (
        <div className="bg-surface-primary rounded-2xl border border-border-primary shadow-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <FiDollarSign className="text-green-500" />
                            Financial Dashboard
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Profit & Loss Statement
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {(['day', 'week', 'month'] as const).map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${period === p
                                        ? 'bg-accent-primary text-white'
                                        : 'bg-background text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick KPIs */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className={`text-lg font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(metrics.netProfit)}
                        </div>
                        <div className="text-xs text-text-secondary">Net Profit</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className={`text-lg font-bold ${metrics.netMargin >= 20 ? 'text-green-600' : metrics.netMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {formatPercent(metrics.netMargin)}
                        </div>
                        <div className="text-xs text-text-secondary">Net Margin</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center relative">
                        <div className={`text-lg font-bold ${metrics.roas >= metrics.breakEvenRoas ? 'text-green-600' : 'text-red-600'}`}>
                            {metrics.roas.toFixed(2)}x
                        </div>
                        <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                            ROAS
                            <button
                                onMouseEnter={() => setShowTooltip('roas')}
                                onMouseLeave={() => setShowTooltip(null)}
                                className="text-text-secondary hover:text-accent-primary"
                            >
                                <FiInfo className="w-3 h-3" />
                            </button>
                        </div>
                        {showTooltip === 'roas' && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                {tooltips.roas}
                            </div>
                        )}
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center relative">
                        <div className="text-lg font-bold text-accent-primary">
                            {formatCurrency(metrics.customerAcquisitionCost)}
                        </div>
                        <div className="text-xs text-text-secondary flex items-center justify-center gap-1">
                            CAC
                            <button
                                onMouseEnter={() => setShowTooltip('cac')}
                                onMouseLeave={() => setShowTooltip(null)}
                                className="text-text-secondary hover:text-accent-primary"
                            >
                                <FiInfo className="w-3 h-3" />
                            </button>
                        </div>
                        {showTooltip === 'cac' && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                {tooltips.cac}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* P&L Statement */}
            <div className="p-6">
                <div className="bg-background rounded-xl border border-border-primary overflow-hidden">
                    {/* Revenue Section */}
                    <div className="p-4 border-b border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <FiTrendingUp className="text-green-500" />
                            Revenue
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Gross Revenue</span>
                                <span className="font-medium text-text-primary">{formatCurrency(metrics.grossRevenue)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Less: Refunds & Returns</span>
                                <span>-{formatCurrency(metrics.refunds)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border-primary font-semibold">
                                <span className="text-text-primary">Net Revenue</span>
                                <span className="text-green-600">{formatCurrency(metrics.netRevenue)}</span>
                            </div>
                        </div>
                    </div>

                    {/* COGS Section */}
                    <div className="p-4 border-b border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <FiPackage className="text-orange-500" />
                            Cost of Goods Sold (COGS)
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Product Cost (from supplier)</span>
                                <span className="text-red-600">-{formatCurrency(metrics.productCost)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Shipping to Customer</span>
                                <span className="text-red-600">-{formatCurrency(metrics.shippingCostToCustomer)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Supplier → Customer Shipping</span>
                                <span className="text-red-600">-{formatCurrency(metrics.shippingCostFromSupplier)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border-primary font-semibold">
                                <span className="text-text-primary">Gross Profit</span>
                                <span className={metrics.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {formatCurrency(metrics.grossProfit)} ({formatPercent(metrics.grossMargin)} margin)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Operating Expenses Section */}
                    <div className="p-4 border-b border-border-primary">
                        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <FiCreditCard className="text-purple-500" />
                            Operating Expenses
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Advertising Spend</span>
                                <span className="text-red-600">-{formatCurrency(metrics.adSpend)}</span>
                            </div>
                            <div className="flex justify-between relative">
                                <span className="text-text-secondary flex items-center gap-1">
                                    Platform Fees (Shopify)
                                    <button
                                        onMouseEnter={() => setShowTooltip('platformFees')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="text-text-secondary hover:text-accent-primary"
                                    >
                                        <FiInfo className="w-3 h-3" />
                                    </button>
                                </span>
                                <span className="text-red-600">-{formatCurrency(metrics.platformFees)}</span>
                                {showTooltip === 'platformFees' && (
                                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                        {tooltips.platformFees}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between relative">
                                <span className="text-text-secondary flex items-center gap-1">
                                    Payment Processing
                                    <button
                                        onMouseEnter={() => setShowTooltip('paymentFees')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="text-text-secondary hover:text-accent-primary"
                                    >
                                        <FiInfo className="w-3 h-3" />
                                    </button>
                                </span>
                                <span className="text-red-600">-{formatCurrency(metrics.paymentProcessingFees)}</span>
                                {showTooltip === 'paymentFees' && (
                                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                        {tooltips.paymentFees}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">App Subscriptions</span>
                                <span className="text-red-600">-{formatCurrency(metrics.appSubscriptions)}</span>
                            </div>
                            {metrics.otherExpenses > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Other Expenses</span>
                                    <span className="text-red-600">-{formatCurrency(metrics.otherExpenses)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Net Profit Section */}
                    <div className="p-4 bg-gradient-to-r from-accent-primary/5 to-transparent">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-text-primary text-lg">NET PROFIT</h3>
                                <p className="text-xs text-text-secondary">What you actually keep</p>
                            </div>
                            <div className="text-right">
                                <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(metrics.netProfit)}
                                </div>
                                <div className={`text-sm ${metrics.netMargin >= 20 ? 'text-green-600' : metrics.netMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {formatPercent(metrics.netMargin)} Net Margin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Insights */}
                <div className="mt-6 p-4 rounded-xl bg-accent-primary/5 border border-accent-primary/20">
                    <h4 className="font-semibold text-accent-primary mb-3">📊 Performance Insights</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Average Order Value</span>
                                <span className="font-medium">{formatCurrency(metrics.averageOrderValue)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Total Orders</span>
                                <span className="font-medium">{metrics.totalOrders}</span>
                            </div>
                            <div className="flex justify-between relative">
                                <span className="text-text-secondary flex items-center gap-1">
                                    Break-even ROAS
                                    <button
                                        onMouseEnter={() => setShowTooltip('breakEvenRoas')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="text-text-secondary hover:text-accent-primary"
                                    >
                                        <FiInfo className="w-3 h-3" />
                                    </button>
                                </span>
                                <span className="font-medium">{metrics.breakEvenRoas.toFixed(2)}x</span>
                                {showTooltip === 'breakEvenRoas' && (
                                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                        {tooltips.breakEvenRoas}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between relative">
                                <span className="text-text-secondary flex items-center gap-1">
                                    Customer LTV
                                    <button
                                        onMouseEnter={() => setShowTooltip('ltv')}
                                        onMouseLeave={() => setShowTooltip(null)}
                                        className="text-text-secondary hover:text-accent-primary"
                                    >
                                        <FiInfo className="w-3 h-3" />
                                    </button>
                                </span>
                                <span className="font-medium">{formatCurrency(metrics.lifetimeValue)}</span>
                                {showTooltip === 'ltv' && (
                                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                        {tooltips.ltv}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">LTV:CAC Ratio</span>
                                <span className={`font-medium ${metrics.customerAcquisitionCost > 0 && (metrics.lifetimeValue / metrics.customerAcquisitionCost) >= 3
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                    }`}>
                                    {metrics.customerAcquisitionCost > 0
                                        ? `${(metrics.lifetimeValue / metrics.customerAcquisitionCost).toFixed(1)}:1`
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Profit per Order</span>
                                <span className={`font-medium ${metrics.totalOrders > 0 && (metrics.netProfit / metrics.totalOrders) >= 10
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                    }`}>
                                    {metrics.totalOrders > 0
                                        ? formatCurrency(metrics.netProfit / metrics.totalOrders)
                                        : 'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-4 pt-4 border-t border-accent-primary/20">
                        <h5 className="text-sm font-medium text-text-primary mb-2">💡 Recommendations</h5>
                        <ul className="text-xs text-text-secondary space-y-1">
                            {metrics.netMargin < 15 && (
                                <li>• Your net margin is low. Consider negotiating better supplier prices or increasing product prices.</li>
                            )}
                            {metrics.roas < metrics.breakEvenRoas && metrics.adSpend > 0 && (
                                <li>• Your ROAS ({metrics.roas.toFixed(2)}x) is below break-even ({metrics.breakEvenRoas.toFixed(2)}x). Pause underperforming ads.</li>
                            )}
                            {metrics.customerAcquisitionCost > metrics.lifetimeValue * 0.3 && metrics.customerAcquisitionCost > 0 && (
                                <li>• CAC is too high ({formatCurrency(metrics.customerAcquisitionCost)}). Target should be under {formatCurrency(metrics.lifetimeValue * 0.3)}.</li>
                            )}
                            {metrics.netMargin >= 25 && (
                                <li>• Great margins! Consider scaling your ad spend to acquire more customers.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
