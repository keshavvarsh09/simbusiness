'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiVideo, FiZap, FiCalendar, FiCopy, FiCheck, FiPlus, FiTrash2,
    FiStar, FiTrendingUp, FiClock, FiEdit3, FiRefreshCw, FiTarget
} from 'react-icons/fi';

interface VideoScript {
    id: string;
    hook: string;
    body: string;
    cta: string;
    platform: 'tiktok' | 'instagram' | 'youtube';
    hookScore: number;
    createdAt: Date;
}

interface ContentPost {
    id: string;
    scriptId: string;
    platform: string;
    scheduledFor: Date;
    status: 'draft' | 'scheduled' | 'posted';
}

// Hook templates based on viral content patterns
const HOOK_TEMPLATES = [
    { template: "I can't believe {product} actually does this...", category: 'curiosity' },
    { template: "Stop scrolling if you have {problem}!", category: 'problem' },
    { template: "POV: You just discovered {benefit}", category: 'pov' },
    { template: "This {product} is going viral for a reason", category: 'social_proof' },
    { template: "I tested {product} for 30 days. Here's what happened:", category: 'results' },
    { template: "Nobody talks about this {product} hack", category: 'secret' },
    { template: "Why is everyone buying this {product}?", category: 'fomo' },
    { template: "You've been doing {task} wrong your whole life", category: 'education' },
];

// Video script structures
const SCRIPT_STRUCTURES = [
    {
        name: 'Problem-Agitate-Solution',
        steps: ['Hook (Problem)', 'Agitate the pain', 'Introduce solution', 'Show product', 'CTA'],
        duration: '15-30s'
    },
    {
        name: 'Before-After',
        steps: ['Show "before" state', 'Transition moment', 'Show "after" results', 'CTA'],
        duration: '10-20s'
    },
    {
        name: 'Unboxing/Demo',
        steps: ['Exciting hook', 'Unbox/reveal', 'Key feature demo', 'Reaction', 'CTA'],
        duration: '20-45s'
    },
    {
        name: 'Storytelling',
        steps: ['Personal hook', 'The struggle', 'Discovery', 'Transformation', 'CTA'],
        duration: '30-60s'
    },
];

