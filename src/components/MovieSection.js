import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, StarIcon, CalendarIcon, UserIcon, FilmIcon } from '@heroicons/react/24/outline';
import movieData from '../data/movies.json';

function MovieSection({ selectedCountry }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (selectedCountry && selectedCountry.id) {
      setMovies(movieData[selectedCountry.id] || []);
      setSelectedMovie(null);
    } else {
      setMovies([]);
      setSelectedMovie(null);
    }
  }, [selectedCountry]);

  // Early return if no country is selected
  if (!selectedCountry || !selectedCountry.id) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Cinema & Films</h3>
          <p className="text-gray-400">Select a country to explore its movie culture</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-3xl font-bold text-white mb-3">Cinema & Films</h3>
        <p className="text-gray-300 text-lg">Explore {selectedCountry.name}'s movie culture</p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {movies.map((movie) => (
            <motion.div
              key={movie.title}
              className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer focus:outline-none ${
                selectedMovie === movie.title
                  ? 'border-purple-400 bg-purple-400/20 shadow-lg'
                  : 'border-gray-600 hover:border-purple-400/40 hover:bg-gray-700/30 hover:shadow-lg hover:shadow-purple-400/20 focus:border-purple-400 focus:bg-purple-400/20 focus:shadow-lg focus:shadow-purple-400/20'
              }`}
              onClick={() => setSelectedMovie(selectedMovie === movie.title ? null : movie.title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedMovie(selectedMovie === movie.title ? null : movie.title);
                }
              }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              tabIndex={0}
              role="button"
              aria-expanded={selectedMovie === movie.title}
              aria-label={`${movie.title} - Click to ${selectedMovie === movie.title ? 'collapse' : 'expand'} details`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{movie.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-white">{movie.title}</h4>
                    <span className="text-purple-300 text-lg">{movie.rating}</span>
                  </div>
                  <p className="text-gray-300 mb-3">
                    <span className="font-medium">{movie.year}</span> • {movie.director} • {movie.duration}min
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(movie.genre) ? movie.genre.map((g, index) => (
                      <span key={index} className="px-3 py-1 rounded-full text-sm font-medium border border-purple-400/30 bg-purple-400/20 text-purple-400">
                        {g}
                      </span>
                    )) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium border border-purple-400/30 bg-purple-400/20 text-purple-400">
                        {movie.genre}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {selectedMovie === movie.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-600/30"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-semibold text-purple-400 text-sm mb-1">Plot Summary</h5>
                        <p className="text-sm text-gray-300">
                          {movie.description || 'A compelling story that showcases the unique cultural perspective of this region.'}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-blue-400 text-sm mb-1">Category</h5>
                        <p className="text-sm text-gray-300">
                          {movie.category || 'Cultural Film'}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-green-400 text-sm mb-1">Cultural Significance</h5>
                        <p className="text-sm text-gray-300">
                          {movie.cultural_significance || `This film represents important aspects of ${selectedCountry.name}'s culture, storytelling traditions, and cinematic heritage.`}
                        </p>
                      </div>
                      
                      {movie.awards && movie.awards.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-yellow-400 text-sm mb-1">Awards</h5>
                          <p className="text-sm text-gray-300">
                            {movie.awards.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Movies Found</h3>
          <p className="text-gray-400">No movie information available for this country.</p>
        </div>
      )}
    </div>
  );
}

export default MovieSection;

