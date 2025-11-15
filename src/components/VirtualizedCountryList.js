import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

const CountryCard = React.memo(({ country, onCountrySelect, index }) => {
  if (!country || !country.name) {
    return null;
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      <motion.button
        onClick={() => onCountrySelect(country)}
        className="w-full bg-dark-secondary hover:bg-dark-tertiary rounded-lg p-4 transition-all duration-200 border border-dark-border hover:border-accent-primary/30 group h-full"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Explore ${country.name}`}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-3xl">{country.flag}</div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-accent-primary transition-colors">
                {country.name}
              </h3>
              <p className="text-sm text-text-secondary">{country.region}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ChevronRightIcon className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary transition-colors opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
});

CountryCard.displayName = 'CountryCard';

const VirtualizedCountryList = ({ countries = [], onCountrySelect }) => {
  // Safety check for countries array
  if (!countries || !Array.isArray(countries) || countries.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center text-text-secondary">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-lg font-semibold mb-2">No countries available</h3>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {countries.map((country, index) => (
          <CountryCard
            key={country.id || country.name || index}
            country={country}
            onCountrySelect={onCountrySelect}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default VirtualizedCountryList;
