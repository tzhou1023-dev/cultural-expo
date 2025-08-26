import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Calendar, Star, Utensils, Clock3, TrendingUp } from 'lucide-react';
import foodDatabase from '../data/authenticFoodDatabase.json';

const FoodSection = ({ selectedCountry }) => {
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [cookedDishes, setCookedDishes] = useState(() => {
    const saved = localStorage.getItem('cookedDishes');
    return saved ? JSON.parse(saved) : {};
  });

  // Get dishes for selected country
  const countryDishes = useMemo(() => {
    if (!selectedCountry) return [];
    return foodDatabase.dishes[selectedCountry.id] || [];
  }, [selectedCountry]);

  // Filter dishes by difficulty
  const filteredDishes = useMemo(() => {
    if (difficultyFilter === 'all') return countryDishes;
    return countryDishes.filter(dish => dish.difficulty === difficultyFilter);
  }, [countryDishes, difficultyFilter]);

  // Save cooked dishes to localStorage
  useEffect(() => {
    localStorage.setItem('cookedDishes', JSON.stringify(cookedDishes));
  }, [cookedDishes]);

  // Mark dish as cooked
  const markAsCooked = (dishId) => {
    setCookedDishes(prev => ({
      ...prev,
      [dishId]: {
        date: new Date().toISOString(),
        country: selectedCountry.id
      }
    }));
  };

  // Mark dish as not cooked
  const markAsNotCooked = (dishId) => {
    setCookedDishes(prev => {
      const newState = { ...prev };
      delete newState[dishId];
      return newState;
    });
  };

  // Check if dish is cooked
  const isCooked = (dishId) => {
    return cookedDishes[dishId] && cookedDishes[dishId].country === selectedCountry.id;
  };

  // Get cooked date
  const getCookedDate = (dishId) => {
    if (!isCooked(dishId)) return null;
    return new Date(cookedDishes[dishId].date);
  };

  // Get difficulty color with dark mode support
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-900/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return <ChefHat className="w-4 h-4" />;
      case 'Medium': return <Utensils className="w-4 h-4" />;
      case 'Hard': return <TrendingUp className="w-4 h-4" />;
      default: return <ChefHat className="w-4 h-4" />;
    }
  };

  // Get dish emoji based on type
  const getDishEmoji = (type) => {
    switch (type) {
      case 'main': return '🍽️';
      case 'appetizer': return '🥗';
      default: return '🍴';
    }
  };

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Select a Country</h3>
          <p className="text-gray-400">Choose a country to explore its traditional cuisine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-3 text-white">
          {selectedCountry.flag} {selectedCountry.name} Cuisine
        </h2>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
          {selectedCountry.cuisine_description}
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex justify-center">
        <div className="flex space-x-2 p-1 bg-gray-800/50 rounded-xl border border-gray-700/50">
          {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setDifficultyFilter(difficulty)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                difficultyFilter === difficulty
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
              aria-label={`Filter by ${difficulty === 'all' ? 'all difficulty levels' : difficulty + ' difficulty'}`}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes - Horizontal Layout - Each card spans full width */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredDishes.map((dish, index) => (
            <motion.div
              key={dish.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-gray-600/50 hover:bg-gray-800/70"
            >
              {/* Dish Header - Horizontal Layout */}
              <div className="p-8">
                <div className="flex items-start space-x-8">
                  {/* Left Side - Image and Basic Info */}
                  <div className="flex-shrink-0">
                    <div className="text-6xl mb-4">{getDishEmoji(dish.type)}</div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-2 rounded-full text-xs font-medium border ${getDifficultyColor(dish.difficulty)}`}>
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(dish.difficulty)}
                          <span>{dish.difficulty}</span>
                        </div>
                      </span>
                      <span className={`px-3 py-2 rounded-full text-xs font-medium border ${
                        dish.type === 'main' 
                          ? 'text-blue-400 bg-blue-900/20 border-blue-500/30' 
                          : 'text-purple-400 bg-purple-900/20 border-purple-500/30'
                      }`}>
                        {dish.type === 'main' ? 'Main Dish' : 'Appetizer/Starter'}
                      </span>
                      {isCooked(dish.name) && (
                        <button
                          onClick={() => markAsNotCooked(dish.name)}
                          className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-full hover:bg-green-900/20"
                          title="Mark as not cooked"
                          aria-label="Remove from cooked dishes"
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-3xl font-bold mb-4 text-white leading-tight">{dish.name}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed text-lg">{dish.description}</p>

                    {/* Cooked Status */}
                    {isCooked(dish.name) && (
                      <div className="flex items-center space-x-3 text-base text-green-400 mb-6 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                        <Calendar className="w-5 h-5" />
                        <span>Cooked on {getCookedDate(dish.name).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setExpandedRecipe(expandedRecipe === dish.name ? null : dish.name)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
                        aria-label={expandedRecipe === dish.name ? 'Hide dish details' : 'Show dish details'}
                      >
                        {expandedRecipe === dish.name ? 'Hide Details' : 'Show Details'}
                      </button>
                      {!isCooked(dish.name) && (
                        <button
                          onClick={() => markAsCooked(dish.name)}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
                          title="Mark as cooked"
                          aria-label="Mark dish as cooked"
                        >
                          <Star className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Dish Content */}
              <AnimatePresence>
                {expandedRecipe === dish.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700/50 overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
                        <h4 className="text-2xl font-bold mb-4 text-blue-300 flex items-center space-x-3">
                          <span>💡</span>
                          <span>Cultural Significance</span>
                        </h4>
                        <p className="text-blue-200 leading-relaxed text-lg">
                          {dish.name} is a beloved traditional dish that represents the authentic flavors and cooking techniques of {selectedCountry.name}. 
                          This {dish.type} showcases the local ingredients and culinary heritage that locals cherish and visitors should experience.
                        </p>
                        <div className="mt-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                          <p className="text-gray-300 text-sm">
                            <strong>Difficulty Level:</strong> {dish.difficulty} • <strong>Type:</strong> {dish.type === 'main' ? 'Main Course' : 'Appetizer/Starter'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredDishes.length === 0 && (
        <div className="text-center py-16">
          <Utensils className="w-20 h-20 mx-auto mb-6 text-gray-500" />
          <h3 className="text-2xl font-bold text-gray-300 mb-3">No Dishes Found</h3>
          <p className="text-gray-400 text-lg">
            No dishes match the selected difficulty level. Try adjusting the filter.
          </p>
        </div>
      )}

      {/* Cooking Progress */}
      {Object.keys(cookedDishes).length > 0 && (
        <div className="mt-12 p-8 bg-green-900/20 border border-green-500/30 rounded-2xl">
          <h3 className="text-2xl font-bold text-green-300 mb-6 flex items-center space-x-3">
            <Star className="w-6 h-6 fill-current" />
            <span>Cooking Progress</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(cookedDishes).map(([dishName, data]) => {
              const dish = countryDishes.find(d => d.name === dishName);
              if (!dish || data.country !== selectedCountry.id) return null;
              
              return (
                <div key={dishName} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <span className="text-3xl">{getDishEmoji(dish.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-300 text-lg truncate">{dish.name}</p>
                    <p className="text-sm text-green-400">
                      Cooked on {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsNotCooked(dishName)}
                    className="text-green-400 hover:text-green-300 transition-colors p-2 rounded-full hover:bg-green-900/20 flex-shrink-0"
                    title="Remove from cooked list"
                    aria-label="Remove dish from cooked list"
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSection;