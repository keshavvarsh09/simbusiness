'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation'; // We'll keep the old nav for the landing page for now, or create a new MarketingNav

export default function Shell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Define routes that should use the full-screen marketing layout
    const isMarketingRoute = pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/faq') || pathname.startsWith('/contact');

    if (isMarketingRoute) {
        return (
            <div className="min-h-screen flex flex-col">
                {/* We can use a simplified Navbar for marketing pages here if needed */}
                {/* For now, let's assume the page itself handles its nav or we use the old one conditionally */}
                {pathname === '/' && <Navigation />}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    // App Layout (Sidebar + Header)
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-[80px] lg:pl-[280px] transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
