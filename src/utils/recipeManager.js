/**
 * Recipe Manager Utility
 * Handles cooking history, shopping lists, and recipe interactions
 */

const COOKED_RECIPES_KEY = 'cultural_expo_cooked_recipes';
const SHOPPING_LIST_KEY = 'cultural_expo_shopping_list';
const INGREDIENT_CHECKLIST_KEY = 'cultural_expo_ingredient_checklist';

/**
 * Get cooked recipes from localStorage
 * @returns {Array} Array of cooked recipe objects with dates
 */
export const getCookedRecipes = () => {
  try {
    const cooked = localStorage.getItem(COOKED_RECIPES_KEY);
    return cooked ? JSON.parse(cooked) : [];
  } catch (error) {
    console.error('Error reading cooked recipes from localStorage:', error);
    return [];
  }
};

/**
 * Mark a recipe as cooked
 * @param {string} recipeId - Recipe ID
 * @param {string} countryId - Country ID
 * @param {string} recipeName - Recipe name
 */
export const markRecipeAsCooked = (recipeId, countryId, recipeName) => {
  try {
    const cookedRecipes = getCookedRecipes();
    const newEntry = {
      recipeId,
      countryId,
      recipeName,
      cookedDate: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Remove any existing entry for this recipe
    const filtered = cookedRecipes.filter(recipe => recipe.recipeId !== recipeId);
    filtered.push(newEntry);
    
    localStorage.setItem(COOKED_RECIPES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving cooked recipe:', error);
  }
};

/**
 * Check if a recipe has been cooked
 * @param {string} recipeId - Recipe ID
 * @returns {Object|null} Cooked recipe entry or null
 */
export const isRecipeCooked = (recipeId) => {
  const cookedRecipes = getCookedRecipes();
  return cookedRecipes.find(recipe => recipe.recipeId === recipeId) || null;
};

/**
 * Get shopping list from localStorage
 * @returns {Array} Array of shopping list items
 */
export const getShoppingList = () => {
  try {
    const list = localStorage.getItem(SHOPPING_LIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error('Error reading shopping list from localStorage:', error);
    return [];
  }
};

/**
 * Add ingredients to shopping list
 * @param {Array} ingredients - Array of ingredient objects
 * @param {string} recipeName - Name of the recipe
 */
export const addToShoppingList = (ingredients, recipeName) => {
  try {
    const currentList = getShoppingList();
    const newItems = ingredients.map(ingredient => ({
      id: `${recipeName}_${ingredient.item}`.replace(/\s+/g, '_').toLowerCase(),
      item: ingredient.item,
      quantity: ingredient.quantity,
      category: ingredient.category,
      recipeName,
      addedDate: new Date().toISOString(),
      checked: false
    }));
    
    // Filter out duplicates based on item name and recipe
    const filteredList = currentList.filter(existing => 
      !newItems.some(newItem => newItem.id === existing.id)
    );
    
    const updatedList = [...filteredList, ...newItems];
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Error adding to shopping list:', error);
  }
};

/**
 * Toggle shopping list item checked status
 * @param {string} itemId - Shopping list item ID
 */
export const toggleShoppingListItem = (itemId) => {
  try {
    const list = getShoppingList();
    const updatedList = list.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error('Error toggling shopping list item:', error);
  }
};

/**
 * Remove item from shopping list
 * @param {string} itemId - Shopping list item ID
 */
export const removeFromShoppingList = (itemId) => {
  try {
    const list = getShoppingList();
    const filteredList = list.filter(item => item.id !== itemId);
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(filteredList));
  } catch (error) {
    console.error('Error removing from shopping list:', error);
  }
};

/**
 * Clear entire shopping list
 */
export const clearShoppingList = () => {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing shopping list:', error);
  }
};

/**
 * Get ingredient checklist for a recipe
 * @param {string} recipeId - Recipe ID
 * @returns {Object} Checklist state object
 */
export const getIngredientChecklist = (recipeId) => {
  try {
    const checklists = localStorage.getItem(INGREDIENT_CHECKLIST_KEY);
    const parsed = checklists ? JSON.parse(checklists) : {};
    return parsed[recipeId] || {};
  } catch (error) {
    console.error('Error reading ingredient checklist:', error);
    return {};
  }
};

/**
 * Toggle ingredient checked status in recipe checklist
 * @param {string} recipeId - Recipe ID
 * @param {string} ingredientItem - Ingredient item name
 */
export const toggleIngredientCheck = (recipeId, ingredientItem) => {
  try {
    const allChecklists = localStorage.getItem(INGREDIENT_CHECKLIST_KEY);
    const parsed = allChecklists ? JSON.parse(allChecklists) : {};
    
    if (!parsed[recipeId]) {
      parsed[recipeId] = {};
    }
    
    parsed[recipeId][ingredientItem] = !parsed[recipeId][ingredientItem];
    
    localStorage.setItem(INGREDIENT_CHECKLIST_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Error toggling ingredient check:', error);
  }
};

/**
 * Get cooking statistics
 * @returns {Object} Cooking statistics
 */
export const getCookingStats = () => {
  const cookedRecipes = getCookedRecipes();
  const shoppingList = getShoppingList();
  
  // Group by country
  const countriesCookedFrom = [...new Set(cookedRecipes.map(recipe => recipe.countryId))];
  
  // Group by difficulty (would need to be passed in or looked up)
  const recentCooks = cookedRecipes
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
  
  return {
    totalRecipesCooked: cookedRecipes.length,
    countriesExplored: countriesCookedFrom.length,
    pendingShoppingItems: shoppingList.filter(item => !item.checked).length,
    recentCooks,
    lastCookedDate: cookedRecipes.length > 0 ? 
      new Date(Math.max(...cookedRecipes.map(r => r.timestamp))) : null
  };
};

/**
 * Export shopping list as text
 * @returns {string} Formatted shopping list
 */
export const exportShoppingListText = () => {
  const list = getShoppingList();
  const groupedByCategory = list.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  let output = 'CULTURAL EXPO - SHOPPING LIST\\n';
  output += '================================\\n\\n';
  
  Object.entries(groupedByCategory).forEach(([category, items]) => {
    output += `${category.toUpperCase()}:\\n`;
    items.forEach(item => {
      const checkbox = item.checked ? '☑' : '☐';
      output += `  ${checkbox} ${item.quantity} ${item.item} (${item.recipeName})\\n`;
    });
    output += '\\n';
  });
  
  return output;
};

/**
 * Get recipe difficulty color
 * @param {string} difficulty - Recipe difficulty level
 * @returns {string} Tailwind CSS classes
 */
export const getDifficultyColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get dietary tag color
 * @param {string} tag - Dietary tag
 * @returns {string} Tailwind CSS classes
 */
export const getDietaryTagColor = (tag) => {
  const colors = {
    'vegetarian': 'bg-green-100 text-green-700',
    'vegan': 'bg-emerald-100 text-emerald-700',
    'gluten-free': 'bg-orange-100 text-orange-700',
    'dairy-free': 'bg-blue-100 text-blue-700',
    'keto': 'bg-purple-100 text-purple-700',
    'pescatarian': 'bg-teal-100 text-teal-700'
  };
  return colors[tag.toLowerCase()] || 'bg-gray-100 text-gray-700';
};

/**
 * Format cooking time display
 * @param {string} prepTime - Preparation time
 * @param {string} cookTime - Cooking time
 * @returns {string} Formatted time string
 */
export const formatCookingTime = (prepTime, cookTime) => {
  if (cookTime === '0 minutes' || !cookTime) {
    return `⏱️ ${prepTime}`;
  }
  return `⏱️ ${prepTime} prep + ${cookTime} cook`;
};
