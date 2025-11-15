import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GlobeAltIcon, 
  MapPinIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  CurrencyDollarIcon, 
  UserIcon, 
  FilmIcon, 
  MusicalNoteIcon, 
  SwatchIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

function CountryDisplay({ country, onMarkAsExplored, onAddExperience }) {
  const [isMarkingExplored, setIsMarkingExplored] = useState(false);

  const handleMarkAsExplored = async () => {
    setIsMarkingExplored(true);
    try {
      if (onMarkAsExplored) {
        await onMarkAsExplored(country);
      }
    } finally {
      setIsMarkingExplored(false);
    }
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 py-8 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Compact Hero Section */}
      <section className="text-center space-y-6" aria-labelledby="country-hero">
        <motion.div 
          className="text-6xl mb-4 animate-bounce-gentle"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          role="img"
          aria-label={`Flag of ${country.name}`}
        >
          {country.flag}
        </motion.div>
        
        <div className="space-y-3">
          <h1 
            id="country-hero"
            className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight"
          >
            {country.name}
          </h1>
          
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-full">
            <GlobeAltIcon className="w-4 h-4 text-blue-400 mr-2" aria-hidden="true" />
            <span className="text-sm font-medium text-gray-200">{country.region}</span>
          </div>
          
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {country.description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-3 pt-2">
            <motion.button
              onClick={handleMarkAsExplored}
              disabled={isMarkingExplored}
              className="btn btn-primary text-sm px-4 py-2 focus-ring"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Mark country as explored"
            >
                              <CheckCircleIcon className="w-4 h-4 mr-2 text-white" />
              {isMarkingExplored ? 'Marking...' : 'Mark as Explored'}
            </motion.button>
            
            <motion.button
              onClick={() => onAddExperience && onAddExperience(country)}
              className="btn btn-accent-primary text-sm px-4 py-2 focus-ring"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Add cultural experience"
            >
                              <PlusIcon className="w-4 h-4 mr-2 text-white" />
              Add Experience
            </motion.button>
          </div>
        </div>
      </section>
      
      {/* Compact Information Grid */}
      <section className="space-y-6" aria-labelledby="country-info">
        <h2 id="country-info" className="sr-only">Country Information</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Capital City */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="capital-heading"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-accent-primary/20 rounded-lg flex items-center justify-center mr-3">
                <MapPinIcon className="w-4 h-4 text-accent-primary" aria-hidden="true" />
              </div>
              <h3 id="capital-heading" className="text-sm font-semibold text-white">Capital</h3>
            </div>
            <p className="text-lg font-bold text-accent-primary">{country.capital}</p>
          </motion.div>
          
          {/* Population */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="population-heading"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-accent-secondary/20 rounded-lg flex items-center justify-center mr-3">
                <UsersIcon className="w-4 h-4 text-accent-secondary" aria-hidden="true" />
              </div>
              <h3 id="population-heading" className="text-sm font-semibold text-white">Population</h3>
            </div>
            <p className="text-lg font-bold text-accent-secondary">{country.population}</p>
          </motion.div>
          
          {/* Language */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="language-heading"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-accent-tertiary/20 rounded-lg flex items-center justify-center mr-3">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-accent-tertiary" aria-hidden="true" />
              </div>
              <h3 id="language-heading" className="text-sm font-semibold text-white">Language</h3>
            </div>
            <p className="text-lg font-bold text-accent-tertiary">{country.language}</p>
          </motion.div>
          
          {/* Currency */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="currency-heading"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-accent-lavender/20 rounded-lg flex items-center justify-center mr-3">
                <CurrencyDollarIcon className="w-4 h-4 text-accent-lavender" aria-hidden="true" />
              </div>
              <h3 id="currency-heading" className="text-sm font-semibold text-white">Currency</h3>
            </div>
            <p className="text-lg font-bold text-accent-lavender">{country.currency}</p>
          </motion.div>
          
          {/* Geographic Region */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="region-heading"
          >
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-accent-violet/20 rounded-lg flex items-center justify-center mr-3">
                <UserIcon className="w-4 h-4 text-accent-violet" aria-hidden="true" />
              </div>
              <h3 id="region-heading" className="text-sm font-semibold text-white">Region</h3>
            </div>
            <p className="text-lg font-bold text-accent-violet">{country.region}</p>
          </motion.div>
        </div>
      </section>
      
      {/* Compact Call to Action */}
      <section className="text-center space-y-4" aria-labelledby="explore-cta">
        <h2 id="explore-cta" className="sr-only">Explore Culture</h2>
        
        <motion.div 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-hover hover:to-accent-tertiary rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-accent-primary/50 focus:ring-offset-2 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          tabIndex="0"
          role="button"
          aria-label={`Explore ${country.name}'s culture`}
        >
          <SwatchIcon className="w-5 h-5 mr-2 text-white" aria-hidden="true" />
          <span className="text-base">Ready to explore {country.name}'s culture?</span>
        </motion.div>
        
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          Scroll down to discover traditional foods, beverages, and films from {country.name}
        </p>
      </section>
    </motion.div>
  );
}

export default CountryDisplay;