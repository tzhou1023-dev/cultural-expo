import React, { useState, useEffect } from 'react';

const movieData = {
  japan: [
    { name: 'Spirited Away', emoji: '👻', year: '2001', genre: 'Animation', director: 'Hayao Miyazaki', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Seven Samurai', emoji: '⚔️', year: '1954', genre: 'Action/Drama', director: 'Akira Kurosawa', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Your Name', emoji: '🌟', year: '2016', genre: 'Romance/Drama', director: 'Makoto Shinkai', rating: '⭐⭐⭐⭐' }
  ],
  italy: [
    { name: 'Life is Beautiful', emoji: '❤️', year: '1997', genre: 'Comedy/Drama', director: 'Roberto Benigni', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Cinema Paradiso', emoji: '🎬', year: '1988', genre: 'Drama', director: 'Giuseppe Tornatore', rating: '⭐⭐⭐⭐⭐' },
    { name: 'The Bicycle Thief', emoji: '🚲', year: '1948', genre: 'Drama', director: 'Vittorio De Sica', rating: '⭐⭐⭐⭐' }
  ],
  mexico: [
    { name: 'Coco', emoji: '💀', year: '2017', genre: 'Animation/Family', director: 'Lee Unkrich', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Amores Perros', emoji: '🐕', year: '2000', genre: 'Drama/Thriller', director: 'Alejandro G. Iñárritu', rating: '⭐⭐⭐⭐' },
    { name: 'Roma', emoji: '🏠', year: '2018', genre: 'Drama', director: 'Alfonso Cuarón', rating: '⭐⭐⭐⭐⭐' }
  ],
  india: [
    { name: 'Lagaan', emoji: '🏏', year: '2001', genre: 'Sports/Drama', director: 'Ashutosh Gowariker', rating: '⭐⭐⭐⭐⭐' },
    { name: '3 Idiots', emoji: '🎓', year: '2009', genre: 'Comedy/Drama', director: 'Rajkumar Hirani', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Pather Panchali', emoji: '🌾', year: '1955', genre: 'Drama', director: 'Satyajit Ray', rating: '⭐⭐⭐⭐⭐' }
  ],
  france: [
    { name: 'Amélie', emoji: '💚', year: '2001', genre: 'Romance/Comedy', director: 'Jean-Pierre Jeunet', rating: '⭐⭐⭐⭐⭐' },
    { name: 'The 400 Blows', emoji: '👦', year: '1959', genre: 'Drama', director: 'François Truffaut', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Blue Is the Warmest Color', emoji: '💙', year: '2013', genre: 'Romance/Drama', director: 'Abdellatif Kechiche', rating: '⭐⭐⭐⭐' }
  ],
  brazil: [
    { name: 'City of God', emoji: '🏙️', year: '2002', genre: 'Crime/Drama', director: 'Fernando Meirelles', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Black Orpheus', emoji: '🎭', year: '1959', genre: 'Romance/Drama', director: 'Marcel Camus', rating: '⭐⭐⭐⭐' },
    { name: 'Elite Squad', emoji: '🚁', year: '2007', genre: 'Action/Crime', director: 'José Padilha', rating: '⭐⭐⭐⭐' }
  ],
  egypt: [
    { name: 'Cairo Station', emoji: '🚂', year: '1958', genre: 'Drama/Thriller', director: 'Youssef Chahine', rating: '⭐⭐⭐⭐' },
    { name: 'The Yacoubian Building', emoji: '🏢', year: '2006', genre: 'Drama', director: 'Marwan Hamed', rating: '⭐⭐⭐⭐' },
    { name: 'Alexandria... Why?', emoji: '🏛️', year: '1979', genre: 'Drama/War', director: 'Youssef Chahine', rating: '⭐⭐⭐⭐' }
  ],
  thailand: [
    { name: 'Uncle Boonmee', emoji: '👻', year: '2010', genre: 'Drama/Fantasy', director: 'Apichatpong Weerasethakul', rating: '⭐⭐⭐⭐' },
    { name: 'The Beach', emoji: '🏖️', year: '2000', genre: 'Adventure/Drama', director: 'Danny Boyle', rating: '⭐⭐⭐' },
    { name: 'Ong-Bak', emoji: '🥊', year: '2003', genre: 'Action/Martial Arts', director: 'Prachya Pinkaew', rating: '⭐⭐⭐⭐' }
  ],
  morocco: [
    { name: 'Casablanca', emoji: '🎭', year: '1942', genre: 'Romance/Drama', director: 'Michael Curtiz', rating: '⭐⭐⭐⭐⭐' },
    { name: 'The Sheltering Sky', emoji: '🏜️', year: '1990', genre: 'Drama', director: 'Bernardo Bertolucci', rating: '⭐⭐⭐⭐' },
    { name: 'Horses of God', emoji: '🐎', year: '2012', genre: 'Drama', director: 'Nabil Ayouch', rating: '⭐⭐⭐⭐' }
  ],
  greece: [
    { name: 'Zorba the Greek', emoji: '💃', year: '1964', genre: 'Drama/Comedy', director: 'Michael Cacoyannis', rating: '⭐⭐⭐⭐⭐' },
    { name: 'Dogtooth', emoji: '🦷', year: '2009', genre: 'Drama/Thriller', director: 'Yorgos Lanthimos', rating: '⭐⭐⭐⭐' },
    { name: 'Never on Sunday', emoji: '☀️', year: '1960', genre: 'Comedy/Drama', director: 'Jules Dassin', rating: '⭐⭐⭐⭐' }
  ]
};

function MovieSection({ country }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(movieData[country.id] || []);
    setSelectedMovie(null);
  }, [country]);

  const getGenreColor = (genre) => {
    if (genre.includes('Action')) return 'text-red-600 bg-red-100';
    if (genre.includes('Comedy')) return 'text-yellow-600 bg-yellow-100';
    if (genre.includes('Drama')) return 'text-blue-600 bg-blue-100';
    if (genre.includes('Romance')) return 'text-pink-600 bg-pink-100';
    if (genre.includes('Animation')) return 'text-purple-600 bg-purple-100';
    if (genre.includes('Thriller')) return 'text-gray-600 bg-gray-100';
    return 'text-green-600 bg-green-100';
  };

  const getDecadeStyle = (year) => {
    const decade = Math.floor(year / 10) * 10;
    if (decade >= 2010) return 'border-l-4 border-blue-500';
    if (decade >= 2000) return 'border-l-4 border-green-500';
    if (decade >= 1990) return 'border-l-4 border-yellow-500';
    if (decade >= 1980) return 'border-l-4 border-orange-500';
    return 'border-l-4 border-red-500';
  };

  return (
    <div className="section-card">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🎬</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Cinema & Films</h3>
        <p className="text-gray-600">Explore {country.name}'s movie culture</p>
      </div>

      <div className="space-y-4">
        {movies.map((movie, index) => (
          <div
            key={movie.name}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${getDecadeStyle(movie.year)} ${
              selectedMovie === movie.name
                ? 'border-rich-green bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-rich-green hover:bg-green-25'
            }`}
            onClick={() => setSelectedMovie(selectedMovie === movie.name ? null : movie.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{movie.emoji}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{movie.name}</h4>
                  <p className="text-sm text-gray-600">{movie.year} • {movie.director}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenreColor(movie.genre)}`}>
                  {movie.genre}
                </span>
                <span className="text-gray-400">
                  {selectedMovie === movie.name ? '▼' : '▶'}
                </span>
              </div>
            </div>
            
            {selectedMovie === movie.name && (
              <div className="mt-4 pt-4 border-t border-green-200 animate-fade-in">
                <div className="bg-white p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">Director</h5>
                      <span className="text-sm text-gray-600">{movie.director}</span>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 text-sm mb-1">Rating</h5>
                      <span className="text-sm">{movie.rating}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <h5 className="font-semibold text-gray-800 text-sm mb-1">Cultural Impact</h5>
                    <p className="text-sm text-gray-600">
                      This film represents important aspects of {country.name}'s culture, 
                      storytelling traditions, and cinematic heritage.
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    🎭 Film Tip: Look for this movie on streaming platforms or at your local library
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {movies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Movie data for {country.name} coming soon!</p>
        </div>
      )}
    </div>
  );
}

export default MovieSection;
