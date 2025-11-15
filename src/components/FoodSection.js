import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import foodDatabase from '../data/authenticFoodDatabase.json';

const FoodSection = ({ selectedCountry }) => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  // Get dishes for selected country
  const countryDishes = useMemo(() => {
    if (!selectedCountry) return [];
    return foodDatabase.dishes[selectedCountry.id] || [];
  }, [selectedCountry]);

  const handleCardClick = (dishId) => {
    setExpandedRecipe(expandedRecipe === dishId ? null : dishId);
  };

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400 text-4xl">🍴</div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Select a Country</h3>
          <p className="text-gray-400">Choose a country to explore its traditional cuisine</p>
        </div>
      </div>
    );
  }

  if (countryDishes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 text-gray-500 text-4xl">🍽️</div>
        <h3 className="text-2xl font-bold text-gray-300 mb-3">No Dishes Found</h3>
        <p className="text-gray-400 text-lg">
          No dish information available for this country.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-purple-400 mb-2">
          Traditional Cuisine
        </h3>
        <p className="text-gray-300">
          Discover authentic dishes from {selectedCountry.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countryDishes.map((dish, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
                          <motion.div
                className={`bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                  expandedRecipe === index
                    ? 'border-2 border-purple-400 bg-purple-400/20 shadow-lg'
                    : 'border border-purple-400/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 focus:border-2 focus:border-purple-400 focus:shadow-lg focus:shadow-purple-400/20'
                }`}
              whileHover={{ y: -5 }}
              onClick={() => handleCardClick(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={expandedRecipe === index}
              aria-label={`${dish.name} - Click to ${expandedRecipe === index ? 'collapse' : 'expand'} details`}
            >
              {/* Card Header */}
              <div className="p-6 text-center">
                <div className="text-4xl mb-3">🍽️</div>
                <h4 className="text-xl font-semibold text-purple-400 mb-2">
                  {dish.name}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {dish.description}
                </p>
              </div>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedRecipe === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-purple-400/20 bg-purple-400/5"
                  >
                    <div className="p-6 space-y-4">
                      {/* Cultural Story */}
                      <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-4">
                        <h5 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                          <span className="mr-2">📖</span>
                          Cultural Story
                        </h5>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {dish.cultural_story || `${dish.name} is a beloved traditional dish that represents the authentic flavors and cooking techniques of ${selectedCountry.name}. This dish showcases the local ingredients and culinary heritage that locals cherish and visitors should experience.`}
                        </p>
                      </div>

                      {/* Dish Information */}
                      <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-4">
                        <h5 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                          <span className="mr-2">🍽️</span>
                          Dish Information
                        </h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-purple-400 font-medium">Origin:</span>
                            <p className="text-gray-300">Traditional {selectedCountry.name}</p>
                          </div>
                          <div>
                            <span className="text-purple-400 font-medium">Serving:</span>
                            <p className="text-gray-300">Family style</p>
                          </div>
                        </div>
                      </div>

                      {/* Cooking Tips */}
                      <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-4">
                        <h5 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                          <span className="mr-2">👨‍🍳</span>
                          Cooking Tips
                        </h5>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {dish.cooking_tips || `To prepare authentic ${dish.name}, focus on using fresh, local ingredients and traditional cooking methods. The key to this dish lies in the balance of flavors and the careful attention to cooking time and temperature.`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FoodSection;