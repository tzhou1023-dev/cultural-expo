import React, { useState, useEffect } from 'react';

const drinkData = {
  japan: [
    { name: 'Sake', emoji: '🍶', description: 'Traditional rice wine', type: 'Alcoholic', temperature: 'Warm/Cold' },
    { name: 'Matcha', emoji: '🍵', description: 'Powdered green tea', type: 'Hot Tea', temperature: 'Hot' },
    { name: 'Ramune', emoji: '🥤', description: 'Marble soda with unique flavors', type: 'Soft Drink', temperature: 'Cold' }
  ],
  italy: [
    { name: 'Espresso', emoji: '☕', description: 'Strong, concentrated coffee', type: 'Coffee', temperature: 'Hot' },
    { name: 'Limoncello', emoji: '🍋', description: 'Lemon liqueur from Amalfi', type: 'Alcoholic', temperature: 'Cold' },
    { name: 'Aperol Spritz', emoji: '🍊', description: 'Orange aperitif with prosecco', type: 'Cocktail', temperature: 'Cold' }
  ],
  mexico: [
    { name: 'Horchata', emoji: '🥛', description: 'Sweet rice and cinnamon drink', type: 'Traditional', temperature: 'Cold' },
    { name: 'Tequila', emoji: '🥃', description: 'Agave-based spirit', type: 'Alcoholic', temperature: 'Room Temp' },
    { name: 'Agua Fresca', emoji: '🍉', description: 'Fresh fruit water', type: 'Soft Drink', temperature: 'Cold' }
  ],
  india: [
    { name: 'Chai', emoji: '🫖', description: 'Spiced milk tea', type: 'Hot Tea', temperature: 'Hot' },
    { name: 'Lassi', emoji: '🥛', description: 'Yogurt-based drink', type: 'Traditional', temperature: 'Cold' },
    { name: 'Nimbu Pani', emoji: '🍋', description: 'Spiced lemonade', type: 'Soft Drink', temperature: 'Cold' }
  ],
  france: [
    { name: 'Wine', emoji: '🍷', description: 'World-renowned wines', type: 'Alcoholic', temperature: 'Room Temp' },
    { name: 'Café au Lait', emoji: '☕', description: 'Coffee with hot milk', type: 'Coffee', temperature: 'Hot' },
    { name: 'Pastis', emoji: '🥃', description: 'Anise-flavored aperitif', type: 'Alcoholic', temperature: 'Cold' }
  ],
  brazil: [
    { name: 'Caipirinha', emoji: '🍸', description: 'Cachaça with lime and sugar', type: 'Cocktail', temperature: 'Cold' },
    { name: 'Guaraná', emoji: '🥤', description: 'Brazilian soda made from guaraná', type: 'Soft Drink', temperature: 'Cold' },
    { name: 'Açaí Juice', emoji: '🍇', description: 'Antioxidant-rich berry juice', type: 'Juice', temperature: 'Cold' }
  ],
  egypt: [
    { name: 'Karkade', emoji: '🌺', description: 'Hibiscus tea', type: 'Herbal Tea', temperature: 'Hot/Cold' },
    { name: 'Sahlab', emoji: '🥛', description: 'Hot milk drink with orchid root', type: 'Traditional', temperature: 'Hot' },
    { name: 'Tamarind Juice', emoji: '🌰', description: 'Sweet and sour fruit drink', type: 'Juice', temperature: 'Cold' }
  ],
  thailand: [
    { name: 'Thai Iced Tea', emoji: '🧊', description: 'Sweet tea with condensed milk', type: 'Iced Tea', temperature: 'Cold' },
    { name: 'Coconut Water', emoji: '🥥', description: 'Fresh from young coconuts', type: 'Natural', temperature: 'Cold' },
    { name: 'Singha Beer', emoji: '🍺', description: 'Popular Thai lager', type: 'Alcoholic', temperature: 'Cold' }
  ],
  morocco: [
    { name: 'Mint Tea', emoji: '🍃', description: 'Sweet green tea with fresh mint', type: 'Hot Tea', temperature: 'Hot' },
    { name: 'Almond Milk', emoji: '🥛', description: 'Traditional almond drink', type: 'Traditional', temperature: 'Cold' },
    { name: 'Orange Juice', emoji: '🍊', description: 'Fresh from Moroccan oranges', type: 'Juice', temperature: 'Cold' }
  ],
  greece: [
    { name: 'Ouzo', emoji: '🥃', description: 'Anise-flavored aperitif', type: 'Alcoholic', temperature: 'Cold' },
    { name: 'Greek Coffee', emoji: '☕', description: 'Strong, unfiltered coffee', type: 'Coffee', temperature: 'Hot' },
    { name: 'Frappé', emoji: '🧊', description: 'Iced coffee drink', type: 'Iced Coffee', temperature: 'Cold' }
  ]
};

function DrinkSection({ selectedCountry }) {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.id) {
      setDrinks(drinkData[selectedCountry.id] || []);
      setSelectedDrink(null);
    } else {
      setDrinks([]);
      setSelectedDrink(null);
    }
  }, [selectedCountry]);

  // Early return if no country is selected
  if (!selectedCountry || !selectedCountry.id) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🍹</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Popular Drinks</h3>
          <p className="text-gray-400">Select a country to explore its beverages</p>
        </div>
      </div>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Alcoholic': return 'text-red-400 bg-red-900/20 border-red-500/30';
      case 'Coffee': case 'Iced Coffee': return 'text-amber-400 bg-amber-900/20 border-amber-500/30';
      case 'Hot Tea': case 'Iced Tea': case 'Herbal Tea': return 'text-green-400 bg-green-900/20 border-green-500/30';
      case 'Cocktail': return 'text-purple-400 bg-purple-900/20 border-purple-500/30';
      case 'Juice': return 'text-orange-400 bg-orange-900/20 border-orange-500/30';
      case 'Soft Drink': return 'text-blue-400 bg-blue-900/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30';
    }
  };

  const getTemperatureIcon = (temperature) => {
    if (temperature.includes('Hot')) return '🔥';
    if (temperature.includes('Cold')) return '❄️';
    return '🌡️';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍹</div>
        <h3 className="text-3xl font-bold text-white mb-3">Popular Drinks</h3>
        <p className="text-gray-300 text-lg">Taste {selectedCountry.name}'s beverages</p>
      </div>

      <div className="space-y-4">
        {drinks.map((drink, index) => (
          <div
            key={drink.name}
            className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
              selectedDrink === drink.name
                ? 'border-blue-500 bg-blue-900/20 shadow-lg'
                : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/30'
            }`}
            onClick={() => setSelectedDrink(selectedDrink === drink.name ? null : drink.name)}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{drink.emoji}</div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">{drink.name}</h4>
                <p className="text-gray-300 mb-3">{drink.description}</p>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(drink.type)}`}>
                    {drink.type}
                  </span>
                  <span className="text-gray-400 flex items-center space-x-2">
                    <span>{getTemperatureIcon(drink.temperature)}</span>
                    <span>{drink.temperature}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {drinks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No drink information available for this country.</p>
        </div>
      )}
    </div>
  );
}

export default DrinkSection;
