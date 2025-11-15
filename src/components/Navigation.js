import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  GlobeAltIcon, 
  PlusIcon, 
  ArrowPathIcon,
  SparklesIcon,
  CalendarIcon,
  MapPinIcon,
  ChartBarIcon,
  BookOpenIcon,
  HeartIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  PlusIcon as PlusIconSolid,
  ArrowPathIcon as ArrowPathIconSolid,
  SparklesIcon as SparklesIconSolid
} from '@heroicons/react/24/solid';

// Enhanced navigation with better information architecture
function Navigation({ currentPage, onNavigate, onAddExperience, onRandomSelect }) {
  const [activeTab, setActiveTab] = useState(currentPage);
  const [showTooltips, setShowTooltips] = useState(false);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: HomeIcon,
      activeIcon: HomeIconSolid,
      shortcut: '⌘1',
      description: 'View your cultural journey calendar and progress',
      color: 'accent-primary'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: GlobeAltIcon,
      activeIcon: GlobeAltIconSolid,
      shortcut: '⌘2',
      description: 'Discover countries and their cultures',
      color: 'accent-secondary'
    },
    {
      id: 'add-experience',
      label: 'Add Experience',
      icon: PlusIcon,
      activeIcon: PlusIconSolid,
      shortcut: '⌘E',
      description: 'Record a new cultural experience',
      color: 'accent-tertiary',
      action: onAddExperience
    },
    {
      id: 'random',
      label: 'Random',
      icon: ArrowPathIcon,
      activeIcon: ArrowPathIconSolid,
      shortcut: '⌘L',
      description: 'Discover a random country',
      color: 'accent-lavender',
      action: onRandomSelect
    }
  ];

  const handleTabClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      setActiveTab(item.id);
      onNavigate(item.id);
    }
  };

  return (
    <nav className="flex items-center space-x-2" role="tablist">
      {navigationItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => handleTabClick(item)}
          className={`relative group flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === item.id
              ? `bg-${item.color} text-white shadow-lg`
              : 'bg-dark-secondary/50 text-text-secondary hover:bg-dark-secondary hover:text-text-primary'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={() => setShowTooltips(true)}
          onMouseLeave={() => setShowTooltips(false)}
          role="tab"
          aria-selected={activeTab === item.id}
          aria-label={`${item.label} (${item.shortcut})`}
          title={`${item.label} - ${item.description}`}
        >
          {/* Icon */}
          <div className="relative">
            {activeTab === item.id ? (
              <item.activeIcon className="w-4 h-4" />
            ) : (
              <item.icon className="w-4 h-4 group-hover:text-accent-primary transition-colors" />
            )}
          </div>

          {/* Label */}
          <span className="hidden sm:inline ml-2 text-sm font-medium">
            {item.label}
          </span>

          {/* Shortcut */}
          <span className="hidden lg:inline ml-2 text-xs opacity-70">
            {item.shortcut}
          </span>

          {/* Enhanced Tooltip */}
          <AnimatePresence>
            {showTooltips && (
              <motion.div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-dark-primary/95 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap z-50 border border-dark-border shadow-xl"
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-semibold mb-1">{item.label}</div>
                <div className="text-text-secondary">{item.description}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-primary/95"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </nav>
  );
}

// Enhanced breadcrumb navigation
function BreadcrumbNavigation({ items, onNavigate }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <span className="text-text-tertiary">/</span>
          )}
          <button
            onClick={() => onNavigate(item.id)}
            className={`hover:text-text-primary transition-colors ${
              index === items.length - 1 ? 'text-text-primary font-medium' : ''
            }`}
            disabled={index === items.length - 1}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}

// Enhanced progress indicators
function ProgressIndicator({ current, total, label, color = 'accent-primary' }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium">{current} / {total}</span>
      </div>
      <div className="w-full bg-dark-tertiary rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full bg-${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Enhanced status indicators
function StatusIndicator({ status, label, icon: Icon, color = 'accent-primary' }) {
  const statusConfig = {
    completed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: StarIcon },
    inProgress: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: ClockIcon },
    pending: { color: 'text-gray-400', bg: 'bg-gray-400/10', icon: CalendarIcon },
    active: { color: `text-${color}`, bg: `bg-${color}/10`, icon: Icon }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${config.bg}`}>
      <config.icon className={`w-4 h-4 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{label}</span>
    </div>
  );
}

// Enhanced information cards
function InfoCard({ 
  title, 
  description, 
  icon: Icon, 
  color = 'accent-primary',
  action,
  actionText,
  stats,
  children 
}) {
  return (
    <motion.div 
      className="bg-dark-secondary rounded-xl p-6 border border-dark-border hover:border-accent-primary/30 transition-all duration-300"
      whileHover={{ y: -2, scale: 1.01 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-${color}/10 rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}`} />
          </div>
          <div>
            <h3 className="text-heading-4 text-text-primary font-semibold">{title}</h3>
            {description && (
              <p className="text-text-secondary text-sm mt-1">{description}</p>
            )}
          </div>
        </div>
        
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-text-primary">{stats.value}</div>
            <div className="text-xs text-text-secondary">{stats.label}</div>
          </div>
        )}
      </div>

      {children}

      {action && actionText && (
        <motion.button
          onClick={action}
          className={`mt-4 w-full btn btn-${color} group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{actionText}</span>
          <Icon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </motion.div>
  );
}

// Enhanced section headers
function SectionHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  color = 'accent-primary',
  action,
  actionText,
  badge 
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-heading-2 text-text-primary font-bold">{title}</h2>
            {badge && (
              <span className={`px-2 py-1 text-xs font-medium bg-${color}/10 text-${color} rounded-full`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-cultural-subtitle mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {action && actionText && (
        <motion.button
          onClick={action}
          className={`btn btn-${color} group`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>{actionText}</span>
          <Icon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}

export {
  Navigation,
  BreadcrumbNavigation,
  ProgressIndicator,
  StatusIndicator,
  InfoCard,
  SectionHeader
};
