import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChefHat, Calendar, Star, Utensils, Clock3, TrendingUp } from 'lucide-react';
import foodDatabase from '../data/foodDatabaseComplete.json';

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

  // Format time
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
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
              key={dish.id}
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
                    <div className="text-6xl mb-4">{dish.image}</div>
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-2 rounded-full text-xs font-medium border ${getDifficultyColor(dish.difficulty)}`}>
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(dish.difficulty)}
                          <span>{dish.difficulty}</span>
                        </div>
                      </span>
                      {isCooked(dish.id) && (
                        <button
                          onClick={() => markAsNotCooked(dish.id)}
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

                    {/* Time and Difficulty Info */}
                    <div className="flex items-center space-x-8 text-base text-gray-400 mb-6">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-6 h-6 text-blue-400" />
                        <span>Prep: {formatTime(dish.prep_time)}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock3 className="w-6 h-6 text-purple-400" />
                        <span>Cook: {formatTime(dish.cook_time)}</span>
                      </div>
                    </div>

                    {/* Cooked Status */}
                    {isCooked(dish.id) && (
                      <div className="flex items-center space-x-3 text-base text-green-400 mb-6 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
                        <Calendar className="w-5 h-5" />
                        <span>Cooked on {getCookedDate(dish.id).toLocaleDateString()}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setExpandedRecipe(expandedRecipe === dish.id ? null : dish.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
                        aria-label={expandedRecipe === dish.id ? 'Hide recipe details' : 'Show recipe details'}
                      >
                        {expandedRecipe === dish.id ? 'Hide Recipe' : 'Show Recipe'}
                      </button>
                      {!isCooked(dish.id) && (
                        <button
                          onClick={() => markAsCooked(dish.id)}
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

              {/* Expanded Recipe Content */}
              <AnimatePresence>
                {expandedRecipe === dish.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700/50 overflow-hidden"
                  >
                    <div className="p-8 space-y-8">
                      {/* Ingredients and Instructions in Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Ingredients */}
                        <div>
                          <h4 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-white">
                            <Utensils className="w-7 h-7 text-blue-400" />
                            <span>Ingredients</span>
                          </h4>
                          <ul className="space-y-3">
                            {dish.ingredients.map((ingredient, idx) => (
                              <li key={idx} className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span className="font-semibold text-blue-300 min-w-0">{ingredient.quantity} {ingredient.unit}</span>
                                <span className="text-gray-300 flex-1 text-lg">{ingredient.item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Instructions */}
                        <div>
                          <h4 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-white">
                            <ChefHat className="w-7 h-7 text-purple-400" />
                            <span>Instructions</span>
                          </h4>
                          <ol className="space-y-4">
                            {dish.instructions.map((instruction, idx) => (
                              <li key={idx} className="flex space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                                <span className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                  {idx + 1}
                                </span>
                                <span className="text-gray-300 leading-relaxed text-lg">{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Tips - Full Width */}
                      {dish.tips && (
                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8">
                          <h4 className="text-2xl font-bold mb-4 text-blue-300 flex items-center space-x-3">
                            <span>💡</span>
                            <span>Pro Tips</span>
                          </h4>
                          <p className="text-blue-200 leading-relaxed text-lg">{dish.tips}</p>
                        </div>
                      )}
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
            {Object.entries(cookedDishes).map(([dishId, data]) => {
              const dish = countryDishes.find(d => d.id === dishId);
              if (!dish || data.country !== selectedCountry.id) return null;
              
              return (
                <div key={dishId} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  <span className="text-3xl">{dish.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-green-300 text-lg truncate">{dish.name}</p>
                    <p className="text-sm text-green-400">
                      Cooked on {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsNotCooked(dishId)}
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