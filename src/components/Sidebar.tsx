'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome,
    FiLayout,
    FiBarChart2,
    FiPackage,
    FiSettings,
    FiShoppingBag,
    FiSearch,
    FiImage,
    FiMessageCircle,
    FiClock,
    FiTarget,
    FiTrendingUp,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

const menuItems = [
    {
        category: 'Main',
        items: [
            { href: '/', label: 'Home', icon: FiHome },
            { href: '/dashboard', label: 'Dashboard', icon: FiLayout },
            { href: '/launcher', label: 'Launcher', icon: FiTrendingUp },
        ]
    },
    {
        category: 'Management',
        items: [
            { href: '/products', label: 'Products', icon: FiShoppingBag },
            { href: '/inventory', label: 'Inventory', icon: FiPackage },
            { href: '/suppliers', label: 'Suppliers', icon: FiPackage },
        ]
    },
    {
        category: 'Analysis',
        items: [
            { href: '/products/analyze', label: 'Analyze', icon: FiSearch },
            { href: '/analytics/meta', label: 'Meta Ads', icon: FiImage },
            { href: '/ads', label: 'Strategy', icon: FiTarget },
        ]
    },
    {
        category: 'Business',
        items: [
            { href: '/market', label: 'Market', icon: FiBarChart2 },
            { href: '/chatbot', label: 'AI Advisor', icon: FiMessageCircle },
            { href: '/missions', label: 'Missions', icon: FiClock },
        ]
    },
    {
        category: 'System',
        items: [
            { href: '/settings', label: 'Settings', icon: FiSettings },
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (path: string) => {
        if (path === '/') return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <motion.aside
            initial={{ width: 280 }}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200 z-50 flex flex-col shadow-apple"
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-gray-100/50">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="min-w-[40px] h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                        <FiBarChart2 size={20} />
                    </div>
                    <motion.span
                        animate={{ opacity: isCollapsed ? 0 : 1 }}
                        className="font-display font-bold text-xl text-gray-900 whitespace-nowrap"
                    >
                        SimBusiness
                    </motion.span>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-hide">
                {menuItems.map((section, idx) => (
                    <div key={idx}>
                        {!isCollapsed && (
                            <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {section.category}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block"
                                    >
                                        <div
                                            className={`
                        relative flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group
                        ${active
                                                    ? 'bg-primary-50 text-primary-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }
                      `}
                                        >
                                            {active && (
                                                <motion.div
                                                    layoutId="activeSidebar"
                                                    className="absolute inset-0 bg-primary-50 rounded-xl"
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}

                                            <div className="relative z-10 flex items-center gap-3 min-w-0">
                                                <Icon size={20} className={active ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'} />
                                                {!isCollapsed && (
                                                    <span className="font-medium truncate">{item.label}</span>
                                                )}
                                            </div>

                                            {/* Tooltip for collapsed state */}
                                            {isCollapsed && (
                                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                                    {item.label}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Collapse Toggle */}
            <div className="p-4 border-t border-gray-100/50">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
                </button>
            </div>
        </motion.aside>
    );
}
