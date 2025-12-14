'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          This page could not be found.
        </h2>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiHome />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <FiArrowLeft />
            Go Back
          </button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
              Dashboard
            </Link>
            <Link href="/products" className="text-blue-600 hover:underline text-sm">
              Products
            </Link>
            <Link href="/chatbot" className="text-blue-600 hover:underline text-sm">
              AI Advisor
            </Link>
            <Link href="/missions" className="text-blue-600 hover:underline text-sm">
              Missions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


