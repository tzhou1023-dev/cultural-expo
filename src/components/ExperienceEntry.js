import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, GlobeAltIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getAllCountries } from '../utils/countrySelector';
import { saveExperience, getExperienceById } from '../utils/experienceManager';

function ExperienceEntry({ isOpen, onClose, experienceId = null, initialDate = null }) {
  const [formData, setFormData] = useState({
    date: initialDate || new Date().toISOString().split('T')[0],
    country: null,
    dishes: [],
    drinks: [],
    movies: [],
    overall_notes: ''
  });
  
  const [countries] = useState(getAllCountries());
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [validationErrors, setValidationErrors] = useState({});
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  useEffect(() => {
    if (experienceId) {
      // Load existing experience for editing
      const experience = getExperienceById(experienceId);
      if (experience) {
        setFormData(experience);
        setShowOptionalFields(true);
      }
    }
  }, [experienceId]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country) => {
    setFormData(prev => ({ ...prev, country }));
    setSearchTerm('');
    setStep(2);
  };

  const handleDishChange = (index, field, value) => {
    const updatedDishes = [...formData.dishes];
    updatedDishes[index] = { ...updatedDishes[index], [field]: value };
    setFormData(prev => ({ ...prev, dishes: updatedDishes }));
  };

  const handleDrinkChange = (index, field, value) => {
    const updatedDrinks = [...formData.drinks];
    updatedDrinks[index] = { ...updatedDrinks[index], [field]: value };
    setFormData(prev => ({ ...prev, drinks: updatedDrinks }));
  };

  const handleMovieChange = (index, field, value) => {
    const updatedMovies = [...formData.movies];
    updatedMovies[index] = { ...updatedMovies[index], [field]: value };
    setFormData(prev => ({ ...prev, movies: updatedMovies }));
  };

  const addCustomItem = (type) => {
    const newItem = {
      name: '',
      [type === 'dishes' ? 'attempted' : type === 'drinks' ? 'attempted' : 'watched']: false,
      rating: 0,
      notes: '',
      ...(type === 'dishes' && { difficulty: 'Medium' }),
      ...(type === 'drinks' && { type: 'Traditional' }),
      ...(type === 'movies' && { year: new Date().getFullYear().toString() })
    };
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], newItem]
    }));
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.country) {
      errors.country = 'Please select a country';
    }
    
    if (!formData.date) {
      errors.date = 'Please select a date';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare experience data - focus on country, make others optional
      const experienceData = {
        id: experienceId || Date.now().toString(),
        date: formData.date,
        country: formData.country,
        overall_notes: formData.overall_notes,
        // Only include optional fields if they have content
        ...(formData.dishes.length > 0 && { dishes: formData.dishes }),
        ...(formData.drinks.length > 0 && { drinks: formData.drinks }),
        ...(formData.movies.length > 0 && { movies: formData.movies })
      };
      
      saveExperience(experienceData);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        country: null,
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: ''
      });
      
      setStep(1);
      setShowOptionalFields(false);
      setValidationErrors({});
      
      onClose();
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: initialDate || new Date().toISOString().split('T')[0],
      country: null,
      dishes: [],
      drinks: [],
      movies: [],
      overall_notes: ''
    });
    setStep(1);
    setShowOptionalFields(false);
    setValidationErrors({});
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          className="relative bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <GlobeAltIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {experienceId ? 'Edit Cultural Experience' : 'Add Cultural Experience'}
                </h2>
                <p className="text-sm text-gray-400">
                  {experienceId ? 'Update your experience details' : 'Record your cultural journey'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Experience *
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    required
                  />
                  {validationErrors.date && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.date}</p>
                  )}
                </div>

                {/* Country Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country/Region *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for a country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                    />
                    {searchTerm && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-700/90 backdrop-blur-sm border border-gray-600/50 rounded-xl max-h-60 overflow-y-auto z-10">
                        {filteredCountries.map(country => (
                          <button
                            key={country.id}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-600/50 transition-colors flex items-center space-x-3"
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <div>
                              <div className="text-white font-medium">{country.name}</div>
                              <div className="text-gray-400 text-sm">{country.region}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {validationErrors.country && (
                    <p className="text-red-400 text-sm mt-1">{validationErrors.country}</p>
                  )}
                </div>

                {/* Selected Country Display */}
                {formData.country && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-700/30 border border-gray-600/30 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{formData.country.flag}</span>
                      <div>
                        <div className="text-white font-semibold text-lg">{formData.country.name}</div>
                        <div className="text-gray-400">{formData.country.region}</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Optional Fields Toggle */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    {showOptionalFields ? 'Hide' : 'Add'} Optional Details (Food, Drinks, Movies)
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Optional Details */}
            {step === 2 && showOptionalFields && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Overall Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                    Overall Experience Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.overall_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, overall_notes: e.target.value }))}
                    rows={3}
                    placeholder="Share your thoughts about this cultural experience..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                </div>

                {/* Optional: Add Food, Drinks, Movies */}
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-4">
                      Optionally add specific items you tried or watched
                    </p>
                  </div>

                  {/* Food Experiences */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">Food Experiences</h3>
                      <button
                        type="button"
                        onClick={() => addCustomItem('dishes')}
                        className="btn btn-sm btn-secondary"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {formData.dishes.map((dish, index) => (
                      <div key={index} className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-3 mb-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Dish name"
                            value={dish.name}
                            onChange={(e) => handleDishChange(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white placeholder-gray-400 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem('dishes', index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={dish.difficulty}
                            onChange={(e) => handleDishChange(index, 'difficulty', e.target.value)}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                          <select
                            value={dish.rating}
                            onChange={(e) => handleDishChange(index, 'rating', parseInt(e.target.value))}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm"
                          >
                            <option value={0}>No Rating</option>
                            <option value={1}>1 ⭐</option>
                            <option value={2}>2 ⭐⭐</option>
                            <option value={3}>3 ⭐⭐⭐</option>
                            <option value={4}>4 ⭐⭐⭐⭐</option>
                            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Drink Experiences */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">Drink Experiences</h3>
                      <button
                        type="button"
                        onClick={() => addCustomItem('drinks')}
                        className="btn btn-sm btn-secondary"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {formData.drinks.map((drink, index) => (
                      <div key={index} className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-3 mb-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Drink name"
                            value={drink.name}
                            onChange={(e) => handleDrinkChange(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white placeholder-gray-400 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem('drinks', index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <select
                            value={drink.type}
                            onChange={(e) => handleDrinkChange(index, 'type', e.target.value)}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm"
                          >
                            <option value="Traditional">Traditional</option>
                            <option value="Modern">Modern</option>
                            <option value="Local">Local</option>
                          </select>
                          <select
                            value={drink.rating}
                            onChange={(e) => handleDrinkChange(index, 'rating', parseInt(e.target.value))}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm"
                          >
                            <option value={0}>No Rating</option>
                            <option value={1}>1 ⭐</option>
                            <option value={2}>2 ⭐⭐</option>
                            <option value={3}>3 ⭐⭐⭐</option>
                            <option value={4}>4 ⭐⭐⭐⭐</option>
                            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Movie Experiences */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-white">Movie Experiences</h3>
                      <button
                        type="button"
                        onClick={() => addCustomItem('movies')}
                        className="btn btn-sm btn-secondary"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    {formData.movies.map((movie, index) => (
                      <div key={index} className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-3 mb-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            placeholder="Movie title"
                            value={movie.name}
                            onChange={(e) => handleMovieChange(index, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white placeholder-gray-400 text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem('movies', index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Year"
                            value={movie.year}
                            onChange={(e) => handleMovieChange(index, 'year', e.target.value)}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white placeholder-gray-400 text-sm"
                          />
                          <select
                            value={movie.rating}
                            onChange={(e) => handleMovieChange(index, 'rating', parseInt(e.target.value))}
                            className="px-3 py-2 bg-gray-600/50 border border-gray-500/50 rounded text-white text-sm"
                          >
                            <option value={0}>No Rating</option>
                            <option value={1}>1 ⭐</option>
                            <option value={2}>2 ⭐⭐</option>
                            <option value={3}>3 ⭐⭐⭐</option>
                            <option value={4}>4 ⭐⭐⭐⭐</option>
                            <option value={5}>5 ⭐⭐⭐⭐⭐</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
              <div className="flex space-x-3">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-ghost"
                >
                  Reset
                </button>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.country}
                  className="btn btn-primary"
                >
                  {isLoading ? 'Saving...' : (experienceId ? 'Update Experience' : 'Save Experience')}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ExperienceEntry;
