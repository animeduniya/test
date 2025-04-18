import React, { useState, useEffect } from 'react';
import { proxyImage } from '../api/imageProxy';

const Image = ({ src, alt, className, ...props }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const proxiedUrl = await proxyImage(src);
        setImageUrl(proxiedUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadImage();
  }, [src]);

  if (error) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        onError={() => setError(true)}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default Image; 