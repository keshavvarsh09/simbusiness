'use client';

import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

export default function Header() {
    return (
        <header className="h-20 px-8 flex items-center justify-between bg-white/50 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full pl-12 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm hover:shadow-md"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="p-2.5 rounded-full text-gray-500 hover:bg-white hover:text-primary-600 hover:shadow-apple transition-all relative">
                    <FiBell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white hover:shadow-apple transition-all group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 border-2 border-white shadow-sm">
                        <FiUser size={18} />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-700">Admin User</p>
                        <p className="text-xs text-gray-500">Pro Plan</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
