/**
 * Image utility functions for cache busting and optimization
 */

/**
 * Adds a cache busting parameter to image URLs to prevent stale image caching
 * @param imageUrl - The original image URL
 * @param forceRefresh - Whether to force a refresh (default: false)
 * @returns The image URL with cache busting parameter
 */
export function addCacheBusting(imageUrl: string, forceRefresh: boolean = false): string {
  if (!imageUrl) return imageUrl;
  
  // If it's already a data URL or relative URL, return as is
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  try {
    const url = new URL(imageUrl);
    
    // Don't add cache busting to uploaded images or real product images
    // Only add cache busting to placeholder images (placehold.co, picsum.photos)
    const hostname = url.hostname.toLowerCase();
    const isPlaceholderImage = hostname.includes('placehold.co') || 
                              hostname.includes('picsum.photos') ||
                              hostname.includes('via.placeholder.com');
    
    if (!isPlaceholderImage) {
      // For real uploaded images, return as is to avoid breaking them
      return imageUrl;
    }
    
    // Add cache busting parameter only for placeholder images
    const cacheBuster = forceRefresh ? Date.now() : Math.floor(Date.now() / (1000 * 60 * 5)); // 5-minute cache
    url.searchParams.set('cb', cacheBuster.toString());
    
    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn('Failed to parse image URL for cache busting:', imageUrl);
    return imageUrl;
  }
}

/**
 * Generates responsive image sizes for different breakpoints
 */
export const responsiveImageSizes = {
  mobile: '(max-width: 768px) 100vw',
  tablet: '(max-width: 1024px) 50vw',
  desktop: '33vw',
  full: '100vw'
};

/**
 * Common image sizes for different use cases
 */
export const imageSizes = {
  thumbnail: 150,
  small: 300,
  medium: 600,
  large: 900,
  xlarge: 1200,
  hero: 1920
} as const;

/**
 * Gets the appropriate image size based on the container and device
 * @param containerSize - The size of the container
 * @param isMobile - Whether the device is mobile
 * @returns The appropriate image size
 */
export function getOptimalImageSize(containerSize: keyof typeof imageSizes, isMobile: boolean = false): number {
  const baseSize = imageSizes[containerSize];
  
  // For mobile devices, use smaller sizes to save bandwidth
  if (isMobile && baseSize > 600) {
    return Math.min(baseSize, 600);
  }
  
  return baseSize;
}
