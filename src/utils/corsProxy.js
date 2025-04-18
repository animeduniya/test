/**
 * Utility function to get a proxied image URL
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  try {
    // For all domains including skyanime.site, use images.weserv.nl
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=500&h=750&fit=cover&output=webp`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url; // Fallback to original URL
  }
}; 