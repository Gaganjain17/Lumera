/**
 * Image debugging utilities to help troubleshoot image loading issues
 */

/**
 * Logs image loading information for debugging
 * @param imageUrl - The image URL being loaded
 * @param component - The component name where the image is used
 */
export function logImageLoad(imageUrl: string, component: string): void {
  if (typeof window === 'undefined') return;
  
  console.log(`[Image Debug] Loading image in ${component}:`, {
    url: imageUrl,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  });
}

/**
 * Checks if an image URL is accessible
 * @param imageUrl - The image URL to check
 * @returns Promise<boolean> - Whether the image is accessible
 */
export async function checkImageAccessibility(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`[Image Debug] Image not accessible: ${imageUrl}`, error);
    return false;
  }
}

/**
 * Gets image loading statistics for debugging
 * @returns Object with image loading stats
 */
export function getImageLoadingStats(): { total: number; loaded: number; failed: number } {
  if (typeof window === 'undefined') return { total: 0, loaded: 0, failed: 0 };
  
  const images = document.querySelectorAll('img');
  let loaded = 0;
  let failed = 0;
  
  images.forEach(img => {
    if (img.complete) {
      if (img.naturalHeight === 0) {
        failed++;
      } else {
        loaded++;
      }
    }
  });
  
  return {
    total: images.length,
    loaded,
    failed
  };
}

/**
 * Forces a refresh of all images on the page
 * Useful for debugging image loading issues
 */
export function forceRefreshAllImages(): void {
  if (typeof window === 'undefined') return;
  
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.src;
    img.src = '';
    img.src = src;
  });
  
  console.log('[Image Debug] Forced refresh of all images');
}
