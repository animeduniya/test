/**
 * Utility function to get a proxied image URL
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  
  try {
    // Try multiple proxy services as fallback
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://api.codetabs.com/v1/proxy?quest=${url}`,
      url // Fallback to original URL if all proxies fail
    ];

    // Return the first proxy URL
    return proxyUrls[0];
  } catch (error) {
    console.error('Error processing image URL:', error);
    return url; // Fallback to original URL
  }
}; 