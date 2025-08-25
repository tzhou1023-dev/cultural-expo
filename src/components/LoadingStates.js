import React from 'react';
import { motion } from 'framer-motion';

// Skeleton component for loading placeholder
export const Skeleton = ({ className = '', width, height, ...props }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
};

// Shimmer loading component
export const Shimmer = ({ className = '', children, ...props }) => {
  return (
    <div className={`shimmer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card skeleton for loading cards
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex space-x-2 mt-4">
          <Skeleton className="h-8 w-16 rounded-button" />
          <Skeleton className="h-8 w-20 rounded-button" />
        </div>
      </div>
    </div>
  );
};

// List skeleton for loading lists
export const ListSkeleton = ({ count = 5, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      ))}
    </div>
  );
};

// Spinner component
export const Spinner = ({ size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
      {...props}
    >
      <svg
        className="w-full h-full text-brand-primary"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
};

// Pulse loader
export const PulseLoader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const dotVariants = {
    initial: { scale: 1, opacity: 0.7 },
    animate: { scale: 1.2, opacity: 1 }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`${sizeClasses[size]} bg-brand-primary rounded-full`}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Progress bar component
export const ProgressBar = ({ 
  progress = 0, 
  className = '', 
  showLabel = false,
  animated = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-secondary">Progress</span>
          <span className="text-sm font-medium text-text-primary">{progress}%</span>
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  );
};

// Loading overlay component
export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  message = "Loading...",
  spinner = true,
  className = ''
}) => {
  if (!isLoading) return children;

  return (
    <div className={`relative ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 bg-dark-primary bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-center">
          {spinner && <Spinner size="lg" className="mb-4" />}
          <p className="text-text-secondary">{message}</p>
        </div>
      </motion.div>
    </div>
  );
};

// Pulse loading for text content
export const TextSkeleton = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          className={`h-4 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

// Image skeleton with fade-in
export const ImageSkeleton = ({ 
  src, 
  alt, 
  className = '',
  skeletonClassName = '',
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-dark-tertiary flex items-center justify-center ${className}`}>
        <span className="text-text-tertiary text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <Skeleton className={`absolute inset-0 ${skeletonClassName}`} />
      )}
      <motion.img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    </div>
  );
};

export default {
  Skeleton,
  Shimmer,
  CardSkeleton,
  ListSkeleton,
  Spinner,
  PulseLoader,
  ProgressBar,
  LoadingOverlay,
  TextSkeleton,
  ImageSkeleton
};
