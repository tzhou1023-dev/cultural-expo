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

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Country</h3>
          <p className="text-gray-500">Choose a country to explore its traditional cuisine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">
          {selectedCountry.flag} {selectedCountry.name} Cuisine
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {selectedCountry.cuisine_description}
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex justify-center">
        <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
          {['all', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setDifficultyFilter(difficulty)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                difficultyFilter === difficulty
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card card-interactive overflow-hidden"
            >
              {/* Dish Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{dish.image}</div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(dish.difficulty)}`}>
                      {getDifficultyIcon(dish.difficulty)}
                    </span>
                    {isCooked(dish.id) && (
                      <button
                        onClick={() => markAsNotCooked(dish.id)}
                        className="text-green-600 hover:text-green-700"
                        title="Mark as not cooked"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{dish.description}</p>

                {/* Time and Difficulty Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Prep: {formatTime(dish.prep_time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock3 className="w-4 h-4" />
                    <span>Cook: {formatTime(dish.cook_time)}</span>
                  </div>
                </div>

                {/* Cooked Status */}
                {isCooked(dish.id) && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Cooked on {getCookedDate(dish.id).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setExpandedRecipe(expandedRecipe === dish.id ? null : dish.id)}
                    className="btn btn-primary flex-1"
                  >
                    {expandedRecipe === dish.id ? 'Hide Recipe' : 'Show Recipe'}
                  </button>
                  {!isCooked(dish.id) && (
                    <button
                      onClick={() => markAsCooked(dish.id)}
                      className="btn btn-secondary px-4"
                      title="Mark as cooked"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
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
                    className="border-t border-gray-200 overflow-hidden"
                  >
                    <div className="p-6 space-y-6">
                      {/* Ingredients */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                          <Utensils className="w-5 h-5" />
                          <span>Ingredients</span>
                        </h4>
                        <ul className="space-y-2">
                          {dish.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                              <span className="text-gray-600">{ingredient.item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                          <ChefHat className="w-5 h-5" />
                          <span>Instructions</span>
                        </h4>
                        <ol className="space-y-3">
                          {dish.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700 leading-relaxed">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      {dish.tips && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-lg font-semibold mb-2 text-blue-800">Pro Tips</h4>
                          <p className="text-blue-700">{dish.tips}</p>
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
        <div className="text-center py-12">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Dishes Found</h3>
          <p className="text-gray-500">
            No dishes match the selected difficulty level. Try adjusting the filter.
          </p>
        </div>
      )}

      {/* Cooking Progress */}
      {Object.keys(cookedDishes).length > 0 && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center space-x-2">
            <Star className="w-5 h-5 fill-current" />
            <span>Cooking Progress</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cookedDishes).map(([dishId, data]) => {
              const dish = countryDishes.find(d => d.id === dishId);
              if (!dish || data.country !== selectedCountry.id) return null;
              
              return (
                <div key={dishId} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <span className="text-2xl">{dish.image}</span>
                  <div className="flex-1">
                    <p className="font-medium text-green-800">{dish.name}</p>
                    <p className="text-sm text-green-600">
                      Cooked on {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsNotCooked(dishId)}
                    className="text-green-600 hover:text-green-700"
                    title="Remove from cooked list"
                  >
                    <Star className="w-4 h-4 fill-current" />
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