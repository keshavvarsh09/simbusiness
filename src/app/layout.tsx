import '@/styles/globals.css';
import type { Metadata } from 'next';
import Shell from '@/components/Shell';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE || 'SimBusiness - Dropshipping Business Simulation',
  description: 'Learn and practice dropshipping business strategies with our interactive simulation platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-background text-gray-900">
        <Shell>
          {children}
        </Shell>
      </body>
    </html>
  );
} 