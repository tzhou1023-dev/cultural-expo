import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Lazy Image Component
export const LazyImage = ({ src, alt, className = '', placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjM0I0NTUiLz4KPHN2ZyB4PSIxMDAiIHk9IjEwMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjc3ODhBIiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptLTIgMTVsLTUtNSAxLjQxLTEuNDFMMTAgMTQuMTdsNy41OS03LjU5TDE5IDhsLTkgOXoiLz4KPC9zdmc+Cg==' }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (inView && !imageLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        setImageLoaded(true);
      };
      img.src = src;
    }
  }, [inView, src, imageLoaded]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: imageLoaded ? 1 : 0.3 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-50'
        }`}
        loading="lazy"
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-dark-tertiary animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

// Lazy Content Component
export const LazyContent = ({ children, threshold = 0.1, rootMargin = '50px' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold,
    rootMargin
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

// Lazy Section Component
export const LazySection = ({ children, className = '', delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px'
  });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
};

// Progressive Loading Component
export const ProgressiveLoader = ({ items, renderItem, batchSize = 10, delay = 100 }) => {
  const [visibleItems, setVisibleItems] = useState(batchSize);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visibleItems < items.length) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setVisibleItems(prev => Math.min(prev + batchSize, items.length));
        setIsLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [visibleItems, items.length, batchSize, delay]);

  return (
    <div>
      <div className="space-y-4">
        {items.slice(0, visibleItems).map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
      
      {isLoading && (
        <motion.div
          className="flex justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}
      
      {visibleItems < items.length && !isLoading && (
        <motion.button
          onClick={() => setVisibleItems(prev => Math.min(prev + batchSize, items.length))}
          className="w-full py-3 bg-dark-secondary hover:bg-dark-tertiary rounded-lg transition-colors text-white font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Load More ({items.length - visibleItems} remaining)
        </motion.button>
      )}
    </div>
  );
};

// Skeleton Loading Components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-dark-secondary rounded-lg p-4 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-dark-tertiary rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-dark-tertiary rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-dark-tertiary rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-dark-tertiary rounded animate-pulse ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

export const SkeletonImage = ({ className = '' }) => (
  <div className={`bg-dark-tertiary rounded-lg animate-pulse ${className}`}>
    <div className="w-full h-48 bg-dark-secondary rounded-lg"></div>
  </div>
);
