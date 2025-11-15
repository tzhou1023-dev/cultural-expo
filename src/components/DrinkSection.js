import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BeakerIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

// Import the comprehensive drinks database
import drinksData from '../data/drinks.json';

function DrinkSection({ selectedCountry }) {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.id) {
      setDrinks(drinksData[selectedCountry.id] || []);
      setSelectedDrink(null);
    } else {
      setDrinks([]);
      setSelectedDrink(null);
    }
  }, [selectedCountry]);

  // Early return if no country is selected
  if (!selectedCountry || !selectedCountry.id) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🍹</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Traditional Drinks</h3>
          <p className="text-gray-400">Select a country to explore its beverages</p>
        </div>
      </div>
    );
  }

  const getTemperatureIcon = (temperature) => {
    if (temperature.includes('Hot')) return <span className="text-red-400 text-lg">🔥</span>;
    if (temperature.includes('Cold')) return <span className="text-blue-400 text-lg">❄️</span>;
    if (temperature.includes('Chilled')) return <span className="text-blue-400 text-lg">🧊</span>;
    return <span className="text-gray-400 text-lg">🌡️</span>;
  };



  const handleCardClick = (drinkId) => {
    setSelectedDrink(selectedDrink === drinkId ? null : drinkId);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center">
          <span className="mr-3">🍹</span>
          Traditional Drinks
        </h3>
        <p className="text-gray-300 text-lg">
          Discover authentic beverages and cocktails from {selectedCountry.name}
        </p>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {drinks.map((drink, index) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="relative"
            >
              <motion.div
                className={`bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                  selectedDrink === drink.id
                    ? 'border-2 border-blue-400 bg-blue-400/20 shadow-lg'
                    : 'border border-gray-700/50 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-400/20 focus:border-2 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-400/20'
                }`}
                whileHover={{ y: -5 }}
                onClick={() => handleCardClick(drink.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(drink.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={selectedDrink === drink.id}
                aria-label={`${drink.name} - Click to ${selectedDrink === drink.id ? 'collapse' : 'expand'} details`}
              >
                {/* Drink Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{drink.emoji}</div>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2">{drink.name}</h4>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{drink.description}</p>

                  {/* Quick Info */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div className="flex items-center space-x-2">
                      {getTemperatureIcon(drink.temperature)}
                      <span>{drink.temperature}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {drink.alcohol_content !== 'non-alcoholic' && (
                        <BeakerIcon className="w-4 h-4 text-white" />
                      )}
                      <span>{drink.alcohol_content}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Drink Content */}
                <AnimatePresence>
                  {selectedDrink === drink.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-blue-400/20 bg-blue-400/5"
                    >
                      <div className="p-6 space-y-6">
                        {/* Origin Story */}
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
                          <h5 className="text-lg font-semibold mb-2 text-blue-300 flex items-center space-x-2">
                            <span>📖</span>
                            <span>Cultural Story</span>
                          </h5>
                          <p className="text-blue-200 text-sm leading-relaxed">
                            {drink.origin_story}
                          </p>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
                          <h5 className="text-lg font-semibold mb-3 text-green-300 flex items-center space-x-2">
                            <span>🥄</span>
                            <span>Ingredients</span>
                          </h5>
                          <div className="space-y-2">
                            {drink.ingredients.map((ingredient, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="text-green-200 font-medium">{ingredient.item}</span>
                                <div className="flex items-center space-x-3 text-green-300">
                                  <span>{ingredient.quantity}</span>
                                  <span className="text-green-400">({ingredient.quantity_imperial})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Serving Details */}
                        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                          <h5 className="text-lg font-semibold mb-3 text-purple-300 flex items-center space-x-2">
                            <span>🍷</span>
                            <span>Serving</span>
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-purple-200 font-medium">Glassware:</span>
                              <p className="text-purple-300 mt-1">{drink.glassware}</p>
                            </div>
                            <div>
                              <span className="text-purple-200 font-medium">Garnish:</span>
                              <p className="text-purple-300 mt-1">{drink.garnish}</p>
                            </div>
                          </div>
                        </div>

                        {/* Substitution Suggestions */}
                        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4">
                          <h5 className="text-lg font-semibold mb-2 text-orange-300 flex items-center space-x-2">
                            <span>💡</span>
                            <span>Substitution Tips</span>
                          </h5>
                          <p className="text-orange-200 text-sm leading-relaxed">
                            {drink.type === 'cocktail' && drink.ingredients.some(i => i.category === 'liqueur') && 
                              "If you can't find specialty liqueurs, try using similar flavored spirits or syrups. For example, replace Aperol with Campari or a bitter orange liqueur."}
                            {drink.type === 'traditional_drink' && 
                              "Traditional ingredients can often be substituted with more accessible alternatives. Look for similar flavors in your local grocery store."}
                            {drink.type === 'non_alcoholic' && 
                              "Non-alcoholic versions can be enhanced with fresh herbs, spices, or fruit juices for added complexity."}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>


              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {drinks.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 text-gray-500 text-4xl">🍹</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-3">No Drinks Found</h3>
          <p className="text-gray-400 text-lg">
            No drinks match the selected type. Try adjusting the filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default DrinkSection;
