/**
 * Utility function to get a proxied image URL
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  try {
    // Handle dark-texture.png specifically
    if (url.includes('dark-texture.png')) {
      return '/dark-texture.png'; // Use local fallback
    }
    
    // Check if the URL is from skyanime.site
    if (url.includes('skyanime.site')) {
      // Use a different proxy service for skyanime.site
      return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }
    
    // For other domains, use images.weserv.nl
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=500&h=750&fit=cover&output=webp`;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url; // Fallback to original URL
  }
}; 