import React, { useState } from 'react';
import { getImageUrl } from '../utils/corsProxy';

const Image = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

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
        src={getImageUrl(src)}
        alt={alt}
        onError={() => setError(true)}
        onLoad={() => setLoading(false)}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default Image; 