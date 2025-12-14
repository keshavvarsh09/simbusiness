'use client';

import { useState, useEffect } from 'react';
import { MarketData } from '@/types';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiInfo, FiBarChart2, FiStar, FiShoppingBag, FiClock, FiGlobe, FiActivity } from 'react-icons/fi';
import { fetchCategories } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

// Current real-world market data
const CURRENT_YEAR = new Date().getFullYear();

export default function MarketAnalysis() {
  const [marketData, setMarketData] = useState<MarketData>({
    trends: [
      { category: 'Electronics', growth: 12.5, demand: 'High' },
      { category: 'Fashion', growth: 8.3, demand: 'Medium' },
      { category: 'Home & Garden', growth: 15.7, demand: 'High' },
      { category: 'Beauty', growth: 9.2, demand: 'Medium' },
      { category: 'Sports', growth: 7.6, demand: 'Medium' },
      { category: 'Toys', growth: 5.4, demand: 'Low' },
    ],
    recommendations: [
      { name: 'Wireless Earbuds', category: 'Electronics', price: 35.99, margin: 45, popularity: 92 },
      { name: 'Portable Phone Charger', category: 'Electronics', price: 25.99, margin: 60, popularity: 88 },
      { name: 'LED Strip Lights', category: 'Home & Garden', price: 18.99, margin: 70, popularity: 85 },
      { name: 'Yoga Mat', category: 'Sports', price: 29.99, margin: 55, popularity: 82 },
      { name: 'Kitchen Gadgets Set', category: 'Home & Garden', price: 22.99, margin: 65, popularity: 78 },
    ]
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showTip, setShowTip] = useState<string | null>(null);

  useEffect(() => {
    // Fetch available categories for educational purposes
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Educational content - Real world tips
  const marketingTips = [
    "Use social media to create brand recognition before launching products",
    "Monitor competitors' pricing strategies to stay competitive",
    "Focus on products with at least 30% profit margin for sustainability",
    "Evaluate shipping times and costs before committing to suppliers",
    "Test products with small inventory before scaling up",
    "Consider seasonal trends in your product selection",
    "Analyze customer reviews to identify product improvement opportunities"
  ];

  // Real-world business challenges
  const businessScenarios = [
    {
      id: 'supply-chain',
      title: 'Supply Chain Disruption',
      description: 'Your main supplier has experienced a production delay, affecting your most popular product line.',
      options: [
        {
          text: 'Find an alternative supplier immediately',
          outcome: 'Quick resolution but 15% higher costs and potentially different product quality',
          impact: { revenue: -5, reputation: 0, longTerm: -10 }
        },
        {
          text: 'Notify customers and offer discount coupons for the delay',
          outcome: 'Maintains customer trust but reduces immediate profits',
          impact: { revenue: -10, reputation: +5, longTerm: +5 }
        },
        {
          text: 'Temporarily remove products from your store',
          outcome: 'Avoids negative reviews but loses sales opportunities',
          impact: { revenue: -20, reputation: 0, longTerm: 0 }
        }
      ]
    },
    {
      id: 'competitor-pricing',
      title: 'Aggressive Competitor Pricing',
      description: 'A competitor has drastically reduced prices on similar products to what you offer.',
      options: [
        {
          text: 'Match their prices to stay competitive',
          outcome: 'Maintains sales volume but significantly reduces your profit margins',
          impact: { revenue: 0, reputation: 0, longTerm: -5 }
        },
        {
          text: 'Enhance product descriptions and highlight quality differences',
          outcome: 'Slower effect but maintains your brand positioning and margins',
          impact: { revenue: -5, reputation: +10, longTerm: +15 }
        },
        {
          text: 'Bundle products with accessories to provide better value',
          outcome: 'Increases average order value while differentiating from competitors',
          impact: { revenue: +5, reputation: +5, longTerm: +5 }
        }
      ]
    },
    {
      id: 'shipping-costs',
      title: 'Rising Shipping Costs',
      description: 'Global shipping rates have increased by 25%, affecting your delivery costs.',
      options: [
        {
          text: 'Absorb the costs to maintain customer satisfaction',
          outcome: 'Preserves customer experience but reduces your profit',
          impact: { revenue: -15, reputation: +5, longTerm: 0 }
        },
        {
          text: 'Increase product prices to cover the additional shipping costs',
          outcome: 'Maintains profit margins but may reduce conversion rates',
          impact: { revenue: -5, reputation: -5, longTerm: -5 }
        },
        {
          text: 'Introduce a tiered shipping model with free shipping thresholds',
          outcome: 'Increases average order value but complicates your shipping policy',
          impact: { revenue: +10, reputation: 0, longTerm: +5 }
        }
      ]
    }
  ];

  // Market insights based on real-world data
  const marketInsights = [
    {
      title: 'Customer Acquisition',
      value: '$15-25',
      description: 'Average cost to acquire a new customer',
      trend: 'increasing',
      tip: 'Focus on retention strategies to maximize customer lifetime value',
    },
    {
      title: 'Conversion Rate',
      value: '1.5-3%',
      description: 'Average e-commerce conversion rate',
      trend: 'stable',
      tip: 'Improve product images and descriptions to boost conversions',
    },
    {
      title: 'Mobile Traffic',
      value: '67%',
      description: 'Percentage of e-commerce visits from mobile devices',
      trend: 'increasing',
      tip: 'Ensure your store is fully optimized for mobile browsing',
    },
    {
      title: 'Cart Abandonment',
      value: '70%',
      description: 'Average cart abandonment rate',
      trend: 'stable',
      tip: 'Implement abandonment emails and simplified checkout',
    }
  ];

  const handleScenarioSelect = (id: string) => {
    setActiveScenario(id === activeScenario ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-display-2 font-bold text-gray-900 mb-2">Market Intelligence</h1>
          <p className="text-body text-gray-500">Real-time insights and educational resources to grow your business.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 font-medium text-sm transition-all relative ${activeTab === 'overview'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Market Overview
              {activeTab === 'overview' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`pb-4 font-medium text-sm transition-all relative ${activeTab === 'scenarios'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Business Scenarios
              {activeTab === 'scenarios' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`pb-4 font-medium text-sm transition-all relative ${activeTab === 'education'
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Dropshipping Education
              {activeTab === 'education' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Market Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Real-World Market Insights */}
              <div className="mb-8">
                <h2 className="text-title-2 font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FiBarChart2 className="text-blue-500" />
                  </div>
                  {CURRENT_YEAR} E-commerce Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {marketInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -4 }}
                      className="card card-hover relative group"
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-gray-400 hover:text-primary-500 transition-colors"
                          onClick={() => setShowTip(showTip === insight.title ? null : insight.title)}
                        >
                          <FiInfo size={18} />
                        </button>
                      </div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">{insight.title}</h3>
                      <div className="flex items-end gap-2 mb-3">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{insight.value}</span>
                        <div className="mb-1">
                          {insight.trend === 'increasing' && (
                            <FiArrowUp className="text-green-500" />
                          )}
                          {insight.trend === 'decreasing' && (
                            <FiArrowDown className="text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{insight.description}</p>

                      <AnimatePresence>
                        {showTip === insight.title && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-blue-50/50 rounded-xl text-xs border border-blue-100 text-blue-700"
                          >
                            {insight.tip}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Market Trends */}
                <div className="card">
                  <h2 className="text-title-3 font-bold mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <FiTrendingUp className="text-green-500" />
                    </div>
                    Current Market Trends
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider pl-2">Category</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Demand</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {marketData.trends.map((trend, index) => (
                          <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 pl-2 font-medium text-gray-900">{trend.category}</td>
                            <td className="py-3">
                              <span className={`font-medium ${trend.growth > 10 ? 'text-green-600' : trend.growth < 6 ? 'text-red-600' : 'text-orange-600'}`}>
                                {trend.growth > 0 ? '+' : ''}{trend.growth}%
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${trend.demand === 'High'
                                  ? 'bg-green-100 text-green-700'
                                  : trend.demand === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {trend.demand}
                              </span>
                            </td>
                            <td className="py-3 text-right pr-2">
                              <button className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">Explore</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Product Recommendations */}
                <div className="card">
                  <h2 className="text-title-3 font-bold mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                      <FiStar className="text-purple-500" />
                    </div>
                    Top Opportunities
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider pl-2">Product</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
                          <th className="pb-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Popularity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {marketData.recommendations.map((product, index) => (
                          <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 pl-2">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.category}</div>
                            </td>
                            <td className="py-3 text-gray-600">${product.price}</td>
                            <td className="py-3 text-green-600 font-medium">{product.margin}%</td>
                            <td className="py-3">
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${product.popularity}%` }}></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Market Research */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card card-hover group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiActivity className="text-indigo-500 text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Consumer Behavior</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Current consumer trends show a preference for sustainable products with minimal packaging.
                    Online shopping continues to grow with mobile purchases accounting for 67% of all e-commerce transactions.
                  </p>
                  <button className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
                    View Full Report <FiArrowUp className="rotate-45" />
                  </button>
                </div>

                <div className="card card-hover group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiGlobe className="text-orange-500 text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Competitor Analysis</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Major competitors in the dropshipping space are focusing on faster shipping times and exclusive product deals.
                    Price competition remains fierce in electronics and fashion categories.
                  </p>
                  <button className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
                    View Full Report <FiArrowUp className="rotate-45" />
                  </button>
                </div>

                <div className="card card-hover group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FiTrendingUp className="text-teal-500 text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Emerging Markets</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Eco-friendly products, home fitness equipment, and smart home devices show strong growth potential.
                    International markets in Southeast Asia are opening up with fewer shipping restrictions.
                  </p>
                  <button className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
                    View Full Report <FiArrowUp className="rotate-45" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Business Scenarios Tab */}
          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 max-w-2xl">
                <h2 className="text-title-2 font-bold mb-2">Real-World Business Challenges</h2>
                <p className="text-body text-gray-500">
                  Test your decision-making skills with these common dropshipping business scenarios.
                  Each decision impacts your business differently in terms of revenue, reputation, and long-term growth.
                </p>
              </div>

              <div className="space-y-6">
                {businessScenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    className={`card transition-all duration-300 ${activeScenario === scenario.id ? 'ring-2 ring-primary-500/20' : ''}`}
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => handleScenarioSelect(scenario.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${activeScenario === scenario.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                          <FiActivity size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{scenario.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{scenario.description}</p>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${activeScenario === scenario.id ? 'rotate-180 bg-gray-100' : ''
                        }`}>
                        <FiArrowDown className="text-gray-500" />
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeScenario === scenario.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Select your response</h4>
                            <div className="space-y-4">
                              {scenario.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="group border border-gray-200 rounded-xl p-5 hover:bg-gray-50/50 hover:border-primary-200 transition-all cursor-pointer">
                                  <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 group-hover:bg-primary-500 group-hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5 transition-colors">
                                      {optionIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{option.text}</p>
                                      <p className="text-sm text-gray-500 mt-1">{option.outcome}</p>

                                      <div className="mt-4 grid grid-cols-3 gap-4">
                                        <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
                                          <p className={`font-bold ${option.impact.revenue > 0 ? 'text-green-600' : option.impact.revenue < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            {option.impact.revenue > 0 ? '+' : ''}{option.impact.revenue}%
                                          </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reputation</p>
                                          <p className={`font-bold ${option.impact.reputation > 0 ? 'text-green-600' : option.impact.reputation < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            {option.impact.reputation > 0 ? '+' : ''}{option.impact.reputation}%
                                          </p>
                                        </div>
                                        <div className="bg-white rounded-lg p-2 border border-gray-100 text-center">
                                          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Growth</p>
                                          <p className={`font-bold ${option.impact.longTerm > 0 ? 'text-green-600' : option.impact.longTerm < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                            {option.impact.longTerm > 0 ? '+' : ''}{option.impact.longTerm}%
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dropshipping Education Tab */}
          {activeTab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 max-w-2xl">
                <h2 className="text-title-2 font-bold mb-2">Dropshipping Education Center</h2>
                <p className="text-body text-gray-500">
                  Learn the fundamentals of running a successful dropshipping business with these educational resources.
                </p>
              </div>

              {/* Product Selection Guide */}
              <div className="card mb-8">
                <h3 className="text-title-3 font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center">
                    <FiShoppingBag className="text-pink-500" />
                  </div>
                  Product Selection Guide
                </h3>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Available Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-primary-300 hover:text-primary-700 transition-colors cursor-default">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Evaluation Criteria</h4>
                    <ul className="space-y-3">
                      {[
                        { label: 'Profit Margin', desc: 'Target 30%+ profit margins' },
                        { label: 'Shipping Weight', desc: 'Lighter products reduce costs' },
                        { label: 'Competition', desc: 'Balance demand vs saturation' },
                        { label: 'Sellability', desc: 'Solve problems or fulfill desires' },
                        { label: 'Trend Stability', desc: 'Avoid short-term fads' }
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></div>
                          <div>
                            <strong className="text-gray-900 font-medium">{item.label}:</strong>
                            <span className="text-gray-500 text-sm ml-1">{item.desc}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wide">Research Methods</h4>
                    <ol className="space-y-2">
                      {[
                        'Analyze top competitors\' bestsellers',
                        'Use Google Trends to verify demand',
                        'Check social media for trending products',
                        'Review Amazon bestsellers',
                        'Subscribe to supplier newsletters'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-blue-700 text-sm">
                          <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              {/* Supplier Management */}
              <div className="card mb-8">
                <h3 className="text-title-3 font-bold mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FiClock className="text-orange-500" />
                  </div>
                  Supplier Management
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Evaluation Checklist</h4>
                    <ul className="space-y-3">
                      {[
                        'Reliability & Consistency',
                        'Communication Speed (<24h)',
                        'Fast Shipping Options (ePacket)',
                        'Inventory Management',
                        'Quality Control Processes'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <FiCheckCircle className="text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-yellow-50/50 p-6 rounded-2xl border border-yellow-100">
                    <h4 className="text-sm font-bold text-yellow-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                      <FiAlertTriangle /> Common Issues
                    </h4>
                    <ul className="space-y-2 text-yellow-800/80 text-sm">
                      <li>• Unexpected inventory shortages</li>
                      <li>• Shipping delays during holidays</li>
                      <li>• Quality inconsistencies</li>
                      <li>• Unannounced price changes</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">Pro Tip</span>
                    Always test products by ordering samples before listing them in your store.
                  </p>
                </div>
              </div>

              {/* Marketing Tips */}
              <div className="card">
                <h3 className="text-title-3 font-bold mb-6">Marketing Strategies</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Acquisition</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Facebook/Instagram ads targeting interests</li>
                      <li>• Google Shopping for high-intent buyers</li>
                      <li>• Influencer partnerships in your niche</li>
                      <li>• Content marketing for organic traffic</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Retention</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Email marketing sequences</li>
                      <li>• Loyalty programs & rewards</li>
                      <li>• Re-engagement campaigns</li>
                      <li>• Post-purchase follow-ups</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Daily Tip</h4>
                  <p className="text-gray-900 font-medium italic">"{marketingTips[Math.floor(Math.random() * marketingTips.length)]}"</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}