import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GlobeAltIcon, 
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

import CulturalCalendar from './components/CulturalCalendar';
import ExperienceEntry from './components/ExperienceEntry';
import { getAllExperiences } from './utils/experienceManager';

// Main App Component
const AppContent = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showSections, setShowSections] = useState(false);

  const [showExperienceEntry, setShowExperienceEntry] = useState(false);
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

  const handleDateSelect = (dateString, experiences) => {
    if (experiences.length > 0) {
      // If there are experiences on this date, allow editing the first one
      handleEditExperience(experiences[0].id);
    } else {
      // If no experiences, allow adding a new one
      handleAddExperience(dateString);
    }
  };

  // Get journey progress data
  const getJourneyProgress = () => {
    const experiences = getAllExperiences();
    const totalExperiences = experiences.length;
    const uniqueCountries = new Set(experiences.map(exp => exp.country.id)).size;
    const totalCountries = 50; // Total countries in our database
    const progressPercentage = Math.round((uniqueCountries / totalCountries) * 100);
    
    return {
      totalExperiences,
      uniqueCountries,
      totalCountries,
      progressPercentage
    };
  };

  const journeyProgress = getJourneyProgress();

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4
  };

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary">
      {/* Live region for accessibility announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
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

              {/* Journey Progress Section - Concise and Focused on Countries */}
              <motion.div
                className="max-w-4xl mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Journey Progress</h3>
                    <p className="text-gray-300">Tracking your cultural exploration across the world</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{journeyProgress.totalExperiences}</div>
                      <div className="text-gray-400 text-sm">Total Experiences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">{journeyProgress.uniqueCountries}</div>
                      <div className="text-gray-400 text-sm">Countries Explored</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">{journeyProgress.progressPercentage}%</div>
                      <div className="text-gray-400 text-sm">World Coverage</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{journeyProgress.uniqueCountries} of {journeyProgress.totalCountries} countries</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${journeyProgress.progressPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      🌍 Keep exploring to discover more cultures and traditions!
                    </p>
                  </div>
                </div>
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
                  className="space-y-12 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {[
                    <FoodSection key="food" selectedCountry={selectedCountry} />,
                    <DrinkSection key="drinks" selectedCountry={selectedCountry} />,
                    <MovieSection key="movies" selectedCountry={selectedCountry} />
                  ].map((component, index) => (
                    <motion.div
                      key={component.key}
                      className="stagger-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.4 + (index * 0.1), 
                        duration: 0.6 
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

      {/* Experience Entry Modal */}
      <ExperienceEntry
        isOpen={showExperienceEntry}
        onClose={() => setShowExperienceEntry(false)}
        experienceId={editingExperienceId}
        initialDate={initialDate}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        onCommand={handleCommand}
      />
    </div>
  );
};

// App wrapper with providers
const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
