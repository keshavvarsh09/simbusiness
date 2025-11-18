'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
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
  FiAlertTriangle,
  FiTrendingUp,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const linkClasses = (path: string) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path) 
      ? 'bg-blue-100 text-primary' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

  // Group navigation items logically
  const mainNav = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/launcher', label: 'Launcher', icon: FiTrendingUp },
    { href: '/dashboard', label: 'Dashboard', icon: FiLayout },
    { href: '/products', label: 'Products', icon: FiShoppingBag },
  ];

  const analysisNav = [
    { href: '/products/analyze', label: 'Analyze Product', icon: FiSearch },
    { href: '/products/recommendations', label: 'Recommendations', icon: FiTrendingUp },
    { href: '/analytics/meta', label: 'Meta Analytics', icon: FiImage },
  ];

  const businessNav = [
    { href: '/market', label: 'Market', icon: FiBarChart2 },
    { href: '/suppliers', label: 'Suppliers', icon: FiPackage },
    { href: '/chatbot', label: 'AI Advisor', icon: FiMessageCircle },
    { href: '/missions', label: 'Missions', icon: FiClock },
  ];

  const settingsNav = [
    { href: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const allNavItems = [...mainNav, ...analysisNav, ...businessNav, ...settingsNav];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <FiBarChart2 /> <span className="hidden sm:inline">SimBusiness</span><span className="sm:hidden">SB</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-1 flex-wrap">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClasses(item.href)}>
                      <Icon className="hidden xl:inline" />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="space-y-1 pt-4">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main
              </div>
              {mainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClasses(item.href)}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
                Analysis
              </div>
              {analysisNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClasses(item.href)}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
                Business Tools
              </div>
              {businessNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClasses(item.href)}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
                Settings
              </div>
              {settingsNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClasses(item.href)}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
} 