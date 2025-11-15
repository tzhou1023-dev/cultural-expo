/**
 * Recipe Manager Utility
 * Handles cooking history, shopping lists, and recipe interactions
 */

// Recipe and Shopping List Management
const SHOPPING_LIST_KEY = 'cultural_expo_shopping_list';
const COOKED_RECIPES_KEY = 'cultural_expo_cooked_recipes';

// Get shopping list from localStorage
export const getShoppingList = () => {
  try {
    const list = localStorage.getItem(SHOPPING_LIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error('Error loading shopping list:', error);
    return [];
  }
};

// Save shopping list to localStorage
const saveShoppingList = (list) => {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    console.error('Error saving shopping list:', error);
    return false;
  }
};

// Toggle shopping list item completion
export const toggleShoppingListItem = (itemId) => {
  const list = getShoppingList();
  const updatedList = list.map(item => 
    item.id === itemId ? { ...item, checked: !item.checked } : item
  );
  return saveShoppingList(updatedList);
};

// Remove item from shopping list
export const removeFromShoppingList = (itemId) => {
  const list = getShoppingList();
  const updatedList = list.filter(item => item.id !== itemId);
  return saveShoppingList(updatedList);
};

// Clear entire shopping list
export const clearShoppingList = () => {
  return saveShoppingList([]);
};

// Get basic cooking statistics
export const getCookingStats = () => {
  const shoppingList = getShoppingList();
  
  return {
    totalItems: shoppingList.length,
    checkedItems: shoppingList.filter(item => item.checked).length,
    pendingItems: shoppingList.filter(item => !item.checked).length
  };
};

// Export shopping list as text
export const exportShoppingListText = () => {
  const list = getShoppingList();
  
  if (list.length === 0) {
    return 'Shopping List is empty';
  }
  
  let text = 'Cultural Expo Shopping List\n';
  text += '==========================\n\n';
  
  const groupedByCategory = list.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
  
  if (groupedByCategory && typeof groupedByCategory === 'object') {
    Object.entries(groupedByCategory).forEach(([category, items]) => {
      text += `${category.toUpperCase()}:\n`;
      items.forEach(item => {
        const status = item.checked ? '✓' : '☐';
        text += `  ${status} ${item.name} (${item.quantity})\n`;
      });
      text += '\n';
    });
  }
  
  const stats = getCookingStats();
  text += `\nTotal Items: ${stats.totalItems}\n`;
  text += `Completed: ${stats.checkedItems}\n`;
  text += `Pending: ${stats.pendingItems}\n`;
  
  return text;
};
