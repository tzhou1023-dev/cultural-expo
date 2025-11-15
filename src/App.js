import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon,
  HomeIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import ToastProvider, { useToast } from './components/ToastProvider';
import CountrySelector from './components/CountrySelector';
import CountryDisplay from './components/CountryDisplay';
import FoodSection from './components/FoodSection';
import DrinkSection from './components/DrinkSection';
import MovieSection from './components/MovieSection';
import CulturalCalendar from './components/CulturalCalendar';
import ProgressDashboard from './components/ProgressDashboard';
import AddExperienceModal from './components/AddExperienceModal';
import MapView from './components/MapView';
import { getAllExperiences, saveExperience } from './utils/experienceManager';
import { selectRandomCountry, getAllCountries } from './utils/countrySelector';

// Global error handler to catch Object.values errors
const originalObjectValues = Object.values;
Object.values = function(obj) {
  try {
    if (obj === null || obj === undefined) {
      console.error('Object.values called with null/undefined:', obj);
      console.trace('Object.values call stack:');
      return [];
    }
    return originalObjectValues.call(this, obj);
  } catch (error) {
    console.error('Object.values error:', error);
    console.trace('Object.values error stack:');
    return [];
  }
};

const AppContent = () => {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'explore'
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [announcements, setAnnouncements] = useState('');
  
  // Explore page state
  const [exploreViewMode, setExploreViewMode] = useState('list'); // 'list' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  
  // Toast notifications
  const toast = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle shortcuts when not in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            navigateToHome();
            break;
          case '2':
            e.preventDefault();
            navigateToExplore();
            break;
          case 'e':
            e.preventDefault();
            handleAddExperience();
            break;
          case 'l':
            e.preventDefault();
            handleRandomizer();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get all countries for search
  useEffect(() => {
    const countries = getAllCountries();
    setFilteredCountries(countries);
  }, []);

  // Filter countries based on search
  useEffect(() => {
    const countries = getAllCountries();
    if (searchQuery.trim()) {
      const filtered = countries.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.region.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCountries(filtered);
      
      // Generate search suggestions
      const suggestions = countries
        .filter(country => 
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.region.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
        .map(country => ({
          name: country.name,
          region: country.region,
          flag: country.flag
        }));
      setSearchSuggestions(suggestions);
      setShowSearchSuggestions(true);
    } else {
      setFilteredCountries(countries);
      setShowSearchSuggestions(false);
    }
  }, [searchQuery]);

  // Accessibility announcements
  const announce = (message) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  };

  // Navigation handlers
  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedCountry(null);
    announce('Navigated to home page');
  };

  const navigateToExplore = () => {
    setCurrentPage('explore');
    setSelectedCountry(null);
    announce('Navigated to explore page');
  };

  const navigateToCountryDetail = (country) => {
    setSelectedCountry(country);
    setCurrentPage('explore');
    announce(`Navigated to ${country.name} details`);
  };

  // Global CTA handlers
  const handleAddExperience = (date = null) => {
    setInitialDate(date);
    setShowAddExperienceModal(true);
    announce('Opening add experience modal');
  };

  const handleRandomizer = () => {
    const randomCountry = selectRandomCountry();
    if (randomCountry) {
      navigateToCountryDetail(randomCountry);
      toast.success(`🎲 Randomly selected ${randomCountry.name}!`);
      announce(`Randomly selected ${randomCountry.name}`);
    } else {
      toast.error('No countries available for random selection');
    }
  };

  const handleCountrySelect = (country) => {
    navigateToCountryDetail(country);
    toast.success(`Welcome to ${country.name}! 🌍`);
  };

  const handleSuggestionSelect = (suggestion) => {
    const country = getAllCountries().find(c => c.name === suggestion.name);
    if (country) {
      navigateToCountryDetail(country);
      setSearchQuery('');
      setShowSearchSuggestions(false);
      toast.success(`Welcome to ${country.name}! 🌍`);
    }
  };

  const handleBackToExplore = () => {
    setSelectedCountry(null);
    announce('Returned to explore page');
  };

  // Mark country as explored
  const handleMarkAsExplored = async (country) => {
    try {
      const experience = {
        date: new Date().toISOString().split('T')[0],
        country: country,
        dishes: [],
        drinks: [],
        movies: [],
        notes: ''
      };
      
      const experienceId = saveExperience(experience);
      
      if (experienceId) {
        toast.success(`🎉 ${country.name} has been added to your cultural journey!`);
        announce(`${country.name} has been added to your cultural journey.`);
        
        setEditingExperienceId(experienceId);
        setInitialDate(new Date().toISOString().split('T')[0]);
        setShowAddExperienceModal(true);
      }
    } catch (error) {
      console.error('Error marking country as explored:', error);
      toast.error('Failed to mark country as explored');
    }
  };

  // Removed command palette handlers
  const handleExperienceAdded = (experience) => {
    toast.success(`🎉 Experience added for ${experience.country.name}!`);
    announce(`Experience added for ${experience.country.name}`);
  };

  const handleEditExperience = (experienceId) => {
    setEditingExperienceId(experienceId);
    setInitialDate(null);
    setShowAddExperienceModal(true);
    announce('Opening experience editor');
  };

  const handleDateSelect = (dateString, experiences) => {
    if (experiences.length > 0) {
      handleEditExperience(experiences[0].id);
    } else {
      handleAddExperience(dateString);
    }
  };

  // Get journey progress data
  const experiences = getAllExperiences() || [];
  const uniqueCountries = new Set(experiences.map(exp => exp.country.id)).size;
  const totalCountries = 50; // Total countries in our database
  const progressPercentage = Math.round((uniqueCountries / totalCountries) * 100);
  
  const journeyProgress = {
    uniqueCountries,
    totalCountries,
    progressPercentage
  };

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

      {/* Global Navigation Header */}
      <motion.header 
        className="bg-dark-secondary border-b border-dark-border backdrop-blur-glass sticky top-0 z-40 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        role="banner"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center space-x-4 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={navigateToHome}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigateToHome();
                }
              }}
              aria-label="Return to homepage"
              title="Click to return to homepage"
            >
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center shadow-glow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <ArrowPathIcon className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent-secondary rounded-full"
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

            {/* Global CTAs - Always Visible */}
            <nav 
              className="flex items-center space-x-4" 
              role="navigation" 
              aria-label="Primary navigation"
            >
              {/* Navigation Buttons */}
              <motion.button
                onClick={navigateToHome}
                className={`btn ${currentPage === 'home' ? 'btn-accent-primary' : 'btn-ghost'} group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Go to home page"
                title="Home (⌘1)"
              >
                <HomeIcon className="w-4 h-4 text-white group-hover:text-accent-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-1 text-sm">Home</span>
                <span className="hidden lg:inline ml-2 text-xs text-white/70">⌘1</span>
              </motion.button>

              <motion.button
                onClick={navigateToExplore}
                className={`btn ${currentPage === 'explore' ? 'btn-accent-primary' : 'btn-ghost'} group`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Go to explore page"
                title="Explore (⌘2)"
              >
                <GlobeAltIcon className="w-4 h-4 text-white group-hover:text-accent-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-1 text-sm">Explore</span>
                <span className="hidden lg:inline ml-2 text-xs text-white/70">⌘2</span>
              </motion.button>

              {/* Add Experience CTA */}
              <motion.button
                onClick={() => handleAddExperience()}
                className="btn btn-ghost group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Add new cultural experience"
                title="Add Experience (⌘E)"
              >
                <PlusIcon className="w-4 h-4 text-white group-hover:text-accent-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-1 text-sm">Add Experience</span>
                <span className="hidden lg:inline ml-2 text-xs text-white/70">⌘E</span>
              </motion.button>

              {/* Randomizer CTA */}
              <motion.button
                onClick={handleRandomizer}
                className="btn btn-ghost group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Random country selector"
                title="Random Country (⌘L)"
              >
                <ArrowPathIcon className="w-4 h-4 text-white group-hover:text-accent-primary transition-colors" aria-hidden="true" />
                <span className="hidden sm:inline ml-1 text-sm">Random</span>
                <span className="hidden lg:inline ml-2 text-xs text-white/70">⌘L</span>
              </motion.button>

              {/* Removed Command Palette */}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main 
        className="container mx-auto px-6 py-12" 
        id="main-content"
        role="main"
        aria-label="Cultural exploration content"
      >
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="flex flex-col lg:flex-row gap-12"
            >
              {/* Main Calendar Section */}
              <div className="flex-1">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
                    Your Cultural Journey
                  </h2>
                  <p className="text-lg text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
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
              </div>

              {/* Progress Sidebar */}
              <div className="lg:w-80">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <ProgressDashboard 
                    progress={journeyProgress}
                    onExploreClick={navigateToExplore}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === 'explore' && !selectedCountry && (
            <motion.div 
              key="explore"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {/* Explore Page Header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 tracking-tight">
                  Explore Countries
                </h2>
                <p className="text-lg text-text-secondary mb-12 leading-relaxed max-w-2xl mx-auto">
                  Discover fascinating cultures, cuisines, and traditions from around the world
                </p>
              </motion.div>

              {/* Toolbar */}
              <motion.div
                className="bg-dark-secondary rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="flex-1 max-w-md relative">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                        className="input pl-10 w-full focus-ring-inset"
                        aria-label="Search countries by name or region"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
                        <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Search Suggestions */}
                    <AnimatePresence>
                      {showSearchSuggestions && searchSuggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-dark-tertiary rounded-lg shadow-lg z-50"
                        >
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionSelect(suggestion)}
                              className="w-full px-4 py-3 text-left hover:bg-dark-quaternary transition-colors flex items-center space-x-3"
                            >
                              <span className="text-lg">{suggestion.flag}</span>
                              <div>
                                <div className="text-text-primary font-medium">{suggestion.name}</div>
                                <div className="text-text-secondary text-sm">{suggestion.region}</div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center bg-dark-tertiary rounded-lg p-1">
                    <button
                      onClick={() => setExploreViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        exploreViewMode === 'list'
                          ? 'bg-accent-primary text-white shadow-lg'
                          : 'text-text-secondary hover:text-text-primary hover:bg-dark-quaternary'
                      }`}
                      aria-label="List view"
                      title="List View"
                    >
                      <ListBulletIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setExploreViewMode('map')}
                      className={`p-2 rounded-md transition-colors ${
                        exploreViewMode === 'map'
                          ? 'bg-accent-primary text-white shadow-lg'
                          : 'text-text-secondary hover:text-text-primary hover:bg-dark-quaternary'
                      }`}
                      aria-label="Map view"
                      title="Map View"
                    >
                      <GlobeAltIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {exploreViewMode === 'map' ? (
                  <>
                    <MapView
                      countries={filteredCountries}
                      onCountrySelect={handleCountrySelect}
                      onClose={() => setExploreViewMode('list')}
                    />
                  </>
                ) : (
                  filteredCountries && filteredCountries.length > 0 ? (
                    <CountrySelector 
                      onCountrySelect={handleCountrySelect}
                      countries={filteredCountries}
                      onRandomSelect={handleRandomizer}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-96">
                      <div className="text-center text-text-secondary">
                        <div className="text-4xl mb-4">⏳</div>
                        <h3 className="text-lg font-semibold mb-2">Loading countries...</h3>
                        <p className="text-sm">Please wait while we prepare your cultural exploration.</p>
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            </motion.div>
          )}

          {currentPage === 'explore' && selectedCountry && (
            <motion.div 
              key="country-detail"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-8"
            >
              {/* Back Button */}
              <motion.button
                onClick={handleBackToExplore}
                className="btn btn-ghost group mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                aria-label="Back to explore page"
              >
                <ArrowPathIcon className="w-4 h-4 text-white mr-2 group-hover:text-accent-primary transition-colors" />
                Back to Explore
              </motion.button>

              {/* Country Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CountryDisplay 
                  country={selectedCountry} 
                  onMarkAsExplored={handleMarkAsExplored}
                  onAddExperience={() => handleAddExperience()}
                />
              </motion.div>
              
              {/* Cultural Sections */}
              <motion.div 
                className="space-y-16 mt-16"
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
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add Experience Modal */}
      <AddExperienceModal
        isOpen={showAddExperienceModal}
        onClose={() => setShowAddExperienceModal(false)}
        selectedDate={initialDate}
        onExperienceAdded={handleExperienceAdded}
      />
    </div>
  );
};

const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
