'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiHelpCircle, FiChevronDown } from 'react-icons/fi';

// Navigation items for search
const SEARCH_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', keywords: ['home', 'overview', 'main'] },
    { label: 'Products', path: '/products', keywords: ['catalog', 'items', 'inventory'] },
    { label: 'Launcher', path: '/launcher', keywords: ['learning', 'courses', 'start'] },
    { label: 'Content Studio', path: '/content', keywords: ['videos', 'hooks', 'scripts'] },
    { label: 'Email & Funnels', path: '/email', keywords: ['sequences', 'marketing'] },
    { label: 'Scaling', path: '/scaling', keywords: ['growth', 'ads', 'budget'] },
    { label: 'Analyze Product', path: '/analyze', keywords: ['research', 'check'] },
    { label: 'Meta Ads', path: '/meta-ads', keywords: ['facebook', 'instagram', 'advertising'] },
    { label: 'AI Advisor', path: '/ai-advisor', keywords: ['chatbot', 'help', 'assistant'] },
    { label: 'Settings', path: '/settings', keywords: ['preferences', 'account'] },
    { label: 'Inventory', path: '/inventory', keywords: ['stock', 'warehouse'] },
    { label: 'Suppliers', path: '/suppliers', keywords: ['vendors', 'sourcing'] },
];

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Filter search results
    const searchResults = searchQuery.trim()
        ? SEARCH_ITEMS.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
        ).slice(0, 6)
        : [];

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSearchResults(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (path: string) => {
        router.push(path);
        setSearchQuery('');
        setShowSearchResults(false);
    };

    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl" ref={searchRef}>
                <div className="relative group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSearchResults(true);
                        }}
                        onFocus={() => setShowSearchResults(true)}
                        placeholder="Search pages..."
                        className="w-full pl-12 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                            {searchResults.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleSearch(item.path)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <FiSearch className="text-gray-400" size={16} />
                                    <span className="text-gray-700">{item.label}</span>
                                    <span className="text-xs text-gray-400 ml-auto">{item.path}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {showSearchResults && searchQuery && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center text-gray-500 text-sm z-50">
                            No pages found for "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="p-2.5 rounded-full text-gray-500 hover:bg-white hover:text-primary-600 hover:shadow-apple transition-all relative">
                    <FiBell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white hover:shadow-apple transition-all group"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 border-2 border-white shadow-sm">
                            <FiUser size={18} />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700">Demo User</p>
                            <p className="text-xs text-gray-500">Learning Mode</p>
                        </div>
                        <FiChevronDown className={`text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Menu Dropdown */}
                    {showProfileMenu && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <p className="font-semibold text-gray-900">Demo User</p>
                                <p className="text-xs text-gray-500">Learning Mode (No Login Required)</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { router.push('/settings'); setShowProfileMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                                >
                                    <FiSettings size={16} /> Settings
                                </button>
                                <button
                                    onClick={() => { router.push('/launcher'); setShowProfileMenu(false); }}
                                    className="w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors"
                                >
                                    <FiHelpCircle size={16} /> Learning Hub
                                </button>
                                <div className="h-[1px] bg-gray-100 my-2"></div>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('learning_profile');
                                        router.push('/launcher/onboarding');
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3 transition-colors"
                                >
                                    <FiLogOut size={16} /> Reset Progress
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
