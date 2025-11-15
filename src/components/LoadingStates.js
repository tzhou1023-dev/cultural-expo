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

// Enhanced Spinner with cultural theme
export const Spinner = ({ size = "md", className = "", message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-accent-primary/20 border-t-accent-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <motion.p 
          className="mt-3 text-text-secondary text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
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

// Enhanced loading overlay
export const LoadingOverlay = ({ message = "Loading your cultural journey...", showProgress = false, progress = 0 }) => (
  <motion.div
    className="fixed inset-0 bg-dark-primary/90 backdrop-blur-sm z-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center max-w-md mx-auto p-8">
      <motion.div
        className="w-20 h-20 mx-auto mb-6"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-full h-full border-4 border-accent-primary/20 border-t-accent-primary rounded-full" />
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold text-text-primary mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.h3>
      
      {showProgress && (
        <motion.div 
          className="w-full bg-dark-tertiary rounded-full h-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="bg-accent-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </div>
  </motion.div>
);

// Progress indicator for long operations
export const ProgressIndicator = ({ current, total, message }) => (
  <div className="flex items-center space-x-4 p-4 bg-dark-secondary rounded-lg border border-dark-border">
    <div className="flex-1">
      <div className="flex justify-between text-sm text-text-secondary mb-1">
        <span>{message}</span>
        <span>{current} / {total}</span>
      </div>
      <div className="w-full bg-dark-tertiary rounded-full h-2">
        <motion.div
          className="bg-accent-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  </div>
);

// Empty state component
export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionText 
}) => (
  <motion.div 
    className="text-center py-12"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="w-16 h-16 mx-auto mb-6 bg-dark-secondary rounded-full flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
    >
      <Icon className="w-8 h-8 text-accent-primary" />
    </motion.div>
    
    <h3 className="text-xl font-semibold text-text-primary mb-2">
      {title}
    </h3>
    
    <p className="text-text-secondary mb-6 max-w-md mx-auto">
      {description}
    </p>
    
    {action && actionText && (
      <motion.button
        onClick={action}
        className="btn btn-accent-primary"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {actionText}
      </motion.button>
    )}
  </motion.div>
);

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

// Skeleton loader for country cards
export const CountryCardSkeleton = () => (
  <motion.div 
    className="bg-dark-secondary rounded-xl p-6 border border-dark-border"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-dark-tertiary rounded-lg animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-dark-tertiary rounded animate-pulse mb-2" />
        <div className="h-3 bg-dark-tertiary rounded animate-pulse w-2/3" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-dark-tertiary rounded animate-pulse" />
      <div className="h-3 bg-dark-tertiary rounded animate-pulse w-4/5" />
    </div>
  </motion.div>
);

// Skeleton loader for calendar
export const CalendarSkeleton = () => (
  <div className="grid grid-cols-7 gap-2">
    {Array.from({ length: 35 }).map((_, i) => (
      <motion.div
        key={i}
        className="h-16 bg-dark-secondary rounded-lg animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.02 }}
      />
    ))}
  </div>
);

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
  ImageSkeleton,
  CountryCardSkeleton,
  CalendarSkeleton,
  ProgressIndicator,
  EmptyState
};
