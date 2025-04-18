/**
 * Utility functions for handling image URLs
 */

// Get the image proxy URL from environment variables or use a fallback
const getImageProxyUrl = () => {
  return import.meta.env.VITE_IMAGE_PROXY_URL || 'https://api.allorigins.win/raw?url=';
};

/**
 * Get a proxied image URL to avoid CORS issues
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The proxied image URL
 */
export const getProxiedImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If the URL is already using a proxy, return it as is
  if (imageUrl.includes('wsrv.nl') || imageUrl.includes('allorigins.win')) {
    return imageUrl;
  }
  
  // Otherwise, add the proxy
  return `${getImageProxyUrl()}${encodeURIComponent(imageUrl)}`;
}; 
