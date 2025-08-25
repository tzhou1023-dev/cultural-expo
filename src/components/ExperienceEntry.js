import React, { useState, useEffect } from 'react';
import { getAllCountries } from '../utils/countrySelector';
import { saveExperience, getExperienceById } from '../utils/experienceManager';
import recipesData from '../data/recipes.json';

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

  useEffect(() => {
    if (experienceId) {
      // Load existing experience for editing
      const experience = getExperienceById(experienceId);
      if (experience) {
        setFormData(experience);
      }
    }
  }, [experienceId]);

  useEffect(() => {
    if (formData.country) {
      // Load available dishes, drinks, and movies for selected country
      const countryData = recipesData.recipes[formData.country.id] || [];
      
      // Initialize dishes if not already present
      if (formData.dishes.length === 0) {
        const dishes = countryData.map(recipe => ({
          name: recipe.name,
          attempted: false,
          rating: 0,
          notes: '',
          difficulty: recipe.difficulty
        }));
        setFormData(prev => ({ ...prev, dishes }));
      }
    }
  }, [formData.country]);

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
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.country) {
      errors.country = 'Country selection is required';
    }
    
    // Check if at least one activity was attempted/watched
    const hasActivity = 
      formData.dishes.some(d => d.attempted) ||
      formData.drinks.some(d => d.attempted) ||
      formData.movies.some(m => m.watched);
    
    if (!hasActivity) {
      errors.activities = 'At least one activity must be marked as completed';
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
      const experienceData = {
        ...formData,
        ...(experienceId && { id: experienceId })
      };
      
      await saveExperience(experienceData);
      onClose(true); // Pass true to indicate successful save
    } catch (error) {
      console.error('Error saving experience:', error);
      setValidationErrors({ submit: 'Failed to save experience. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStarRating = (rating, onChange) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`text-xl transition-colors ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            ⭐
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {experienceId ? 'Edit' : 'Add'} Cultural Experience
            </h2>
            <p className="text-gray-600">
              Step {step} of 4 - {
                step === 1 ? 'Select Country & Date' :
                step === 2 ? 'Food Experiences' :
                step === 3 ? 'Drinks & Movies' :
                'Review & Save'
              }
            </p>
          </div>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-warm-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {/* Step 1: Country & Date Selection */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-warm-orange focus:border-warm-orange"
                  max={new Date().toISOString().split('T')[0]}
                />
                {validationErrors.date && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search and Select Country
                </label>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-warm-orange focus:border-warm-orange mb-4"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                  {filteredCountries.map(country => (
                    <button
                      key={country.id}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        formData.country?.id === country.id
                          ? 'border-warm-orange bg-orange-50'
                          : 'border-gray-200 hover:border-warm-orange'
                      }`}
                    >
                      <div className="text-2xl mb-1">{country.flag}</div>
                      <div className="text-sm font-medium">{country.name}</div>
                      <div className="text-xs text-gray-500">{country.region}</div>
                    </button>
                  ))}
                </div>
                
                {validationErrors.country && (
                  <p className="text-red-500 text-sm mt-2">{validationErrors.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Food Experiences */}
          {step === 2 && formData.country && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  🍽️ Food Experiences from {formData.country.name}
                </h3>
                <p className="text-gray-600">
                  Mark dishes you've attempted and rate your experience
                </p>
              </div>

              <div className="space-y-4">
                {formData.dishes.map((dish, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={dish.attempted}
                          onChange={(e) => handleDishChange(index, 'attempted', e.target.checked)}
                          className="w-5 h-5 text-warm-orange focus:ring-warm-orange border-gray-300 rounded"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{dish.name}</h4>
                          {dish.difficulty && (
                            <span className="text-xs text-gray-500">Difficulty: {dish.difficulty}</span>
                          )}
                        </div>
                      </div>
                      
                      {dish.name && !recipesData.recipes[formData.country.id]?.find(r => r.name === dish.name) && (
                        <button
                          type="button"
                          onClick={() => removeItem('dishes', index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {dish.attempted && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Rating</label>
                          {renderStarRating(dish.rating, (rating) => handleDishChange(index, 'rating', rating))}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Notes</label>
                          <textarea
                            value={dish.notes}
                            onChange={(e) => handleDishChange(index, 'notes', e.target.value)}
                            placeholder="How was it? Any tips or thoughts?"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            rows="2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addCustomItem('dishes')}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-warm-orange hover:text-warm-orange transition-colors"
                >
                  + Add Custom Dish
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Drinks & Movies */}
          {step === 3 && (
            <div className="p-6 space-y-8">
              {/* Drinks Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🍹 Beverages from {formData.country.name}
                </h3>
                
                <div className="space-y-4">
                  {formData.drinks.map((drink, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={drink.attempted}
                            onChange={(e) => handleDrinkChange(index, 'attempted', e.target.checked)}
                            className="w-5 h-5 text-warm-orange focus:ring-warm-orange border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={drink.name}
                            onChange={(e) => handleDrinkChange(index, 'name', e.target.value)}
                            placeholder="Beverage name"
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem('drinks', index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>

                      {drink.attempted && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Rating</label>
                            {renderStarRating(drink.rating, (rating) => handleDrinkChange(index, 'rating', rating))}
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Notes</label>
                            <textarea
                              value={drink.notes}
                              onChange={(e) => handleDrinkChange(index, 'notes', e.target.value)}
                              placeholder="How did it taste? Any special preparation?"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              rows="2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addCustomItem('drinks')}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-warm-orange hover:text-warm-orange transition-colors text-sm"
                  >
                    + Add Beverage
                  </button>
                </div>
              </div>

              {/* Movies Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🎬 Films from {formData.country.name}
                </h3>
                
                <div className="space-y-4">
                  {formData.movies.map((movie, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={movie.watched}
                            onChange={(e) => handleMovieChange(index, 'watched', e.target.checked)}
                            className="w-5 h-5 text-warm-orange focus:ring-warm-orange border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={movie.name}
                            onChange={(e) => handleMovieChange(index, 'name', e.target.value)}
                            placeholder="Movie title"
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem('movies', index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>

                      {movie.watched && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Rating</label>
                            {renderStarRating(movie.rating, (rating) => handleMovieChange(index, 'rating', rating))}
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Notes</label>
                            <textarea
                              value={movie.notes}
                              onChange={(e) => handleMovieChange(index, 'notes', e.target.value)}
                              placeholder="What did you think? Cultural insights?"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                              rows="2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addCustomItem('movies')}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-gray-500 hover:border-warm-orange hover:text-warm-orange transition-colors text-sm"
                  >
                    + Add Movie
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Notes */}
          {step === 4 && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                📝 Overall Experience Notes
              </h3>
              
              <textarea
                value={formData.overall_notes}
                onChange={(e) => setFormData(prev => ({ ...prev, overall_notes: e.target.value }))}
                placeholder="How was your overall cultural experience? Any highlights, challenges, or memorable moments?"
                className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-warm-orange focus:border-warm-orange"
                rows="6"
              />

              {validationErrors.activities && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.activities}</p>
              )}

              {validationErrors.submit && (
                <p className="text-red-500 text-sm mt-2">{validationErrors.submit}</p>
              )}
            </div>
          )}
        </form>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !formData.country}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
              >
                {isLoading ? 'Saving...' : experienceId ? 'Update Experience' : 'Save Experience'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExperienceEntry;
