import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  GlobeAltIcon,
  PlusIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const CommandPalette = ({ isOpen, onClose, onCommand }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Available commands
  const commands = [
    {
      id: 'add-experience',
      title: 'Add New Experience',
      description: 'Add a new cultural experience to your journey',
      icon: PlusIcon,
      keywords: ['add', 'new', 'experience', 'create'],
      action: () => onCommand('add-experience')
    },
    {
      id: 'view-calendar',
      title: 'View Calendar',
      description: 'Navigate to the calendar view',
      icon: CalendarIcon,
      keywords: ['calendar', 'view', 'schedule', 'date'],
      action: () => onCommand('view-calendar')
    },
    {
      id: 'explore-countries',
      title: 'Explore Countries',
      description: 'Browse and discover new countries',
      icon: GlobeAltIcon,
      keywords: ['countries', 'explore', 'discover', 'browse'],
      action: () => onCommand('explore-countries')
    },
    {
      id: 'shopping-list',
      title: 'Shopping List',
      description: 'View your cultural shopping list',
      icon: ShoppingBagIcon,
      keywords: ['shopping', 'list', 'buy', 'ingredients'],
      action: () => onCommand('shopping-list')
    },
    {
      id: 'progress-dashboard',
      title: 'Progress Dashboard',
      description: 'View your cultural exploration progress',
      icon: ChartBarIcon,
      keywords: ['progress', 'dashboard', 'stats', 'analytics'],
      action: () => onCommand('progress-dashboard')
    }
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(command => {
    const searchText = query.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchText) ||
      command.description.toLowerCase().includes(searchText) ||
      command.keywords.some(keyword => keyword.includes(searchText))
    );
  });

  // Reset selection when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      default:
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Handle global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onCommand('open-command-palette');
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose, onCommand]);

  // Handle keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleItemClick = (command) => {
    command.action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-[1100] flex items-start justify-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="command-palette"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ 
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
        >
          {/* Header */}
          <div className="flex items-center px-4 py-3 border-b border-dark-border">
            <MagnifyingGlassIcon className="w-5 h-5 text-text-tertiary mr-3" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="command-palette-input"
              aria-label="Command search"
              id="command-palette-input"
            />
            <div className="command-palette-kbd">
              ⌘K
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div role="listbox" aria-labelledby="command-palette-input">
                {filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  const isSelected = index === selectedIndex;
                  
                  return (
                    <motion.div
                      key={command.id}
                      className={`command-palette-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(command)}
                      role="option"
                      aria-selected={isSelected}
                      whileHover={{ backgroundColor: 'rgba(33, 38, 45, 0.8)' }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="w-5 h-5 text-text-tertiary mr-3" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-text-primary">
                          {command.title}
                        </div>
                        <div className="text-xs text-text-tertiary">
                          {command.description}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ArrowRightIcon className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state py-8">
                <MagnifyingGlassIcon className="empty-illustration" />
                <h3 className="empty-title">No commands found</h3>
                <p className="empty-description">
                  Try adjusting your search or browse available commands
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-dark-tertiary border-t border-dark-border text-xs text-text-tertiary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="command-palette-kbd">↑↓</span>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="command-palette-kbd">↵</span>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="command-palette-kbd">esc</span>
                <span>Close</span>
              </div>
            </div>
            <div className="text-brand-primary font-medium">
              Cultural Expo
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Hook to use command palette
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export default CommandPalette;
