'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import EmailSequenceBuilder from '@/components/EmailSequenceBuilder';
import FunnelVisualizer from '@/components/FunnelVisualizer';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import Link from 'next/link';

export default function EmailPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

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
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600">Loading Email & Funnels...</p>
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
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                    <FiMail className="text-white text-lg" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Email & Funnels</h1>
                                    <p className="text-sm text-gray-500">Module 5: Automate Customer Journey</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Learning Context */}
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white">
                    <h2 className="text-2xl font-bold mb-2">📧 Master Email Marketing</h2>
                    <p className="text-orange-100 mb-4">
                        Recover 60-70% of abandoned carts. Email generates $42 ROI for every $1 spent.
                    </p>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">4</div>
                            <div className="text-sm text-orange-200">Key Sequences</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">60%</div>
                            <div className="text-sm text-orange-200">Cart Recovery</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">$42</div>
                            <div className="text-sm text-orange-200">ROI per $1</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold">3-5</div>
                            <div className="text-sm text-orange-200">Emails/Sequence</div>
                        </div>
                    </div>
                </div>

                {/* Funnel Visualizer */}
                <div className="mb-8">
                    <FunnelVisualizer />
                </div>

                {/* Email Sequence Builder */}
                <EmailSequenceBuilder />
            </main>
        </div>
    );
}
