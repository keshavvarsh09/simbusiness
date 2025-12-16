'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiShoppingBag, FiVideo, FiUsers, FiDollarSign, FiTrendingUp,
    FiStar, FiPackage, FiPercent, FiExternalLink, FiCheck
} from 'react-icons/fi';

interface TikTokProduct {
    id: string;
    name: string;
    price: number;
    commission: number;
    sales: number;
    views: number;
    rating: number;
    affiliates: number;
    status: 'active' | 'pending' | 'review';
}

interface TikTokStats {
    totalSales: number;
    totalRevenue: number;
    affiliateCommission: number;
    videoContent: number;
    gmvRank: string;
}

export default function TikTokShopIntegration() {
    const [products, setProducts] = useState<TikTokProduct[]>([
        {
            id: 'ttsp-1',
            name: 'Smart Posture Corrector',
            price: 29.99,
            commission: 15,
            sales: 1250,
            views: 125000,
            rating: 4.8,
            affiliates: 45,
            status: 'active',
        },
        {
            id: 'ttsp-2',
            name: 'LED Galaxy Projector',
            price: 49.99,
            commission: 20,
            sales: 890,
            views: 98000,
            rating: 4.6,
            affiliates: 32,
            status: 'active',
        },
    ]);

    const [stats] = useState<TikTokStats>({
        totalSales: 2140,
        totalRevenue: 85600,
        affiliateCommission: 12840,
        videoContent: 156,
        gmvRank: 'Top 5%',
    });

    const [showAddProduct, setShowAddProduct] = useState(false);

    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-600';
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'review': return 'bg-blue-100 text-blue-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🎵</span>
                        </div>
                        <div className="text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                TikTok Shop
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">GMV Max</span>
                            </h2>
                            <p className="text-sm text-gray-400">Multi-channel selling with creator network</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                            {stats.gmvRank}
                        </span>
                        <button
                            onClick={() => setShowAddProduct(true)}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                            Add Product
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-5 divide-x divide-gray-100 border-b border-gray-100">
                {[
                    { label: 'Total Sales', value: stats.totalSales.toLocaleString(), icon: FiShoppingBag, color: 'text-blue-600' },
                    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'text-green-600' },
                    { label: 'Affiliate Comm.', value: `$${stats.affiliateCommission.toLocaleString()}`, icon: FiPercent, color: 'text-purple-600' },
                    { label: 'Video Content', value: stats.videoContent, icon: FiVideo, color: 'text-pink-600' },
                    { label: 'Affiliates', value: products.reduce((s, p) => s + p.affiliates, 0), icon: FiUsers, color: 'text-orange-600' },
                ].map(stat => (
                    <div key={stat.label} className="p-4 text-center">
                        <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                        <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Creator Network Info */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FiUsers className="text-purple-500 text-xl" />
                        <div>
                            <div className="font-medium text-gray-900">Creator Network Active</div>
                            <div className="text-sm text-gray-500">77 creators promoting your products</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">$12,840</div>
                        <div className="text-xs text-gray-500">paid to affiliates</div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Shop Products</h3>
                <div className="space-y-3">
                    {products.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FiPackage className="text-gray-400 text-2xl" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span>${product.price}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiStar className="text-yellow-500" />
                                                {product.rating}
                                            </span>
                                            <span>•</span>
                                            <span>{product.commission}% commission</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">{product.sales.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">sales</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-blue-600">{(product.views / 1000).toFixed(0)}K</div>
                                        <div className="text-xs text-gray-500">views</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-purple-600">{product.affiliates}</div>
                                        <div className="text-xs text-gray-500">affiliates</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(product.status)}`}>
                                        {product.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Strategy Info */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FiTrendingUp className="text-cyan-500" />
                    GMV Max Strategy (Michael Bernstein)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FiCheck className="text-green-500" />
                            <span className="font-medium text-gray-900">Step 1</span>
                        </div>
                        <p className="text-sm text-gray-600">Build creator network with 10-15% commission rates</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FiCheck className="text-green-500" />
                            <span className="font-medium text-gray-900">Step 2</span>
                        </div>
                        <p className="text-sm text-gray-600">Repurpose top creator content for Facebook ads</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <FiCheck className="text-green-500" />
                            <span className="font-medium text-gray-900">Step 3</span>
                        </div>
                        <p className="text-sm text-gray-600">Scale to Amazon FBA for multi-channel brand</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
