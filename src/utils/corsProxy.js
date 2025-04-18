/**
 * Utility function to get a proxied image URL using api.allorigins.win
 * @param {string} url - The original image URL
 * @returns {string} - The proxied URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}; 