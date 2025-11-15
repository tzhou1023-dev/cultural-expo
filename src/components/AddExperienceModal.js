import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  CalendarIcon,
  GlobeAltIcon,
  PlusIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { getAllCountries } from '../utils/countrySelector';
import { saveExperience } from '../utils/experienceManager';
import authenticFoodData from '../data/authenticFoodDatabase.json';
import drinksData from '../data/drinks.json';
import moviesData from '../data/movies.json';

const AddExperienceModal = ({ isOpen, onClose, selectedDate, onExperienceAdded }) => {
  const [date, setDate] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Food section
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [customFood, setCustomFood] = useState('');
  const [showCustomFoodInput, setShowCustomFoodInput] = useState(false);
  
  // Drink section
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [customDrink, setCustomDrink] = useState('');
  const [showCustomDrinkInput, setShowCustomDrinkInput] = useState(false);
  
  // Movie section
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [customMovie, setCustomMovie] = useState('');
  const [showCustomMovieInput, setShowCustomMovieInput] = useState(false);
  
  // Notes
  const [notes, setNotes] = useState('');
  
  const allCountries = getAllCountries();
  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Initialize date based on selectedDate prop or today
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [selectedDate]);

  // Get suggestions based on selected country
  const getFoodSuggestions = () => {
    if (!selectedCountry) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return authenticFoodData.dishes[countryKey] || [];
  };

  const getDrinkSuggestions = () => {
    if (!selectedCountry) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return drinksData[countryKey] || [];
  };

  const getMovieSuggestions = () => {
    if (!selectedCountry) return [];
    const countryKey = selectedCountry.id.toLowerCase();
    return moviesData[countryKey] || [];
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountrySearch(country.name);
    setShowCountryDropdown(false);
  };

  const handleFoodToggle = (food) => {
    setSelectedFoods(prev => 
      prev.find(f => f.name === food.name)
        ? prev.filter(f => f.name !== food.name)
        : [...prev, { name: food.name, attempted: false, rating: 0, notes: '' }]
    );
  };

  const handleDrinkToggle = (drink) => {
    setSelectedDrinks(prev => 
      prev.find(d => d.name === drink.name)
        ? prev.filter(d => d.name !== drink.name)
        : [...prev, { name: drink.name, attempted: false, rating: 0, notes: '' }]
    );
  };

  const handleMovieToggle = (movie) => {
    setSelectedMovies(prev => 
      prev.find(m => m.title === movie.title)
        ? prev.filter(m => m.title !== movie.title)
        : [...prev, { title: movie.title, year: movie.year, watched: false, rating: 0, notes: '' }]
    );
  };

  const addCustomFood = () => {
    if (customFood.trim()) {
      setSelectedFoods(prev => [...prev, { name: customFood.trim(), attempted: false, rating: 0, notes: '', custom: true }]);
      setCustomFood('');
      setShowCustomFoodInput(false);
    }
  };

  const addCustomDrink = () => {
    if (customDrink.trim()) {
      setSelectedDrinks(prev => [...prev, { name: customDrink.trim(), attempted: false, rating: 0, notes: '', custom: true }]);
      setCustomDrink('');
      setShowCustomDrinkInput(false);
    }
  };

  const addCustomMovie = () => {
    if (customMovie.trim()) {
      setSelectedMovies(prev => [...prev, { title: customMovie.trim(), watched: false, rating: 0, notes: '', custom: true }]);
      setCustomMovie('');
      setShowCustomMovieInput(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedCountry) {
      alert('Please select a country');
      return;
    }

    const experience = {
      date,
      country: selectedCountry,
      dishes: selectedFoods,
      drinks: selectedDrinks,
      movies: selectedMovies,
      overall_notes: notes
    };

    const experienceId = saveExperience(experience);
    if (experienceId) {
      onExperienceAdded(experience);
      onClose();
      // Reset form
      setSelectedCountry(null);
      setCountrySearch('');
      setSelectedFoods([]);
      setSelectedDrinks([]);
      setSelectedMovies([]);
      setNotes('');
    }
  };

  const isFormValid = selectedCountry && (selectedFoods.length > 0 || selectedDrinks.length > 0 || selectedMovies.length > 0);

  // Show validation status
  const getValidationMessage = () => {
    if (!selectedCountry) return 'Please select a country';
    if (selectedFoods.length === 0 && selectedDrinks.length === 0 && selectedMovies.length === 0) {
      return 'Please select at least one food, drink, or movie';
    }
    return 'Ready to save!';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <PlusIcon className="w-6 h-6 mr-3 text-accent-primary" />
                Add Cultural Experience
              </h2>
              <p className="text-gray-400 mt-1">Record your cultural exploration journey</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
                              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-2 text-white" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors"
                  />
                </div>

                {/* Country Selection */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white mb-2">
                    <GlobeAltIcon className="w-4 h-4 inline mr-2 text-white" />
                    Country *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                        setShowCountryDropdown(true);
                      }}
                      onFocus={() => setShowCountryDropdown(true)}
                      placeholder="Search for a country..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors pr-10"
                    />
                    <MagnifyingGlassIcon className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Country Dropdown */}
                  <AnimatePresence>
                    {showCountryDropdown && (
                      <motion.div
                        className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        {filteredCountries.map((country) => (
                          <button
                            key={country.id}
                            onClick={() => handleCountrySelect(country)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-white">{country.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes about your experience..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Right Column - Cultural Items */}
              <div className="space-y-6">
                {/* Food Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🍽️ Food & Dishes</h3>
                  {selectedCountry ? (
                    <div className="space-y-3">
                      {/* Suggestions */}
                      <div className="grid grid-cols-1 gap-2">
                        {getFoodSuggestions().map((food) => (
                          <button
                            key={food.name}
                            onClick={() => handleFoodToggle(food)}
                            className={`p-3 text-left rounded-lg border transition-colors ${
                              selectedFoods.find(f => f.name === food.name)
                                ? 'bg-accent-primary/20 border-accent-primary text-white'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{food.name}</div>
                              {selectedFoods.find(f => f.name === food.name) && (
                                <CheckIcon className="w-5 h-5 text-accent-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Food */}
                      {showCustomFoodInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customFood}
                            onChange={(e) => setCustomFood(e.target.value)}
                            placeholder="Enter custom dish name..."
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomFood()}
                          />
                          <button
                            onClick={addCustomFood}
                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomFoodInput(true)}
                          className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-accent-primary hover:text-accent-primary transition-colors"
                        >
                          + Add Custom Dish
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Select a country to see food suggestions
                    </div>
                  )}
                </div>

                {/* Drinks Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🍹 Drinks & Beverages</h3>
                  {selectedCountry ? (
                    <div className="space-y-3">
                      {/* Suggestions */}
                      <div className="grid grid-cols-1 gap-2">
                        {getDrinkSuggestions().map((drink) => (
                          <button
                            key={drink.id}
                            onClick={() => handleDrinkToggle(drink)}
                            className={`p-3 text-left rounded-lg border transition-colors ${
                              selectedDrinks.find(d => d.name === drink.name)
                                ? 'bg-accent-primary/20 border-accent-primary text-white'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{drink.name}</div>
                              {selectedDrinks.find(d => d.name === drink.name) && (
                                <CheckIcon className="w-5 h-5 text-accent-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Drink */}
                      {showCustomDrinkInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customDrink}
                            onChange={(e) => setCustomDrink(e.target.value)}
                            placeholder="Enter custom drink name..."
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomDrink()}
                          />
                          <button
                            onClick={addCustomDrink}
                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomDrinkInput(true)}
                          className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-accent-primary hover:text-accent-primary transition-colors"
                        >
                          + Add Custom Drink
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Select a country to see drink suggestions
                    </div>
                  )}
                </div>

                {/* Movies Section */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">🎬 Movies & Films</h3>
                  {selectedCountry ? (
                    <div className="space-y-3">
                      {/* Suggestions */}
                      <div className="grid grid-cols-1 gap-2">
                        {getMovieSuggestions().map((movie) => (
                          <button
                            key={movie.id}
                            onClick={() => handleMovieToggle(movie)}
                            className={`p-3 text-left rounded-lg border transition-colors ${
                              selectedMovies.find(m => m.title === movie.title)
                                ? 'bg-accent-primary/20 border-accent-primary text-white'
                                : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{movie.title} ({movie.year})</div>
                              {selectedMovies.find(m => m.title === movie.title) && (
                                <CheckIcon className="w-5 h-5 text-accent-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom Movie */}
                      {showCustomMovieInput ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={customMovie}
                            onChange={(e) => setCustomMovie(e.target.value)}
                            placeholder="Enter custom movie title..."
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-accent-primary"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomMovie()}
                          />
                          <button
                            onClick={addCustomMovie}
                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowCustomMovieInput(true)}
                          className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-accent-primary hover:text-accent-primary transition-colors"
                        >
                          + Add Custom Movie
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      Select a country to see movie suggestions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {selectedCountry && (
                  <span>Selected: {selectedCountry.flag} {selectedCountry.name}</span>
                )}
                {selectedCountry && (
                  <div className="text-xs mt-1">
                    {selectedFoods.length} foods • {selectedDrinks.length} drinks • {selectedMovies.length} movies
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    isFormValid
                      ? 'bg-accent-primary text-white hover:bg-accent-secondary shadow-lg'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isFormValid ? '💾 Save Experience' : getValidationMessage()}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddExperienceModal;