export default function ContentStudio() {
    const [activeTab, setActiveTab] = useState<'hooks' | 'scripts' | 'calendar'>('hooks');
    const [scripts, setScripts] = useState<VideoScript[]>([]);
    const [calendar, setCalendar] = useState<ContentPost[]>([]);
    const [newHook, setNewHook] = useState('');
    const [hookScore, setHookScore] = useState<number | null>(null);
    const [selectedStructure, setSelectedStructure] = useState(SCRIPT_STRUCTURES[0]);
    const [editingScript, setEditingScript] = useState<VideoScript | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Simulate hook quality scoring
    const scoreHook = (hook: string) => {
        let score = 0;

        // Length check (5-15 words ideal)
        const wordCount = hook.split(' ').length;
        if (wordCount >= 5 && wordCount <= 15) score += 2;
        else if (wordCount >= 3 && wordCount <= 20) score += 1;

        // Starts with power words
        const powerWords = ['stop', 'pov', 'this', 'why', 'how', 'i', 'you', 'nobody', 'everyone'];
        if (powerWords.some(w => hook.toLowerCase().startsWith(w))) score += 2;

        // Contains emotional triggers
        const emotionalWords = ['can\'t believe', 'actually', 'secret', 'hack', 'wrong', 'viral', 'crazy', 'insane'];
        if (emotionalWords.some(w => hook.toLowerCase().includes(w))) score += 2;

        // Has curiosity gap
        if (hook.includes('...') || hook.includes('?') || hook.toLowerCase().includes('here\'s')) score += 2;

        // Calls out specific audience
        if (hook.toLowerCase().includes('if you') || hook.toLowerCase().includes('for anyone')) score += 1;

        // Caps for emphasis (but not all caps)
        if (/[A-Z]/.test(hook) && hook !== hook.toUpperCase()) score += 1;

        return Math.min(score, 10);
    };

    const analyzeHook = () => {
        if (!newHook.trim()) return;
        const score = scoreHook(newHook);
        setHookScore(score);
    };

    const createScript = () => {
        const newScript: VideoScript = {
            id: `script-${Date.now()}`,
            hook: newHook || 'Enter your hook...',
            body: selectedStructure.steps.slice(1, -1).join('\n'),
            cta: 'Link in bio! Comment "SEND" for details 👇',
            platform: 'tiktok',
            hookScore: hookScore || 0,
            createdAt: new Date(),
        };
        setScripts([newScript, ...scripts]);
        setEditingScript(newScript);
        setNewHook('');
        setHookScore(null);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-500';
        if (score >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 8) return 'Excellent';
        if (score >= 6) return 'Good';
        if (score >= 4) return 'Average';
        return 'Needs Work';
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <FiVideo className="text-white text-lg sm:text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Content Studio</h2>
                            <p className="text-xs sm:text-sm text-gray-500">Create viral hooks, scripts, and plan content</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                            {scripts.length} Scripts
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
                {[
                    { id: 'hooks', label: 'Hook Generator', shortLabel: 'Hooks', icon: FiZap },
                    { id: 'scripts', label: 'Video Scripts', shortLabel: 'Scripts', icon: FiEdit3 },
                    { id: 'calendar', label: 'Content Calendar', shortLabel: 'Calendar', icon: FiCalendar },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 min-w-0 px-3 sm:px-4 py-3 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'text-purple-600 border-b-2 border-purple-500 bg-purple-50/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <tab.icon className="text-base sm:text-lg flex-shrink-0" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.shortLabel}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    {/* Hook Generator Tab */}
                    {activeTab === 'hooks' && (
                        <motion.div
                            key="hooks"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Hook Input */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Write Your Hook (First 3 Seconds)
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <input
                                        type="text"
                                        value={newHook}
                                        onChange={(e) => setNewHook(e.target.value)}
                                        placeholder="Stop scrolling if you have this problem..."
                                        className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                                    />
                                    <button
                                        onClick={analyzeHook}
                                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 touch-target"
                                    >
                                        <FiZap />
                                        Score It
                                    </button>
                                </div>

                                {/* Score Display */}
                                {hookScore !== null && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`text-4xl font-bold ${getScoreColor(hookScore)}`}>
                                                    {hookScore}/10
                                                </div>
                                                <div>
                                                    <div className={`font-medium ${getScoreColor(hookScore)}`}>
                                                        {getScoreLabel(hookScore)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">Hook Quality Score</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={createScript}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                                            >
                                                Create Script →
                                            </button>
                                        </div>

                                        {hookScore < 6 && (
                                            <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                                                <strong>Tips:</strong> Try starting with "POV:", "Stop scrolling if...", or add "..." to create curiosity.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Hook Templates */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Viral Hook Templates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {HOOK_TEMPLATES.map((hook, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setNewHook(hook.template)}
                                            className="p-3 text-left bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                                        >
                                            <div className="text-sm text-gray-700 group-hover:text-purple-700">
                                                {hook.template}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1 capitalize">{hook.category}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Video Scripts Tab */}
                    {activeTab === 'scripts' && (
                        <motion.div
                            key="scripts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Script Structures */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Script Structure</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {SCRIPT_STRUCTURES.map((structure) => (
                                        <button
                                            key={structure.name}
                                            onClick={() => setSelectedStructure(structure)}
                                            className={`p-3 rounded-xl border text-left transition-all ${selectedStructure.name === structure.name
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="text-sm font-medium text-gray-900">{structure.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{structure.duration}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Structure Steps */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">{selectedStructure.name} Structure:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStructure.steps.map((step, i) => (
                                        <div key={i} className="flex items-center">
                                            <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm">
                                                {i + 1}. {step}
                                            </span>
                                            {i < selectedStructure.steps.length - 1 && (
                                                <span className="mx-2 text-gray-300">→</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Scripts List */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-700">Your Scripts</h3>
                                    <button
                                        onClick={() => setActiveTab('hooks')}
                                        className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                    >
                                        <FiPlus /> Create New
                                    </button>
                                </div>

                                {scripts.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <FiEdit3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No scripts yet</p>
                                        <p className="text-sm mt-1">Create a hook to generate your first script</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {scripts.map((script) => (
                                            <div
                                                key={script.id}
                                                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-all"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`text-sm font-medium ${getScoreColor(script.hookScore)}`}>
                                                                {script.hookScore}/10
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {script.platform.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-900 font-medium">{script.hook}</div>
                                                        <div className="text-sm text-gray-500 mt-2 whitespace-pre-line">{script.body}</div>
                                                        <div className="text-sm text-purple-600 mt-2">{script.cta}</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => copyToClipboard(`${script.hook}\n\n${script.body}\n\n${script.cta}`, script.id)}
                                                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                        >
                                                            {copiedId === script.id ? (
                                                                <FiCheck className="text-green-500" />
                                                            ) : (
                                                                <FiCopy className="text-gray-400" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setScripts(scripts.filter(s => s.id !== script.id))}
                                                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <FiTrash2 className="text-gray-400 hover:text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Content Calendar Tab */}
                    {activeTab === 'calendar' && (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {/* Posting Schedule Strategy */}
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                    <FiTarget className="text-purple-500" />
                                    Viral Content Posting Strategy
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                                    <div className="p-3 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">8-14</div>
                                        <div className="text-xs text-gray-500">Videos/Day</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-pink-600">3</div>
                                        <div className="text-xs text-gray-500">Platforms</div>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">100%</div>
                                        <div className="text-xs text-gray-500">Organic First</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-4">
                                    Post consistently across TikTok, Instagram Reels, and YouTube Shorts.
                                    Repurpose the same content across all platforms.
                                </p>
                            </div>

                            {/* Weekly Calendar View */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">This Week's Schedule</h3>
                                <div className="grid grid-cols-7 gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                                        <div key={day} className="text-center">
                                            <div className="text-xs text-gray-500 mb-2">{day}</div>
                                            <div className={`p-3 rounded-xl border ${i < 5 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                                                }`}>
                                                <div className="text-lg font-bold text-gray-900">{i < 5 ? '10' : '6'}</div>
                                                <div className="text-xs text-gray-500">posts</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Platform Breakdown */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { name: 'TikTok', color: 'from-gray-900 to-gray-800', posts: 28 },
                                    { name: 'Instagram', color: 'from-pink-500 to-purple-500', posts: 21 },
                                    { name: 'YouTube', color: 'from-red-500 to-red-600', posts: 14 },
                                ].map(platform => (
                                    <div key={platform.name} className={`p-4 rounded-xl bg-gradient-to-br ${platform.color} text-white`}>
                                        <div className="text-lg font-bold">{platform.name}</div>
                                        <div className="text-2xl font-bold mt-2">{platform.posts}</div>
                                        <div className="text-sm opacity-80">posts this week</div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center py-8 text-gray-400">
                                <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>Full calendar coming soon</p>
                                <p className="text-sm mt-1">For now, focus on creating 8-14 videos daily!</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
