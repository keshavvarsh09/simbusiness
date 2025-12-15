'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import ProductInventoryManager from '@/components/ProductInventoryManager';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function InventoryPage() {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/auth/signin');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-background pt-20">
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <Breadcrumbs />
                <ProductInventoryManager />
            </main>
        </div>
    );
}
