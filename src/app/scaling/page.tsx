'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import TikTokShopIntegration from '@/components/TikTokShopIntegration';
import BudgetAllocatorStrategic from '@/components/BudgetAllocatorStrategic';
import { FiArrowLeft, FiTarget } from 'react-icons/fi';
import Link from 'next/link';

export default function ScalingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [revenue, setRevenue] = useState(85600);
    const [budget, setBudget] = useState(5000);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth/signin');
            return;
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600">Loading Scaling Tools...</p>
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
                            <Link
                                href="/launcher"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiArrowLeft className="text-gray-600" />
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <FiTarget className="text-white text-lg" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Scaling & Brand</h1>
                                    <p className="text-sm text-gray-500">Module 6: Multi-Channel Growth</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Learning Context */}
                <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white">
                    <h2 className="text-2xl font-bold mb-2">🚀 Scale to 7 Figures</h2>
                    <p className="text-indigo-100 mb-4">
                        Move from dropshipping to a real brand. Multi-channel: TikTok Shop + Facebook + Amazon.
                    </p>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">$100K+</div>
                            <div className="text-sm text-indigo-200">Revenue Goal</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-sm text-indigo-200">Channels</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">Brand</div>
                            <div className="text-sm text-indigo-200">End Goal</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">FBA</div>
                            <div className="text-sm text-indigo-200">Amazon Ready</div>
                        </div>
                    </div>
                </div>

                {/* Budget Allocator */}
                <div className="mb-8">
                    <BudgetAllocatorStrategic
                        totalBudget={budget}
                        revenue={revenue}
                    />
                </div>

                {/* TikTok Shop */}
                <TikTokShopIntegration />
            </main>
        </div>
    );
}
