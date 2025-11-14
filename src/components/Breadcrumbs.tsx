/**
 * Breadcrumbs Component
 * Shows navigation path for nested pages
 */

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on home/dashboard
  if (pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard' }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      
      // Format label (capitalize, replace hyphens)
      const label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Don't add current page if it's the last one (it's shown in page title)
      if (index < paths.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index === 0 ? (
              <Link href={crumb.href} className="hover:text-gray-900">
                <FiHome />
              </Link>
            ) : (
              <>
                <FiChevronRight className="mx-2 text-gray-400" size={16} />
                <Link href={crumb.href} className="hover:text-gray-900">
                  {crumb.label}
                </Link>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

