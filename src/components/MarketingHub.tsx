'use client';

import { useState, useEffect } from 'react';
import {
    FiTrendingUp, FiDollarSign, FiPlay, FiPause, FiPlus,
    FiBarChart2, FiTarget, FiZap, FiUsers, FiEye,
    FiShoppingCart, FiPercent, FiClock, FiRefreshCw
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthHeaders } from '@/lib/auth';

// Marketing Types
interface OrganicContent {
    id: string;
    title: string;
    platform: 'tiktok' | 'instagram' | 'youtube';
    quality: number; // 1-100
    views: number;
    likes: number;
    shares: number;
    conversions: number;
    isViral: boolean;
    createdAt: Date;
    daysActive: number;
}

interface PaidCampaign {
    id: string;
    name: string;
    platform: 'facebook' | 'tiktok' | 'google';
    status: 'active' | 'paused' | 'ended' | 'learning';
    dailyBudget: number;
    totalSpent: number;
    impressions: number;
    clicks: number;
    conversions: number;
    cpm: number;
    cpc: number;
    roas: number;
    startDate: Date;
    daysActive: number;
}

interface MarketingStats {
    organicReach: number;
    organicConversions: number;
    paidReach: number;
    paidConversions: number;
    totalAdSpend: number;
    overallRoas: number;
    cac: number; // Customer Acquisition Cost
}

interface MarketingHubProps {
    onTrafficUpdate?: (organic: number, paid: number) => void;
    budget?: number;
}

