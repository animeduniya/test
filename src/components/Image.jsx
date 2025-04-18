import React, { useState } from 'react';
import { getImageUrl } from '../utils/corsProxy';

const Image = ({ src, alt, className, fallbackSrc = '/placeholder.png', ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(getImageUrl(src));

  const handleError = () => {
    if (!error) {
      // Try the fallback URL first
      setCurrentSrc(fallbackSrc);
      setError(true);
    } else {
      // If fallback also fails, show error state
      setLoading(false);
    }
  };

  if (error && currentSrc === fallbackSrc) {
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
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={() => setLoading(false)}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default Image; 