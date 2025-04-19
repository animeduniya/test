// Debounce function for search inputs and scroll events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Image optimization helper
export const optimizeImage = (src, width = 300) => {
  if (!src) return '';
  // Add image optimization parameters based on your image service
  return `${src}?w=${width}&q=80&auto=format`;
};

// Memory management helper
export const cleanupMemory = () => {
  if (window.performance && window.performance.memory) {
    window.performance.memory.usedJSHeapSize > 1000000000 && window.gc();
  }
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Device detection
export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Performance monitoring
export const measurePerformance = (name, callback) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${name}-start`);
    callback();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  } else {
    callback();
  }
}; 