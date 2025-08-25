import React, { useState, useEffect } from 'react';
import {
  getShoppingList,
  toggleShoppingListItem,
  removeFromShoppingList,
  clearShoppingList,
  exportShoppingListText,
  getCookingStats
} from '../utils/recipeManager';

function ShoppingList({ isOpen, onClose }) {
  const [shoppingList, setShoppingList] = useState([]);
  const [stats, setStats] = useState({});
  const [groupBy, setGroupBy] = useState('category'); // 'category' or 'recipe'

  useEffect(() => {
    if (isOpen) {
      loadShoppingList();
      loadStats();
    }
  }, [isOpen]);

  const loadShoppingList = () => {
    const list = getShoppingList();
    setShoppingList(list);
  };

  const loadStats = () => {
    const cookingStats = getCookingStats();
    setStats(cookingStats);
  };

  const handleToggleItem = (itemId) => {
    toggleShoppingListItem(itemId);
    loadShoppingList();
  };

  const handleRemoveItem = (itemId) => {
    removeFromShoppingList(itemId);
    loadShoppingList();
  };

  const handleClearList = () => {
    if (window.confirm('Are you sure you want to clear the entire shopping list?')) {
      clearShoppingList();
      loadShoppingList();
    }
  };

  const handleExportList = () => {
    const listText = exportShoppingListText();
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cultural-expo-shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const groupedItems = shoppingList.reduce((acc, item) => {
    const key = groupBy === 'category' ? item.category : item.recipeName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});

  const checkedItems = shoppingList.filter(item => item.checked).length;
  const totalItems = shoppingList.length;
  const completionPercentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shopping List</h2>
            <p className="text-gray-600">
              {totalItems} items • {checkedItems} checked ({completionPercentage}% complete)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        {totalItems > 0 && (
          <div className="px-6 pt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="category">Category</option>
              <option value="recipe">Recipe</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleExportList}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              disabled={totalItems === 0}
            >
              📄 Export
            </button>
            <button
              onClick={handleClearList}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              disabled={totalItems === 0}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Shopping List Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {totalItems === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Your shopping list is empty</h3>
              <p>Add ingredients from recipes to start building your list!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([groupName, items]) => (
                <div key={groupName} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {groupName} ({items.length} items)
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                          item.checked 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <label className="flex items-center space-x-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggleItem(item.id)}
                            className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <span className={`font-medium ${
                              item.checked ? 'line-through text-gray-500' : 'text-gray-800'
                            }`}>
                              {item.quantity} {item.item}
                            </span>
                            <div className="text-sm text-gray-500">
                              from {item.recipeName}
                            </div>
                          </div>
                        </label>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Stats */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-warm-orange">{stats.totalRecipesCooked || 0}</div>
              <div className="text-sm text-gray-600">Recipes Cooked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-deep-blue">{stats.countriesExplored || 0}</div>
              <div className="text-sm text-gray-600">Countries Explored</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-rich-green">{totalItems}</div>
              <div className="text-sm text-gray-600">Shopping Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cultural-red">{completionPercentage}%</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
