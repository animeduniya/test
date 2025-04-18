import axios from 'axios';

export const proxyImage = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const base64 = Buffer.from(response.data).toString('base64');
    return `data:${response.headers['content-type']};base64,${base64}`;
  } catch (error) {
    console.error('Error proxying image:', error);
    return url; // Fallback to original URL
  }
}; 