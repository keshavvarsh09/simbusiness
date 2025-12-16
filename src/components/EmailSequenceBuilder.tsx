'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMail, FiPlus, FiPlay, FiPause, FiTrash2, FiCopy, FiCheck,
    FiClock, FiUsers, FiShoppingCart, FiArrowRight, FiEdit2
} from 'react-icons/fi';

interface EmailStep {
    id: string;
    type: 'delay' | 'email';
    delay?: number; // hours
    delayUnit?: 'hours' | 'days';
    subject?: string;
    preview?: string;
    template?: string;
}

interface EmailSequence {
    id: string;
    name: string;
    trigger: 'welcome' | 'abandoned_cart' | 'post_purchase' | 'winback';
    status: 'active' | 'paused' | 'draft';
    steps: EmailStep[];
    stats: {
        sent: number;
        opened: number;
        clicked: number;
        converted: number;
    };
}

// Pre-built email templates
const EMAIL_TEMPLATES = {
    welcome: [
        { subject: 'Welcome to {store_name}! 🎉', preview: 'Thanks for joining us...', template: 'welcome_1' },
        { subject: 'Your first order deserves 10% off', preview: 'Use code WELCOME10...', template: 'welcome_2' },
        { subject: 'Did you see something you liked?', preview: 'Complete your first purchase...', template: 'welcome_3' },
    ],
    abandoned_cart: [
        { subject: 'You left something behind! 🛒', preview: 'Your cart is waiting...', template: 'cart_1' },
        { subject: 'Still thinking about it?', preview: 'Here\'s 10% off to help decide...', template: 'cart_2' },
        { subject: 'Last chance: Your cart expires soon', preview: 'Items selling fast...', template: 'cart_3' },
    ],
    post_purchase: [
        { subject: 'Thanks for your order! 📦', preview: 'Your order is confirmed...', template: 'post_1' },
        { subject: 'Your order is on the way!', preview: 'Track your shipment...', template: 'post_2' },
        { subject: 'How was your experience?', preview: 'Leave a review...', template: 'post_3' },
    ],
    winback: [
        { subject: 'We miss you! 💔', preview: 'It\'s been a while...', template: 'winback_1' },
        { subject: 'Come back for 20% off everything', preview: 'Exclusive offer inside...', template: 'winback_2' },
        { subject: 'Final offer: Your discount expires today', preview: 'Don\'t miss out...', template: 'winback_3' },
    ],
};

const TRIGGER_INFO = {
    welcome: { label: 'Welcome Series', icon: '👋', description: 'New subscriber onboarding' },
    abandoned_cart: { label: 'Abandoned Cart', icon: '🛒', description: 'Recover lost sales (60-70% abandon)' },
    post_purchase: { label: 'Post-Purchase', icon: '📦', description: 'Order confirmation & upsells' },
    winback: { label: 'Win-Back', icon: '💔', description: 'Re-engage inactive customers' },
};

