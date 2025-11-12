'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  FiTrendingUp
} from 'react-icons/fi';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  };

  const linkClasses = (path: string) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path) 
      ? 'bg-blue-100 text-primary' 
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <FiBarChart2 /> SimBusiness
        </Link>
        <nav>
          <ul className="flex items-center space-x-1">
            <li>
              <Link href="/" className={linkClasses('/')}>
                <FiHome /> Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className={linkClasses('/dashboard')}>
                <FiLayout /> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/products" className={linkClasses('/products')}>
                <FiShoppingBag /> Products
              </Link>
            </li>
            <li>
              <Link href="/market" className={linkClasses('/market')}>
                <FiBarChart2 /> Market
              </Link>
            </li>
            <li>
              <Link href="/suppliers" className={linkClasses('/suppliers')}>
                <FiPackage /> Suppliers
              </Link>
            </li>
            <li>
              <Link href="/products/analyze" className={linkClasses('/products/analyze')}>
                <FiSearch /> Analyze Product
              </Link>
            </li>
            <li>
              <Link href="/products/recommendations" className={linkClasses('/products/recommendations')}>
                <FiTrendingUp /> Recommendations
              </Link>
            </li>
            <li>
              <Link href="/analytics/meta" className={linkClasses('/analytics/meta')}>
                <FiImage /> Meta Analytics
              </Link>
            </li>
            <li>
              <Link href="/chatbot" className={linkClasses('/chatbot')}>
                <FiMessageCircle /> AI Advisor
              </Link>
            </li>
            <li>
              <Link href="/missions" className={linkClasses('/missions')}>
                <FiClock /> Missions
              </Link>
            </li>
            <li>
              <Link href="/bankruptcy" className={linkClasses('/bankruptcy')}>
                <FiAlertTriangle /> Risk Check
              </Link>
            </li>
            <li>
              <Link href="/settings" className={linkClasses('/settings')}>
                <FiSettings /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 