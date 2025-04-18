/**
 * Utility function to get a proxied image URL
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  try {
    // Use wsrv.nl as the primary image proxy service
    // It's more reliable and has better caching
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url; // Fallback to original URL
  }
}; 