export default function MarketingHub({ onTrafficUpdate, budget = 0 }: MarketingHubProps) {
    const [activeTab, setActiveTab] = useState<'organic' | 'paid' | 'analytics'>('organic');
    const [organicContent, setOrganicContent] = useState<OrganicContent[]>([]);
    const [paidCampaigns, setPaidCampaigns] = useState<PaidCampaign[]>([]);
    const [stats, setStats] = useState<MarketingStats>({
        organicReach: 0,
        organicConversions: 0,
        paidReach: 0,
        paidConversions: 0,
        totalAdSpend: 0,
        overallRoas: 0,
        cac: 0
    });
    const [showContentModal, setShowContentModal] = useState(false);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [newContent, setNewContent] = useState({
        title: '',
        platform: 'tiktok' as 'tiktok' | 'instagram' | 'youtube',
        quality: 50
    });
    const [newCampaign, setNewCampaign] = useState({
        name: '',
        platform: 'facebook' as 'facebook' | 'tiktok' | 'google',
        dailyBudget: 20
    });
    const [simulating, setSimulating] = useState(false);

    // Load saved marketing data
    useEffect(() => {
        loadMarketingData();
    }, []);

    // Auto-simulate marketing every 10 seconds when simulating
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (simulating) {
            interval = setInterval(() => {
                simulateMarketing();
            }, 10000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [simulating, organicContent, paidCampaigns]);

    const loadMarketingData = async () => {
        try {
            const response = await fetch('/api/marketing/state', {
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setOrganicContent(data.organicContent || []);
                    setPaidCampaigns(data.paidCampaigns || []);
                    setStats(data.stats || stats);
                }
            }
        } catch (error) {
            console.log('Marketing data not available, using defaults');
        }
    };

    const saveMarketingData = async () => {
        try {
            await fetch('/api/marketing/state', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    organicContent,
                    paidCampaigns,
                    stats
                }),
            });
        } catch (error) {
            console.error('Failed to save marketing data:', error);
        }
    };

    // Simulate organic content performance
    const simulateOrganicContent = () => {
        const updatedContent = organicContent.map(content => {
            // Calculate viral chance based on quality
            const viralChance = content.quality / 1000; // Higher quality = higher chance to go viral
            const goViral = !content.isViral && Math.random() < viralChance;

            // Base growth rates
            let viewGrowth = 0.05 + (content.quality / 500); // 5-25% daily growth
            let likeRate = 0.08 + (content.quality / 1000); // 8-18% like rate
            let shareRate = 0.02 + (content.quality / 2000); // 2-7% share rate
            let conversionRate = 0.001 + (content.quality / 10000); // 0.1-1.1% conversion

            // Viral multiplier
            if (goViral || content.isViral) {
                viewGrowth *= 10;
                likeRate *= 2;
                shareRate *= 5;
                conversionRate *= 3;
            }

            // Decay over time (content gets stale)
            const decayFactor = Math.max(0.1, 1 - (content.daysActive * 0.05));
            viewGrowth *= decayFactor;

            const newViews = Math.floor(content.views * (1 + viewGrowth * Math.random()));
            const viewDelta = newViews - content.views;
            const newLikes = content.likes + Math.floor(viewDelta * likeRate * Math.random());
            const newShares = content.shares + Math.floor(viewDelta * shareRate * Math.random());
            const newConversions = content.conversions + Math.floor(viewDelta * conversionRate * Math.random());

            return {
                ...content,
                views: newViews,
                likes: newLikes,
                shares: newShares,
                conversions: newConversions,
                isViral: goViral || content.isViral,
                daysActive: content.daysActive + 0.1 // Increment by simulation tick
            };
        });

        setOrganicContent(updatedContent);
        return updatedContent;
    };

    // Simulate paid campaign performance
    const simulatePaidCampaigns = () => {
        const updatedCampaigns = paidCampaigns.map(campaign => {
            if (campaign.status !== 'active' && campaign.status !== 'learning') {
                return campaign;
            }

            // Platform-specific metrics
            const platformMetrics = {
                facebook: { cpmRange: [8, 16], ctrRange: [0.8, 2.5], convRate: [0.01, 0.04] },
                tiktok: { cpmRange: [5, 12], ctrRange: [1.0, 3.5], convRate: [0.015, 0.05] },
                google: { cpmRange: [10, 25], ctrRange: [2.0, 5.0], convRate: [0.02, 0.06] }
            };

            const metrics = platformMetrics[campaign.platform];

            // Calculate daily spend (10% per simulation tick)
            const tickSpend = campaign.dailyBudget * 0.1;
            const newTotalSpent = campaign.totalSpent + tickSpend;

            // Calculate impressions from spend
            const cpm = metrics.cpmRange[0] + Math.random() * (metrics.cpmRange[1] - metrics.cpmRange[0]);
            const newImpressions = campaign.impressions + Math.floor((tickSpend / cpm) * 1000);

            // Calculate clicks from impressions
            const ctr = (metrics.ctrRange[0] + Math.random() * (metrics.ctrRange[1] - metrics.ctrRange[0])) / 100;
            const impressionDelta = newImpressions - campaign.impressions;
            const newClicks = campaign.clicks + Math.floor(impressionDelta * ctr);

            // Calculate conversions from clicks
            const convRate = metrics.convRate[0] + Math.random() * (metrics.convRate[1] - metrics.convRate[0]);
            const clickDelta = newClicks - campaign.clicks;
            const newConversions = campaign.conversions + Math.floor(clickDelta * convRate);

            // Calculate derived metrics
            const newCpc = newClicks > 0 ? newTotalSpent / newClicks : 0;
            const revenue = newConversions * 50; // Assume $50 AOV
            const newRoas = newTotalSpent > 0 ? revenue / newTotalSpent : 0;

            // Learning period ends after 3 days
            const newStatus = campaign.status === 'learning' && campaign.daysActive >= 3
                ? 'active'
                : campaign.status;

            return {
                ...campaign,
                status: newStatus,
                totalSpent: newTotalSpent,
                impressions: newImpressions,
                clicks: newClicks,
                conversions: newConversions,
                cpm,
                cpc: newCpc,
                roas: newRoas,
                daysActive: campaign.daysActive + 0.1
            };
        });

        setPaidCampaigns(updatedCampaigns);
        return updatedCampaigns;
    };

    // Main simulation function
    const simulateMarketing = () => {
        const updatedOrganic = simulateOrganicContent();
        const updatedPaid = simulatePaidCampaigns();

        // Calculate overall stats
        const organicReach = updatedOrganic.reduce((sum, c) => sum + c.views, 0);
        const organicConversions = updatedOrganic.reduce((sum, c) => sum + c.conversions, 0);
        const paidReach = updatedPaid.reduce((sum, c) => sum + c.impressions, 0);
        const paidConversions = updatedPaid.reduce((sum, c) => sum + c.conversions, 0);
        const totalAdSpend = updatedPaid.reduce((sum, c) => sum + c.totalSpent, 0);
        const totalConversions = organicConversions + paidConversions;
        const totalRevenue = totalConversions * 50; // Assume $50 AOV
        const overallRoas = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
        const cac = totalConversions > 0 ? totalAdSpend / paidConversions : 0;

        setStats({
            organicReach,
            organicConversions,
            paidReach,
            paidConversions,
            totalAdSpend,
            overallRoas,
            cac
        });

        // Notify parent of traffic update
        if (onTrafficUpdate) {
            onTrafficUpdate(organicReach, paidReach);
        }

        saveMarketingData();
    };

    // Create new organic content
    const createContent = () => {
        if (!newContent.title) return;

        const content: OrganicContent = {
            id: `content-${Date.now()}`,
            title: newContent.title,
            platform: newContent.platform,
            quality: newContent.quality,
            views: Math.floor(100 + Math.random() * 500), // Initial views
            likes: Math.floor(10 + Math.random() * 50),
            shares: Math.floor(1 + Math.random() * 10),
            conversions: 0,
            isViral: false,
            createdAt: new Date(),
            daysActive: 0
        };

        setOrganicContent([...organicContent, content]);
        setNewContent({ title: '', platform: 'tiktok', quality: 50 });
        setShowContentModal(false);
    };

    // Create new paid campaign
    const createCampaign = () => {
        if (!newCampaign.name || newCampaign.dailyBudget <= 0) return;

        const campaign: PaidCampaign = {
            id: `campaign-${Date.now()}`,
            name: newCampaign.name,
            platform: newCampaign.platform,
            status: 'learning',
            dailyBudget: newCampaign.dailyBudget,
            totalSpent: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            cpm: 0,
            cpc: 0,
            roas: 0,
            startDate: new Date(),
            daysActive: 0
        };

        setPaidCampaigns([...paidCampaigns, campaign]);
        setNewCampaign({ name: '', platform: 'facebook', dailyBudget: 20 });
        setShowCampaignModal(false);
    };

    // Toggle campaign status
    const toggleCampaign = (id: string) => {
        setPaidCampaigns(campaigns =>
            campaigns.map(c =>
                c.id === id
                    ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
                    : c
            )
        );
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'tiktok': return '🎵';
            case 'instagram': return '📸';
            case 'youtube': return '📺';
            case 'facebook': return '📘';
            case 'google': return '🔍';
            default: return '📱';
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="bg-surface-primary rounded-2xl border border-border-primary shadow-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <FiTrendingUp className="text-accent-primary" />
                            Marketing Hub
                        </h2>
                        <p className="text-text-secondary text-sm mt-1">
                            Manage organic content and paid advertising
                        </p>
                    </div>
                    <button
                        onClick={() => setSimulating(!simulating)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${simulating
                                ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                                : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30'
                            }`}
                    >
                        {simulating ? <FiPause /> : <FiPlay />}
                        {simulating ? 'Pause' : 'Simulate'}
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-text-primary">{formatNumber(stats.organicReach)}</div>
                        <div className="text-xs text-text-secondary">Organic Reach</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-text-primary">{formatNumber(stats.paidReach)}</div>
                        <div className="text-xs text-text-secondary">Paid Reach</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-600">{stats.overallRoas.toFixed(2)}x</div>
                        <div className="text-xs text-text-secondary">ROAS</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-accent-primary">${stats.cac.toFixed(2)}</div>
                        <div className="text-xs text-text-secondary">CAC</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-primary">
                {['organic', 'paid', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === tab
                                ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5'
                                : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} Marketing
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {/* Organic Content Tab */}
                    {activeTab === 'organic' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-text-primary">Your Content</h3>
                                <button
                                    onClick={() => setShowContentModal(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-sm hover:bg-accent-primary/90 transition-all"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Create Post
                                </button>
                            </div>

                            {organicContent.length === 0 ? (
                                <div className="text-center py-12 text-text-secondary">
                                    <FiZap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No content yet. Create your first post!</p>
                                    <p className="text-sm mt-1">Organic content can go viral with 0 ad spend</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {organicContent.map(content => (
                                        <div
                                            key={content.id}
                                            className={`p-4 rounded-lg border ${content.isViral
                                                    ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30'
                                                    : 'bg-background border-border-primary'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{getPlatformIcon(content.platform)}</span>
                                                    <span className="font-medium text-text-primary">{content.title}</span>
                                                    {content.isViral && (
                                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-600 text-xs rounded-full font-medium">
                                                            🔥 VIRAL
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-text-secondary">
                                                    Quality: {content.quality}%
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-text-secondary">Views</span>
                                                    <div className="font-semibold text-text-primary">{formatNumber(content.views)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Likes</span>
                                                    <div className="font-semibold text-text-primary">{formatNumber(content.likes)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Shares</span>
                                                    <div className="font-semibold text-text-primary">{formatNumber(content.shares)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Sales</span>
                                                    <div className="font-semibold text-green-600">{content.conversions}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Paid Campaigns Tab */}
                    {activeTab === 'paid' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-text-primary">Ad Campaigns</h3>
                                <button
                                    onClick={() => setShowCampaignModal(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary text-white rounded-lg text-sm hover:bg-accent-primary/90 transition-all"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    New Campaign
                                </button>
                            </div>

                            {paidCampaigns.length === 0 ? (
                                <div className="text-center py-12 text-text-secondary">
                                    <FiTarget className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No campaigns yet. Create your first ad!</p>
                                    <p className="text-sm mt-1">Paid ads provide predictable, scalable traffic</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {paidCampaigns.map(campaign => (
                                        <div
                                            key={campaign.id}
                                            className="p-4 rounded-lg bg-background border border-border-primary"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{getPlatformIcon(campaign.platform)}</span>
                                                    <span className="font-medium text-text-primary">{campaign.name}</span>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${campaign.status === 'active' ? 'bg-green-500/20 text-green-600' :
                                                            campaign.status === 'learning' ? 'bg-yellow-500/20 text-yellow-600' :
                                                                campaign.status === 'paused' ? 'bg-gray-500/20 text-gray-600' :
                                                                    'bg-red-500/20 text-red-600'
                                                        }`}>
                                                        {campaign.status === 'learning' ? '🔄 Learning' : campaign.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => toggleCampaign(campaign.id)}
                                                    className={`p-1.5 rounded transition-all ${campaign.status === 'active'
                                                            ? 'text-red-500 hover:bg-red-500/10'
                                                            : 'text-green-500 hover:bg-green-500/10'
                                                        }`}
                                                >
                                                    {campaign.status === 'active' ? <FiPause /> : <FiPlay />}
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4 text-sm">
                                                <div>
                                                    <span className="text-text-secondary">Spent</span>
                                                    <div className="font-semibold text-text-primary">${campaign.totalSpent.toFixed(2)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Impressions</span>
                                                    <div className="font-semibold text-text-primary">{formatNumber(campaign.impressions)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Clicks</span>
                                                    <div className="font-semibold text-text-primary">{formatNumber(campaign.clicks)}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">Sales</span>
                                                    <div className="font-semibold text-green-600">{campaign.conversions}</div>
                                                </div>
                                                <div>
                                                    <span className="text-text-secondary">ROAS</span>
                                                    <div className={`font-semibold ${campaign.roas >= 2 ? 'text-green-600' : campaign.roas >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {campaign.roas.toFixed(2)}x
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <h3 className="font-semibold text-text-primary mb-4">Performance Comparison</h3>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Organic Stats */}
                                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                    <h4 className="font-medium text-purple-600 mb-3 flex items-center gap-2">
                                        <FiZap />
                                        Organic Marketing
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Total Reach</span>
                                            <span className="font-semibold">{formatNumber(stats.organicReach)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Conversions</span>
                                            <span className="font-semibold text-green-600">{stats.organicConversions}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Cost</span>
                                            <span className="font-semibold text-green-600">$0 (Free!)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Content Created</span>
                                            <span className="font-semibold">{organicContent.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Viral Posts</span>
                                            <span className="font-semibold text-purple-600">{organicContent.filter(c => c.isViral).length}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Paid Stats */}
                                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                    <h4 className="font-medium text-blue-600 mb-3 flex items-center gap-2">
                                        <FiTarget />
                                        Paid Advertising
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Total Reach</span>
                                            <span className="font-semibold">{formatNumber(stats.paidReach)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Conversions</span>
                                            <span className="font-semibold text-green-600">{stats.paidConversions}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">Total Spent</span>
                                            <span className="font-semibold text-red-600">${stats.totalAdSpend.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">ROAS</span>
                                            <span className={`font-semibold ${stats.overallRoas >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {stats.overallRoas.toFixed(2)}x
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-secondary">CAC</span>
                                            <span className="font-semibold">${stats.cac.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insights */}
                            <div className="mt-6 p-4 rounded-lg bg-accent-primary/5 border border-accent-primary/20">
                                <h4 className="font-medium text-accent-primary mb-2">💡 Insights</h4>
                                <ul className="text-sm text-text-secondary space-y-1">
                                    {stats.organicConversions > stats.paidConversions && (
                                        <li>• Organic content is outperforming paid ads. Consider scaling successful content formats.</li>
                                    )}
                                    {stats.overallRoas < 2 && stats.totalAdSpend > 0 && (
                                        <li>• Your ROAS is below 2x. Consider pausing underperforming campaigns or improving targeting.</li>
                                    )}
                                    {organicContent.filter(c => c.isViral).length > 0 && (
                                        <li>• You have viral content! Use it as social proof in your paid ads for higher conversions.</li>
                                    )}
                                    {paidCampaigns.length === 0 && organicContent.length > 0 && (
                                        <li>• Tip: Test organic content first, then boost winners with paid ads for 40-60% better ROAS.</li>
                                    )}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Creation Modal */}
            {showContentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-primary rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Create Content</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newContent.title}
                                    onChange={e => setNewContent({ ...newContent, title: e.target.value })}
                                    placeholder="My viral product video"
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Platform</label>
                                <select
                                    value={newContent.platform}
                                    onChange={e => setNewContent({ ...newContent, platform: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                >
                                    <option value="tiktok">🎵 TikTok</option>
                                    <option value="instagram">📸 Instagram</option>
                                    <option value="youtube">📺 YouTube</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">
                                    Content Quality: {newContent.quality}%
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={newContent.quality}
                                    onChange={e => setNewContent({ ...newContent, quality: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <p className="text-xs text-text-secondary mt-1">
                                    Higher quality = higher chance to go viral! (Invest time in good content)
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowContentModal(false)}
                                className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-background"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createContent}
                                className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
                            >
                                Create Post
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Campaign Creation Modal */}
            {showCampaignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-primary rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-lg font-semibold text-text-primary mb-4">Create Ad Campaign</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    value={newCampaign.name}
                                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    placeholder="My first campaign"
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Platform</label>
                                <select
                                    value={newCampaign.platform}
                                    onChange={e => setNewCampaign({ ...newCampaign, platform: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-background border border-border-primary rounded-lg text-text-primary"
                                >
                                    <option value="facebook">📘 Facebook/Meta</option>
                                    <option value="tiktok">🎵 TikTok Ads</option>
                                    <option value="google">🔍 Google Ads</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Daily Budget: ${newCampaign.dailyBudget}</label>
                                <input
                                    type="range"
                                    min="5"
                                    max="500"
                                    step="5"
                                    value={newCampaign.dailyBudget}
                                    onChange={e => setNewCampaign({ ...newCampaign, dailyBudget: parseInt(e.target.value) })}
                                    className="w-full"
                                />
                                <p className="text-xs text-text-secondary mt-1">
                                    Campaigns enter a 3-day &quot;learning period&quot; before optimization
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCampaignModal(false)}
                                className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-background"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createCampaign}
                                className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
                            >
                                Launch Campaign
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
