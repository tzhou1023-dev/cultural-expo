import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GlobeAltIcon, 
  ShoppingBagIcon, 
  ChartBarIcon, 
  PlusIcon,
  HomeIcon,
  SparklesIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import ToastProvider, { useToast } from './components/ToastProvider';
import CommandPalette, { useCommandPalette } from './components/CommandPalette';
import CountrySelector from './components/CountrySelector';
import CountryDisplay from './components/CountryDisplay';
import FoodSection from './components/FoodSection';
import DrinkSection from './components/DrinkSection';
import MovieSection from './components/MovieSection';
import ShoppingList from './components/ShoppingList';
import CulturalCalendar from './components/CulturalCalendar';
import ExperienceEntry from './components/ExperienceEntry';
import ProgressDashboard from './components/ProgressDashboard';

// Main App Component
const AppContent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showSections, setShowSections] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showExperienceEntry, setShowExperienceEntry] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'country'
  const [announcements, setAnnouncements] = useState('');
  
  // Toast notifications
  const toast = useToast();
  
  // Command palette
  const commandPalette = useCommandPalette();

  // Accessibility announcements
  const announce = (message) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowSections(true);
    setViewMode('country');
    announce(`Selected ${country.name}. Cultural sections now available.`);
    toast.success(`Welcome to ${country.name}! 🌍`);
  };

  const resetSelection = () => {
    setSelectedCountry(null);
    setShowSections(false);
    setViewMode('calendar');
    announce('Returned to cultural journey calendar.');
  };

  // Command palette handlers
  const handleCommand = (command) => {
    switch (command) {
      case 'add-experience':
        handleAddExperience();
        break;
      case 'view-calendar':
        setViewMode('calendar');
        resetSelection();
        break;
      case 'explore-countries':
        setViewMode('country');
        if (selectedCountry) {
          setSelectedCountry(null);
          setShowSections(false);
        }
        break;
      case 'shopping-list':
        setShowShoppingList(true);
        break;
      case 'progress-dashboard':
        setShowProgressDashboard(true);
        break;
      case 'open-command-palette':
        commandPalette.open();
        break;
      default:
        break;
    }
  };

  const handleAddExperience = (date = null) => {
    setInitialDate(date);
    setEditingExperienceId(null);
    setShowExperienceEntry(true);
    announce('Opening experience entry form.');
  };

  const handleEditExperience = (experienceId) => {
    setEditingExperienceId(experienceId);
    setInitialDate(null);
    setShowExperienceEntry(true);
    announce('Opening experience editor.');
  };

  const handleExperienceEntryClose = (saved) => {
    setShowExperienceEntry(false);
    setEditingExperienceId(null);
    setInitialDate(null);
    if (saved) {
      announce('Experience saved successfully.');
      toast.success('Experience saved to your journey! ✨');
    } else {
      announce('Experience entry cancelled.');
    }
  };

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only handle shortcuts when no input is focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case 'n':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            handleAddExperience();
          }
          break;
        case 'h':
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            resetSelection();
          }
          break;
        case '/':
          e.preventDefault();
          commandPalette.open();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [commandPalette]);

  const handleDateSelect = (date, experiences) => {
    if (experiences.length > 0) {
      handleEditExperience(experiences[0].id);
    } else {
      handleAddExperience(date);
    }
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Skip Links for Accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        onFocus={(e) => e.target.style.top = '1.5rem'}
        onBlur={(e) => e.target.style.top = '-10rem'}
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="skip-link"
        style={{ left: '160px' }}
        onFocus={(e) => e.target.style.top = '1.5rem'}
        onBlur={(e) => e.target.style.top = '-10rem'}
      >
        Skip to navigation
      </a>

      {/* Live Region for Screen Reader Announcements */}
      <div 
        className="sr-live" 
        aria-live="polite" 
        aria-atomic="true"
        id="announcements"
      >
        {announcements}
      </div>

      {/* Modern Header */}
      <motion.header 
        className="bg-dark-secondary border-b border-dark-border backdrop-blur-glass"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="banner"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <GlobeAltIcon className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent-success rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                  Cultural Expo
                </h1>
                <p className="text-text-secondary text-sm">
                  Discover the world's rich cultures
                </p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <nav 
              className="flex items-center space-x-2" 
              role="navigation" 
              aria-label="Primary navigation"
              id="navigation"
            >
              <motion.button
                onClick={() => setShowShoppingList(true)}
                className="btn btn-ghost btn-icon group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open shopping list"
                title="Shopping List"
              >
                <ShoppingBagIcon className="w-5 h-5 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-2 text-sm">Shopping</span>
              </motion.button>

              <motion.button
                onClick={() => setShowProgressDashboard(true)}
                className="btn btn-ghost btn-icon group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View progress dashboard"
                title="Progress Dashboard"
              >
                <ChartBarIcon className="w-5 h-5 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-2 text-sm">Progress</span>
              </motion.button>

              <motion.button
                onClick={commandPalette.open}
                className="btn btn-ghost btn-icon group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open command palette"
                title="Command Palette (⌘K)"
              >
                <CommandLineIcon className="w-5 h-5 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-2 text-sm">Commands</span>
              </motion.button>

              <motion.button
                onClick={() => handleAddExperience()}
                className="btn btn-primary group relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Add new cultural experience"
                title="Add Experience (⌘N)"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-secondary to-brand-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="buttonBg"
                />
                <PlusIcon className="w-4 h-4 relative z-10" aria-hidden="true" />
                <span className="hidden sm:inline ml-1 text-sm relative z-10">Add Experience</span>
              </motion.button>

              {viewMode === 'country' && (
                <motion.button
                  onClick={resetSelection}
                  className="btn btn-secondary group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Return to calendar view"
                  title="Back to Calendar (⌘H)"
                >
                  <HomeIcon className="w-4 h-4 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                  <span className="hidden sm:inline ml-1 text-sm">Home</span>
                </motion.button>
              )}

              {viewMode === 'calendar' && (
                <motion.button
                  onClick={() => setViewMode('country')}
                  className="btn btn-secondary group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Explore countries"
                  title="Explore Countries"
                >
                  <SparklesIcon className="w-4 h-4 group-hover:text-brand-primary transition-colors" aria-hidden="true" />
                  <span className="hidden sm:inline ml-1 text-sm">Explore</span>
                </motion.button>
              )}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main 
        className="container mx-auto px-4 py-8" 
        id="main-content"
        role="main"
        aria-label="Cultural exploration content"
      >
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div 
              key="calendar"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
                  Your Cultural Journey
                </h2>
                <p className="text-lg text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto">
                  Track your cultural experiences and discover new traditions through our interactive calendar
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <CulturalCalendar
                  onDateSelect={handleDateSelect}
                  onAddExperience={handleAddExperience}
                  onEditExperience={handleEditExperience}
                />
              </motion.div>
            </motion.div>
          ) : viewMode === 'country' && !selectedCountry ? (
            <motion.div 
              key="country-selector"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-center py-16"
            >
              <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Embark on a Cultural Journey
                </motion.h2>
                <motion.p 
                  className="text-xl text-text-secondary mb-12 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Discover fascinating traditions, delicious cuisines, and captivating stories 
                  from countries around the globe. Let curiosity be your guide!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <CountrySelector onCountrySelect={handleCountrySelect} />
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="country-details"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CountryDisplay country={selectedCountry} />
              </motion.div>
              
              {showSections && (
                <motion.div 
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {[
                    <FoodSection key="food" selectedCountry={selectedCountry} />,
                    <DrinkSection key="drinks" country={selectedCountry} />,
                    <MovieSection key="movies" country={selectedCountry} />
                  ].map((component, index) => (
                    <motion.div
                      key={component.key}
                      className="stagger-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.4 + (index * 0.1), 
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    >
                      {component}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <motion.footer 
        className="bg-dark-secondary border-t border-dark-border py-12 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <GlobeAltIcon className="w-6 h-6 text-brand-primary" />
              <span className="text-text-primary font-semibold">Cultural Expo</span>
            </motion.div>
            <p className="text-text-secondary mb-2">
              Bringing the world closer, one culture at a time
            </p>
            <div className="flex items-center justify-center space-x-4 text-text-tertiary text-sm">
              <span>Explore</span>
              <span>•</span>
              <span>Learn</span>
              <span>•</span>
              <span>Connect</span>
            </div>
            <motion.div 
              className="mt-6 flex justify-center space-x-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-brand-primary rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Enhanced Modals */}
      <AnimatePresence>
        {showShoppingList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShoppingList 
              isOpen={showShoppingList} 
              onClose={() => setShowShoppingList(false)} 
            />
          </motion.div>
        )}
        
        {showExperienceEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExperienceEntry
              isOpen={showExperienceEntry}
              onClose={handleExperienceEntryClose}
              experienceId={editingExperienceId}
              initialDate={initialDate}
            />
          </motion.div>
        )}
        
        {showProgressDashboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressDashboard
              isOpen={showProgressDashboard}
              onClose={() => setShowProgressDashboard(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        onCommand={handleCommand}
      />
    </div>
  );
};

// Main App Component with Providers
function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
