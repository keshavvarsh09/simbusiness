'use client';

import InstagramMetricsUpload from '@/components/InstagramMetricsUpload';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function InstagramAnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <InstagramMetricsUpload />
      </div>
    </div>
  );
}

