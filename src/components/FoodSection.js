import React, { useState, useEffect } from 'react';
import recipesData from '../data/recipes.json';
import {
  markRecipeAsCooked,
  isRecipeCooked,
  addToShoppingList,
  getIngredientChecklist,
  toggleIngredientCheck,
  getDifficultyColor,
  getDietaryTagColor,
  formatCookingTime
} from '../utils/recipeManager';

function FoodSection({ country }) {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showPrintView, setShowPrintView] = useState(null);
  const [ingredientChecklists, setIngredientChecklists] = useState({});
  const [cookedRecipes, setCookedRecipes] = useState({});

  useEffect(() => {
    const countryRecipes = recipesData.recipes[country.id] || [];
    setRecipes(countryRecipes);
    setExpandedRecipe(null);
    
    // Load cooked status for all recipes
    const cookedStatus = {};
    countryRecipes.forEach(recipe => {
      cookedStatus[recipe.id] = isRecipeCooked(recipe.id);
    });
    setCookedRecipes(cookedStatus);
    
    // Load ingredient checklists
    const checklists = {};
    countryRecipes.forEach(recipe => {
      checklists[recipe.id] = getIngredientChecklist(recipe.id);
    });
    setIngredientChecklists(checklists);
  }, [country]);

  const filteredRecipes = recipes.filter(recipe => {
    if (difficultyFilter === 'all') return true;
    return recipe.difficulty.toLowerCase() === difficultyFilter;
  });

  const toggleRecipeExpansion = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const handleMarkAsCooked = (recipe) => {
    markRecipeAsCooked(recipe.id, country.id, recipe.name);
    setCookedRecipes(prev => ({
      ...prev,
      [recipe.id]: {
        recipeId: recipe.id,
        countryId: country.id,
        recipeName: recipe.name,
        cookedDate: new Date().toISOString()
      }
    }));
  };

  const handleAddToShoppingList = (recipe) => {
    addToShoppingList(recipe.ingredients, recipe.name);
    alert(`Added ${recipe.ingredients.length} ingredients to shopping list!`);
  };

  const handleIngredientToggle = (recipeId, ingredientItem) => {
    toggleIngredientCheck(recipeId, ingredientItem);
    setIngredientChecklists(prev => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        [ingredientItem]: !prev[recipeId]?.[ingredientItem]
      }
    }));
  };

  const handlePrintRecipe = (recipe) => {
    setShowPrintView(recipe);
    setTimeout(() => {
      window.print();
      setShowPrintView(null);
    }, 100);
  };

  if (showPrintView) {
    return (
      <div className="print:block hidden">
        <PrintableRecipe recipe={showPrintView} country={country} />
      </div>
    );
  }

  return (
    <div className="section-card">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🍽️</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Traditional Recipes</h3>
        <p className="text-gray-600">Authentic dishes from {country.name}'s culinary heritage</p>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-6 flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['all', 'easy', 'medium', 'hard'].map(level => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                difficultyFilter === level
                  ? 'bg-white shadow-sm text-warm-orange'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {level === 'all' ? 'All Recipes' : `${level.charAt(0).toUpperCase() + level.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="space-y-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            country={country}
            isExpanded={expandedRecipe === recipe.id}
            onToggleExpansion={() => toggleRecipeExpansion(recipe.id)}
            onMarkAsCooked={() => handleMarkAsCooked(recipe)}
            onAddToShoppingList={() => handleAddToShoppingList(recipe)}
            onPrintRecipe={() => handlePrintRecipe(recipe)}
            onIngredientToggle={(ingredientItem) => handleIngredientToggle(recipe.id, ingredientItem)}
            cookedStatus={cookedRecipes[recipe.id]}
            ingredientChecklist={ingredientChecklists[recipe.id] || {}}
          />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No recipes found for the selected difficulty level.</p>
        </div>
      )}

      {recipes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Recipe collection for {country.name} coming soon!</p>
        </div>
      )}
    </div>
  );
}

function RecipeCard({ 
  recipe, 
  country, 
  isExpanded, 
  onToggleExpansion, 
  onMarkAsCooked, 
  onAddToShoppingList,
  onPrintRecipe,
  onIngredientToggle,
  cookedStatus,
  ingredientChecklist 
}) {
  return (
    <div className={`bg-white rounded-xl shadow-md border-2 transition-all duration-300 ${
      isExpanded ? 'border-warm-orange shadow-lg' : 'border-gray-200 hover:border-warm-orange'
    }`}>
      {/* Recipe Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{recipe.emoji}</span>
            <div>
              <h4 className="text-xl font-bold text-gray-800 flex items-center">
                {recipe.name}
                {cookedStatus && (
                  <span className="ml-2 text-green-600" title={`Cooked on ${new Date(cookedStatus.cookedDate).toLocaleDateString()}`}>
                    ✅
                  </span>
                )}
              </h4>
              <p className="text-gray-600 text-sm mt-1">{recipe.description}</p>
              
              {/* Recipe Meta Info */}
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
                <span className="text-xs text-gray-500">
                  {formatCookingTime(recipe.prep_time, recipe.cook_time)}
                </span>
                <span className="text-xs text-gray-500">
                  🍽️ Serves {recipe.servings}
                </span>
              </div>
              
              {/* Dietary Tags */}
              {recipe.dietary_tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.dietary_tags.map(tag => (
                    <span key={tag} className={`px-2 py-1 rounded-full text-xs ${getDietaryTagColor(tag)}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </div>

      {/* Expanded Recipe Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 animate-fade-in">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 mb-6">
            <button
              onClick={onAddToShoppingList}
              className="btn-secondary text-sm"
            >
              🛒 Add to Shopping List
            </button>
            {!cookedStatus ? (
              <button
                onClick={onMarkAsCooked}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ✅ Mark as Cooked
              </button>
            ) : (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                Cooked on {new Date(cookedStatus.cookedDate).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={onPrintRecipe}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              🖨️ Print Recipe
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🥘</span>
                Ingredients
              </h5>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ingredientChecklist[ingredient.item] || false}
                      onChange={() => onIngredientToggle(ingredient.item)}
                      className="w-4 h-4 text-warm-orange focus:ring-warm-orange border-gray-300 rounded"
                    />
                    <span className={`text-sm ${
                      ingredientChecklist[ingredient.item] ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}>
                      <span className="font-medium">{ingredient.quantity}</span> {ingredient.item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Instructions
              </h5>
              <ol className="space-y-3">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 w-6 h-6 bg-warm-orange text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Tips Section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="font-bold text-amber-800 mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Chef's Tips
              </h5>
              <ul className="space-y-1">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-amber-700">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PrintableRecipe({ recipe, country }) {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{recipe.name}</h1>
        <p className="text-gray-600 mt-2">Traditional recipe from {country.name}</p>
        <div className="flex justify-center space-x-4 mt-4 text-sm text-gray-600">
          <span>Difficulty: {recipe.difficulty}</span>
          <span>Prep: {recipe.prep_time}</span>
          <span>Cook: {recipe.cook_time}</span>
          <span>Serves: {recipe.servings}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 italic">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex">
                <span className="w-4 h-4 border border-gray-300 mr-3 mt-0.5"></span>
                <span><strong>{ingredient.quantity}</strong> {ingredient.item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-3">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex">
                <span className="flex-shrink-0 w-6 h-6 border border-gray-300 rounded-full text-sm flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Chef's Tips</h2>
          <ul className="space-y-2">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="text-sm">• {tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
        <p>Recipe from Cultural Expo - Discover the world's flavors</p>
      </div>
    </div>
  );
}

export default FoodSection;