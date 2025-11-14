/**
 * Image Fetcher - Fetches product images from source URLs
 * Handles Alibaba, AliExpress, IndiaMart, and other e-commerce sites
 */

/**
 * Fetch image from source URL
 * Returns the first product image found, or a placeholder if unavailable
 */
export async function fetchProductImage(sourceUrl: string): Promise<string | null> {
  if (!sourceUrl) return null;

  try {
    // For Alibaba, AliExpress, IndiaMart - we'll use their image CDN patterns
    // Since direct scraping might be blocked, we'll extract image URLs from the page
    
    // Check if URL contains image patterns
    if (sourceUrl.includes('alibaba.com') || sourceUrl.includes('aliexpress.com')) {
      // These platforms typically have images in their meta tags or structured data
      // For now, return a placeholder with the platform logo
      return `https://via.placeholder.com/300x300?text=${encodeURIComponent('Product Image')}`;
    }

    if (sourceUrl.includes('indiamart.com')) {
      return `https://via.placeholder.com/300x300?text=${encodeURIComponent('Product Image')}`;
    }

    // Try to fetch the page and extract image
    // Note: This requires a server-side proxy or CORS-enabled API
    // For client-side, we'll use a proxy endpoint
    const response = await fetch(`/api/products/fetch-image?url=${encodeURIComponent(sourceUrl)}`);
    
    if (response.ok) {
      const data = await response.json();
      return data.imageUrl || null;
    }

    return null;
  } catch (error) {
    console.error('Error fetching product image:', error);
    return null;
  }
}

/**
 * Extract image URL from HTML content
 */
export function extractImageFromHTML(html: string, sourceUrl: string): string | null {
  try {
    // Common image selectors for e-commerce sites
    const imagePatterns = [
      /<img[^>]+src=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi,
      /"image":\s*"([^"]+)"/gi,
      /"og:image":\s*"([^"]+)"/gi,
      /data-src=["']([^"']+\.(jpg|jpeg|png|webp))["']/gi, // Lazy loaded images
    ];

    for (const pattern of imagePatterns) {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        let imageUrl = matches[1] || matches[0];
        
        // Make absolute URL if relative
        if (imageUrl.startsWith('//')) {
          imageUrl = `https:${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
          const urlObj = new URL(sourceUrl);
          imageUrl = `${urlObj.origin}${imageUrl}`;
        } else if (!imageUrl.startsWith('http')) {
          const urlObj = new URL(sourceUrl);
          imageUrl = `${urlObj.origin}/${imageUrl}`;
        }

        // Filter out small icons/logos (usually < 200px)
        if (!imageUrl.includes('logo') && !imageUrl.includes('icon')) {
          return imageUrl;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting image from HTML:', error);
    return null;
  }
}

