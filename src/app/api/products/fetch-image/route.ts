/**
 * Product Image Fetcher API
 * Fetches product images from source URLs (server-side proxy)
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractImageFromHTML } from '@/lib/image-fetcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceUrl = searchParams.get('url');

    if (!sourceUrl) {
      return NextResponse.json(
        { error: 'Source URL is required' },
        { status: 400 }
      );
    }

    // Fetch the page
    try {
      const response = await fetch(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const imageUrl = extractImageFromHTML(html, sourceUrl);

      if (imageUrl) {
        return NextResponse.json({ imageUrl });
      }

      // If no image found, return placeholder
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/300x300?text=${encodeURIComponent('Product')}`
      });
    } catch (error: any) {
      console.error('Error fetching image:', error);
      
      // Return placeholder on error
      return NextResponse.json({
        imageUrl: `https://via.placeholder.com/300x300?text=${encodeURIComponent('Product')}`
      });
    }
  } catch (error: any) {
    console.error('Image fetcher error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error.message },
      { status: 500 }
    );
  }
}

