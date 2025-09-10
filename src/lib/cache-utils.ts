/**
 * Cache utility functions for managing image and data caches
 */

/**
 * Clears the browser's image cache by reloading images with cache busting
 * This can be called when you want to force refresh all images
 */
export function clearImageCache(): void {
  if (typeof window === 'undefined') return;
  
  // Force reload all images with cache busting
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.includes('data:')) {
      try {
        const url = new URL(src, window.location.origin);
        // Only add cache busting to placeholder images, not uploaded images
        const hostname = url.hostname.toLowerCase();
        const isPlaceholderImage = hostname.includes('placehold.co') || 
                                  hostname.includes('picsum.photos') ||
                                  hostname.includes('via.placeholder.com');
        
        if (isPlaceholderImage) {
          url.searchParams.set('cb', Date.now().toString());
          img.src = url.toString();
        } else {
          // For uploaded images, just reload without cache busting
          img.src = '';
          img.src = src;
        }
      } catch (error) {
        // If URL parsing fails, just reload the image
        img.src = '';
        img.src = src;
      }
    }
  });
}

/**
 * Clears localStorage data related to products and categories
 * This forces a fresh reload of data from the server
 */
export function clearDataCache(): void {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = [
    'lumera_products',
    'lumera_categories',
    'lumera_cart',
    'lumera_wishlist'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Reload the page to fetch fresh data
  window.location.reload();
}

/**
 * Forces a complete cache clear and page reload
 * Use this when you want to ensure all cached data is refreshed
 */
export function forceRefresh(): void {
  if (typeof window === 'undefined') return;
  
  clearDataCache();
  clearImageCache();
}
