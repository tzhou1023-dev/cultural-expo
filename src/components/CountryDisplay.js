import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Users, MessageCircle, DollarSign, Mountain, Utensils, Film, Music, Palette } from 'lucide-react';

function CountryDisplay({ country }) {
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-6 py-12 space-y-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Hero Section - High Contrast, Clear Hierarchy */}
      <section className="text-center space-y-8" aria-labelledby="country-hero">
        <motion.div 
          className="text-9xl mb-6 animate-bounce-gentle"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          role="img"
          aria-label={`Flag of ${country.name}`}
        >
          {country.flag}
        </motion.div>
        
        <div className="space-y-4">
          <h1 
            id="country-hero"
            className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight"
          >
            {country.name}
          </h1>
          
          <div className="inline-flex items-center px-6 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-full">
            <Globe className="w-5 h-5 text-blue-400 mr-2" aria-hidden="true" />
            <span className="text-lg font-medium text-gray-200">{country.region}</span>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {country.description}
          </p>
        </div>
      </section>
      
      {/* Key Information Grid - Accessible Cards with Proper Contrast */}
      <section className="space-y-8" aria-labelledby="country-info">
        <h2 id="country-info" className="sr-only">Country Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Capital City */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="capital-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-blue-400" aria-hidden="true" />
              </div>
              <h3 id="capital-heading" className="text-xl font-semibold text-white">Capital City</h3>
            </div>
            <p className="text-2xl font-bold text-blue-100">{country.capital}</p>
          </motion.div>
          
          {/* Population */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="population-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-400" aria-hidden="true" />
              </div>
              <h3 id="population-heading" className="text-xl font-semibold text-white">Population</h3>
            </div>
            <p className="text-2xl font-bold text-green-100">{country.population}</p>
          </motion.div>
          
          {/* Language */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="language-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-purple-400" aria-hidden="true" />
              </div>
              <h3 id="language-heading" className="text-xl font-semibold text-white">Language</h3>
            </div>
            <p className="text-2xl font-bold text-purple-100">{country.language}</p>
          </motion.div>
          
          {/* Currency */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 focus-within:ring-2 focus-within:ring-yellow-500/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="currency-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-4">
                <DollarSign className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              </div>
              <h3 id="currency-heading" className="text-xl font-semibold text-white">Currency</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-100">{country.currency}</p>
          </motion.div>
          
          {/* Geographic Region - Spans 2 columns on larger screens */}
          <motion.div 
            className="group bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 md:col-span-2"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            tabIndex="0"
            role="article"
            aria-labelledby="region-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mr-4">
                <Mountain className="w-6 h-6 text-orange-400" aria-hidden="true" />
              </div>
              <h3 id="region-heading" className="text-xl font-semibold text-white">Geographic Region</h3>
            </div>
            <p className="text-2xl font-bold text-orange-100">{country.region}</p>
          </motion.div>
        </div>
      </section>

      {/* Culinary Heritage Section - High Contrast, Accessible */}
      <section className="space-y-8" aria-labelledby="culinary-heritage">
        <div className="text-center space-y-4">
          <h2 id="culinary-heritage" className="text-4xl md:text-5xl font-bold text-white">
            Culinary Heritage
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the authentic flavors and traditional dishes that define {country.name}'s rich culinary culture
          </p>
        </div>
        
        <motion.div 
          className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-10"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-700/30 rounded-2xl p-8 border border-gray-600/30">
            <p className="text-xl leading-relaxed text-center text-gray-200">
              {country.cuisine_description}
            </p>
          </div>
          
          {/* Cultural Exploration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Utensils className="w-8 h-8 text-blue-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Traditional Dishes</h3>
              <p className="text-gray-400 text-sm">Explore authentic flavors</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Music className="w-8 h-8 text-purple-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Local Beverages</h3>
              <p className="text-gray-400 text-sm">Taste regional drinks</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-colors">
                <Film className="w-8 h-8 text-green-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cultural Cinema</h3>
              <p className="text-gray-400 text-sm">Discover film heritage</p>
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Call to Action - Accessible and Prominent */}
      <section className="text-center space-y-6" aria-labelledby="explore-cta">
        <h2 id="explore-cta" className="sr-only">Explore Culture</h2>
        
        <motion.div 
          className="inline-flex items-center px-10 py-6 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-4 focus:ring-offset-gray-900"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          tabIndex="0"
          role="button"
          aria-label={`Explore ${country.name}'s culture`}
        >
          <Palette className="w-6 h-6 mr-3" aria-hidden="true" />
          <span className="text-xl">Ready to explore {country.name}'s culture?</span>
        </motion.div>
        
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Scroll down to discover traditional foods, beverages, and films from {country.name}
        </p>
      </section>

      {/* Cultural Insights - Accessible Information Cards */}
      <section className="space-y-8" aria-labelledby="cultural-insights">
        <h2 id="cultural-insights" className="text-3xl md:text-4xl font-bold text-white text-center">
          Cultural Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            role="article"
            aria-labelledby="cultural-identity-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mr-4">
                <Palette className="w-6 h-6 text-pink-400" aria-hidden="true" />
              </div>
              <h3 id="cultural-identity-heading" className="text-xl font-semibold text-white">
                Cultural Identity
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {country.name} has a unique cultural identity shaped by its geography, 
              history, and the creativity of its people across generations.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 p-8 rounded-2xl hover:bg-gray-800/60 transition-all duration-300 hover:border-gray-600/50"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            role="article"
            aria-labelledby="global-influence-heading"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mr-4">
                <Globe className="w-6 h-6 text-indigo-400" aria-hidden="true" />
              </div>
              <h3 id="global-influence-heading" className="text-xl font-semibold text-white">
                Global Influence
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              From cuisine to cinema, {country.name}'s cultural contributions 
              have influenced and inspired people around the world.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default CountryDisplay;