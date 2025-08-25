import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  selectRandomCountry, 
  getAllCountries, 
  getSelectionStats,
  getRegionStats 
} from '../utils/countrySelector';
import { Spinner, ProgressBar } from './LoadingStates';

function CountrySelector({ onCountrySelect }) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [stats, setStats] = useState({});
  const [regionStats, setRegionStats] = useState({});
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate loading for better UX
    const loadData = async () => {
      setIsLoading(true);
      
      // Add small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const countries = getAllCountries();
      const selectionStats = getSelectionStats();
      const regions = getRegionStats();
      
      setAllCountries(countries);
      setStats(selectionStats);
      setRegionStats(regions);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const handleRandomSelection = useCallback(() => {
    setIsShuffling(true);
    
    // Add a delay for the shuffling animation
    setTimeout(() => {
      const selectedCountry = selectRandomCountry();
      setIsShuffling(false);
      
      // Update stats after selection
      const newStats = getSelectionStats();
      setStats(newStats);
      
      onCountrySelect(selectedCountry);
    }, 1500);
  }, [onCountrySelect]);

  const handleDirectSelection = useCallback((country) => {
    onCountrySelect(country);
  }, [onCountrySelect]);

  // Memoized filtered countries for performance
  const filteredCountries = useMemo(() => {
    let countries = allCountries;
    
    // Filter by region
    if (selectedRegion !== 'All') {
      countries = countries.filter(country => country.region === selectedRegion);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      countries = countries.filter(country => 
        country.name.toLowerCase().includes(query) ||
        country.region.toLowerCase().includes(query)
      );
    }
    
    return countries;
  }, [allCountries, selectedRegion, searchQuery]);

  const regions = useMemo(() => {
    return ['All', ...Object.keys(regionStats).sort()];
  }, [regionStats]);

  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'bg-red-500';
    if (percentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="text-center max-w-6xl mx-auto py-16">
        <div className="mb-8">
          <Spinner size="xl" className="mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Loading Cultural Explorer
          </h2>
          <p className="text-text-secondary">
            Preparing your journey through world cultures...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center max-w-6xl mx-auto">
      {/* Main Discovery Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <motion.div 
            className="inline-block text-8xl mb-6"
            animate={isShuffling ? {
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 0.9, 1.1, 1]
            } : {
              y: [0, -10, 0]
            }}
            transition={isShuffling ? {
              duration: 0.3,
              repeat: 5,
              ease: "easeInOut"
            } : {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {isShuffling ? '🎲' : '🌍'}
          </motion.div>
          
          {/* Progress Stats */}
          <motion.div 
            className="glass mb-6 p-6 max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h3 className="text-sm font-medium text-text-secondary mb-3">
              Exploration Progress
            </h3>
            <ProgressBar
              progress={stats.completionPercentage || 0}
              animated={true}
              showLabel={false}
              className="mb-3"
            />
            <div className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">
                {stats.countriesExplored || 0}
              </span>
              {' '} of {' '}
              <span className="font-semibold text-text-primary">
                {stats.totalCountries || 0}
              </span>
              {' '} countries explored
              <AnimatePresence>
                {stats.cycleComplete && (
                  <motion.span 
                    className="ml-2 text-accent-success font-semibold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    🎉 Cycle Complete!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.button
            onClick={handleRandomSelection}
            disabled={isShuffling}
            className="btn btn-primary text-lg px-8 py-4 focus-ring"
            whileHover={{ scale: isShuffling ? 1 : 1.05 }}
            whileTap={{ scale: isShuffling ? 1 : 0.95 }}
            aria-label="Discover a random culture"
            style={{ willChange: 'transform' }}
          >
            <AnimatePresence mode="wait">
              {isShuffling ? (
                <motion.div
                  key="shuffling"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <motion.span 
                    className="inline-block mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🎲
                  </motion.span>
                  Discovering Amazing Culture...
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <span className="mr-2">🎯</span>
                  Discover Random Culture
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Toggle Country Grid */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <motion.button
          onClick={() => setShowAllCountries(!showAllCountries)}
          className="btn btn-secondary focus-ring"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-expanded={showAllCountries}
          aria-controls="country-grid"
        >
          {showAllCountries ? 'Hide' : 'Show'} All Countries ({allCountries.length})
        </motion.button>
      </motion.div>

      {/* Country Grid */}
      <AnimatePresence>
        {showAllCountries && (
          <motion.div
            id="country-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* Search and Filter Section */}
            <motion.div 
              className="mb-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              {/* Search Input */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 focus-ring-inset"
                    aria-label="Search countries by name or region"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
                    🔍
                  </div>
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Filter by Region:
                </h3>
                <div className="flex flex-wrap justify-center gap-2" role="tablist">
                  {regions.map((region) => (
                    <motion.button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-ring ${
                        selectedRegion === region
                          ? 'bg-brand-primary text-white shadow-glow'
                          : 'bg-dark-tertiary text-text-secondary hover:bg-dark-border hover:text-text-primary'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      role="tab"
                      aria-selected={selectedRegion === region}
                      aria-label={`Filter by ${region} region`}
                    >
                      {region} {region !== 'All' && `(${regionStats[region] || 0})`}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Countries Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <motion.button
                    key={country.id}
                    onClick={() => handleDirectSelection(country)}
                    className="card-interactive p-4 group focus-ring"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: Math.min(index * 0.05, 1), 
                      duration: 0.3 
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -4
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Select ${country.name} in ${country.region}`}
                    style={{ willChange: 'transform' }}
                  >
                    <motion.div 
                      className="text-3xl mb-2"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {country.flag}
                    </motion.div>
                    <div className="text-sm font-medium text-text-primary leading-tight mb-1">
                      {country.name}
                    </div>
                    <div className="text-xs text-text-tertiary">
                      {country.region}
                    </div>
                  </motion.button>
                ))
              ) : (
                <motion.div
                  className="col-span-full empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="empty-illustration">🔍</div>
                  <h3 className="empty-title">No countries found</h3>
                  <p className="empty-description">
                    Try adjusting your search or filter criteria
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Region Statistics */}
            <motion.div 
              className="glass p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center justify-center">
                <span className="mr-2">🌍</span>
                Global Distribution
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Object.entries(regionStats).map(([region, count], index) => (
                  <motion.div 
                    key={region} 
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="text-3xl font-bold text-brand-primary mb-1">
                      {count}
                    </div>
                    <div className="text-sm font-medium text-text-secondary">
                      {region}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cultural Fact */}
      <motion.div 
        className="mt-12 glass p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <h3 className="text-lg font-semibold mb-3 text-text-primary flex items-center justify-center">
          <span className="mr-2">🌟</span>
          Did You Know?
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl mx-auto">
          Our database includes <strong className="text-brand-primary">{allCountries.length} countries</strong> from all continents, 
          each with unique culinary traditions, cultural practices, and cinematic heritage. 
          Start your journey of discovery and explore the rich diversity of our world!
        </p>
      </motion.div>
    </div>
  );
}

export default CountrySelector;