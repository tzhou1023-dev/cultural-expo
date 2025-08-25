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

function DrinkSection({ country }) {
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
    setDrinks(drinkData[country.id] || []);
    setSelectedDrink(null);
  }, [country]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Alcoholic': return 'text-red-600 bg-red-100';
      case 'Coffee': case 'Iced Coffee': return 'text-amber-600 bg-amber-100';
      case 'Hot Tea': case 'Iced Tea': case 'Herbal Tea': return 'text-green-600 bg-green-100';
      case 'Cocktail': return 'text-purple-600 bg-purple-100';
      case 'Juice': return 'text-orange-600 bg-orange-100';
      case 'Soft Drink': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTemperatureIcon = (temperature) => {
    if (temperature.includes('Hot')) return '🔥';
    if (temperature.includes('Cold')) return '❄️';
    return '🌡️';
  };

  return (
    <div className="section-card">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🍹</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Popular Drinks</h3>
        <p className="text-gray-600">Taste {country.name}'s beverages</p>
      </div>

      <div className="space-y-4">
        {drinks.map((drink, index) => (
          <div
            key={drink.name}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
              selectedDrink === drink.name
                ? 'border-deep-blue bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-deep-blue hover:bg-blue-25'
            }`}
            onClick={() => setSelectedDrink(selectedDrink === drink.name ? null : drink.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{drink.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{drink.name}</h4>
                  <p className="text-sm text-gray-600">{drink.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(drink.type)}`}>
                  {drink.type}
                </span>
                <span className="text-gray-400">
                  {selectedDrink === drink.name ? '▼' : '▶'}
                </span>
              </div>
            </div>
            
            {selectedDrink === drink.name && (
              <div className="mt-4 pt-4 border-t border-blue-200 animate-fade-in">
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">Serving Temperature</h5>
                      <div className="flex items-center space-x-1">
                        <span>{getTemperatureIcon(drink.temperature)}</span>
                        <span className="text-sm text-gray-600">{drink.temperature}</span>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">Best Time</h5>
                      <span className="text-sm text-gray-600">
                        {drink.type === 'Coffee' || drink.type === 'Hot Tea' ? 'Morning' :
                         drink.type === 'Alcoholic' || drink.type === 'Cocktail' ? 'Evening' :
                         'Anytime'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    🍃 Cultural Note: This drink is an integral part of {country.name}'s social traditions
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {drinks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Drink data for {country.name} coming soon!</p>
        </div>
      )}
    </div>
  );
}

export default DrinkSection;