export default function EmailSequenceBuilder() {
    const [sequences, setSequences] = useState<EmailSequence[]>([
        {
            id: 'seq-1',
            name: 'Abandoned Cart Recovery',
            trigger: 'abandoned_cart',
            status: 'active',
            steps: [
                { id: 's1', type: 'delay', delay: 1, delayUnit: 'hours' },
                { id: 's2', type: 'email', subject: 'You left something behind! 🛒', preview: 'Your cart is waiting...', template: 'cart_1' },
                { id: 's3', type: 'delay', delay: 24, delayUnit: 'hours' },
                { id: 's4', type: 'email', subject: 'Still thinking about it?', preview: 'Here\'s 10% off...', template: 'cart_2' },
                { id: 's5', type: 'delay', delay: 48, delayUnit: 'hours' },
                { id: 's6', type: 'email', subject: 'Last chance!', preview: 'Cart expires soon...', template: 'cart_3' },
            ],
            stats: { sent: 1250, opened: 562, clicked: 187, converted: 42 },
        },
    ]);
    const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSequence, setNewSequence] = useState({
        name: '',
        trigger: 'abandoned_cart' as EmailSequence['trigger'],
    });
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const createSequence = () => {
        if (!newSequence.name) return;

        const templates = EMAIL_TEMPLATES[newSequence.trigger];
        const steps: EmailStep[] = [];

        templates.forEach((template, i) => {
            if (i > 0) {
                steps.push({
                    id: `delay-${Date.now()}-${i}`,
                    type: 'delay',
                    delay: i === 1 ? 24 : 48,
                    delayUnit: 'hours',
                });
            }
            steps.push({
                id: `email-${Date.now()}-${i}`,
                type: 'email',
                subject: template.subject,
                preview: template.preview,
                template: template.template,
            });
        });

        const sequence: EmailSequence = {
            id: `seq-${Date.now()}`,
            name: newSequence.name,
            trigger: newSequence.trigger,
            status: 'draft',
            steps,
            stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        };

        setSequences([...sequences, sequence]);
        setNewSequence({ name: '', trigger: 'abandoned_cart' });
        setShowCreateModal(false);
    };

    const toggleSequence = (id: string) => {
        setSequences(seqs => seqs.map(s =>
            s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s
        ));
    };

    const deleteSequence = (id: string) => {
        setSequences(seqs => seqs.filter(s => s.id !== id));
    };

    const copySequence = (seq: EmailSequence) => {
        const newSeq = {
            ...seq,
            id: `seq-${Date.now()}`,
            name: `${seq.name} (Copy)`,
            status: 'draft' as const,
            stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
        };
        setSequences([...sequences, newSeq]);
        setCopiedId(seq.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDelay = (hours: number) => {
        if (hours >= 24) {
            const days = Math.floor(hours / 24);
            return `${days} day${days > 1 ? 's' : ''}`;
        }
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <FiMail className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Email Sequences</h2>
                            <p className="text-sm text-gray-500">Automate customer communication & recovery</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <FiPlus /> New Sequence
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-100">
                {[
                    { label: 'Total Sent', value: sequences.reduce((s, seq) => s + seq.stats.sent, 0), icon: FiMail, color: 'blue' },
                    { label: 'Opened', value: sequences.reduce((s, seq) => s + seq.stats.opened, 0), icon: FiUsers, color: 'green' },
                    { label: 'Clicked', value: sequences.reduce((s, seq) => s + seq.stats.clicked, 0), icon: FiArrowRight, color: 'purple' },
                    { label: 'Converted', value: sequences.reduce((s, seq) => s + seq.stats.converted, 0), icon: FiShoppingCart, color: 'orange' },
                ].map(stat => (
                    <div key={stat.label} className="text-center p-3 bg-gray-50 rounded-xl">
                        <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Sequences List */}
            <div className="p-6">
                {sequences.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <FiMail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No email sequences yet</p>
                        <p className="text-sm mt-1">Create your first automated email flow</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sequences.map(seq => {
                            const triggerInfo = TRIGGER_INFO[seq.trigger];
                            const openRate = seq.stats.sent > 0 ? ((seq.stats.opened / seq.stats.sent) * 100).toFixed(1) : '0';
                            const convRate = seq.stats.sent > 0 ? ((seq.stats.converted / seq.stats.sent) * 100).toFixed(1) : '0';

                            return (
                                <motion.div
                                    key={seq.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-gray-200 rounded-xl overflow-hidden"
                                >
                                    {/* Sequence Header */}
                                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{triggerInfo.icon}</span>
                                            <div>
                                                <div className="font-medium text-gray-900">{seq.name}</div>
                                                <div className="text-sm text-gray-500">{triggerInfo.description}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${seq.status === 'active' ? 'bg-green-100 text-green-600' :
                                                    seq.status === 'paused' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-gray-100 text-gray-600'
                                                }`}>
                                                {seq.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleSequence(seq.id)}
                                                className={`p-2 rounded-lg transition-colors ${seq.status === 'active'
                                                        ? 'text-yellow-600 hover:bg-yellow-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                    }`}
                                            >
                                                {seq.status === 'active' ? <FiPause /> : <FiPlay />}
                                            </button>
                                            <button
                                                onClick={() => copySequence(seq)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                {copiedId === seq.id ? <FiCheck className="text-green-500" /> : <FiCopy />}
                                            </button>
                                            <button
                                                onClick={() => setSelectedSequence(selectedSequence === seq.id ? null : seq.id)}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => deleteSequence(seq.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-6 text-sm">
                                        <span className="text-gray-500">{seq.steps.filter(s => s.type === 'email').length} emails</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-gray-600">{openRate}% open rate</span>
                                        <span className="text-gray-500">•</span>
                                        <span className="text-green-600 font-medium">{convRate}% conversion</span>
                                    </div>

                                    {/* Expanded Flow View */}
                                    <AnimatePresence>
                                        {selectedSequence === seq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-100"
                                            >
                                                <div className="p-4 bg-white">
                                                    <div className="flex items-start gap-4 overflow-x-auto pb-4">
                                                        <div className="flex-shrink-0 w-24 text-center">
                                                            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                                                                <FiUsers className="text-blue-600" />
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-2">Trigger</div>
                                                            <div className="text-xs font-medium">{triggerInfo.label}</div>
                                                        </div>

                                                        {seq.steps.map((step, i) => (
                                                            <div key={step.id} className="flex items-start gap-4">
                                                                <div className="text-gray-300 self-center">→</div>
                                                                <div className="flex-shrink-0 w-32 text-center">
                                                                    {step.type === 'delay' ? (
                                                                        <>
                                                                            <div className="w-10 h-10 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                                                <FiClock className="text-gray-600" />
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 mt-2">Wait</div>
                                                                            <div className="text-xs font-medium">{formatDelay(step.delay || 0)}</div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="w-10 h-10 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                                                                                <FiMail className="text-orange-600" />
                                                                            </div>
                                                                            <div className="text-xs text-gray-500 mt-2">Email {Math.floor((i + 1) / 2)}</div>
                                                                            <div className="text-xs font-medium truncate" title={step.subject}>
                                                                                {step.subject?.slice(0, 20)}...
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Email Sequence</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Sequence Name</label>
                                <input
                                    type="text"
                                    value={newSequence.name}
                                    onChange={e => setNewSequence({ ...newSequence, name: e.target.value })}
                                    placeholder="e.g., Holiday Sale Recovery"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Trigger Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(TRIGGER_INFO).map(([key, info]) => (
                                        <button
                                            key={key}
                                            onClick={() => setNewSequence({ ...newSequence, trigger: key as EmailSequence['trigger'] })}
                                            className={`p-3 rounded-lg border text-left transition-all ${newSequence.trigger === key
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-orange-300'
                                                }`}
                                        >
                                            <span className="text-xl">{info.icon}</span>
                                            <div className="text-sm font-medium mt-1">{info.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createSequence}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:opacity-90"
                            >
                                Create Sequence
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
