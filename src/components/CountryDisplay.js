import React from 'react';

function CountryDisplay({ country }) {
  return (
    <div className="card max-w-6xl mx-auto p-8 mb-8 overflow-hidden">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="text-8xl mb-4 animate-bounce-gentle">
          {country.flag}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
          {country.name}
        </h2>
        <div className="inline-block bg-gradient-to-r from-warm-orange to-cultural-red text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          {country.region}
        </div>
        <p className="text-xl text-gray-600 italic max-w-3xl mx-auto leading-relaxed">
          {country.description}
        </p>
      </div>
      
      {/* Country Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🏛️</span>
            <h3 className="text-lg font-semibold text-gray-800">Capital City</h3>
          </div>
          <p className="text-gray-700 font-medium text-lg">{country.capital}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">👥</span>
            <h3 className="text-lg font-semibold text-gray-800">Population</h3>
          </div>
          <p className="text-gray-700 font-medium text-lg">{country.population}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-l-4 border-purple-500">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🗣️</span>
            <h3 className="text-lg font-semibold text-gray-800">Language</h3>
          </div>
          <p className="text-gray-700 font-medium text-lg">{country.language}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-l-4 border-yellow-500">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">💰</span>
            <h3 className="text-lg font-semibold text-gray-800">Currency</h3>
          </div>
          <p className="text-gray-700 font-medium text-lg">{country.currency}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500 md:col-span-2">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-3">🌍</span>
            <h3 className="text-lg font-semibold text-gray-800">Geographic Region</h3>
          </div>
          <p className="text-gray-700 font-medium text-lg">{country.region}</p>
        </div>
      </div>

      {/* Cuisine Section - New Feature */}
      <div className="bg-gradient-to-r from-warm-orange to-cultural-red rounded-2xl p-8 mb-8 text-white">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🍽️</div>
          <h3 className="text-2xl font-bold mb-4">Culinary Heritage</h3>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-xl p-6 backdrop-blur-sm">
          <p className="text-lg leading-relaxed text-center">
            {country.cuisine_description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl mb-2">🥘</div>
            <div className="text-sm font-semibold">Traditional Dishes</div>
            <div className="text-xs opacity-80">Explore authentic flavors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🍷</div>
            <div className="text-sm font-semibold">Local Beverages</div>
            <div className="text-xs opacity-80">Taste regional drinks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎬</div>
            <div className="text-sm font-semibold">Cultural Cinema</div>
            <div className="text-xs opacity-80">Discover film heritage</div>
          </div>
        </div>
      </div>
      
      {/* Cultural Explorer CTA */}
      <div className="text-center">
        <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rich-green to-deep-blue rounded-full text-white font-semibold shadow-lg animate-pulse-glow">
          <span className="mr-3 text-2xl">✨</span>
          <span className="text-lg">Ready to explore {country.name}'s culture?</span>
          <span className="ml-3 text-2xl">✨</span>
        </div>
        <p className="text-gray-600 mt-4 text-sm">
          Scroll down to discover traditional foods, beverages, and films from {country.name}
        </p>
      </div>

      {/* Fun Facts Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">🎭</span>
            Cultural Identity
          </h4>
          <p className="text-sm text-gray-600">
            {country.name} has a unique cultural identity shaped by its geography, 
            history, and the creativity of its people across generations.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <span className="mr-2">🌟</span>
            Global Influence
          </h4>
          <p className="text-sm text-gray-600">
            From cuisine to cinema, {country.name}'s cultural contributions 
            have influenced and inspired people around the world.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CountryDisplay;