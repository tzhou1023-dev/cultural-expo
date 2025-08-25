import React, { useState, useEffect } from 'react';
import { getCulturalStatistics, getAllExperiences, searchExperiences } from '../utils/experienceManager';

function ProgressDashboard({ isOpen, onClose }) {
  const [stats, setStats] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState({});
  const [searchFilters, setSearchFilters] = useState({
    country: '',
    dateFrom: '',
    dateTo: '',
    minRating: 0,
    searchText: ''
  });
  const [filteredExperiences, setFilteredExperiences] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    // Apply search filters
    const filtered = searchExperiences(searchFilters);
    setFilteredExperiences(filtered);
  }, [searchFilters, experiences]);

  const loadData = () => {
    const statistics = getCulturalStatistics();
    const allExperiences = getAllExperiences();
    
    setStats(statistics);
    setExperiences(allExperiences);
    setFilteredExperiences(allExperiences);
    
    // Prepare chart data
    prepareChartData(allExperiences);
  };

  const prepareChartData = (experiences) => {
    // Monthly activity chart
    const monthlyActivity = {};
    experiences.forEach(exp => {
      const month = exp.date.substring(0, 7); // YYYY-MM
      monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
    });

    // Rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    experiences.forEach(exp => {
      [...(exp.dishes || []), ...(exp.drinks || []), ...(exp.movies || [])].forEach(item => {
        if (item.rating && item.rating > 0) {
          ratingDistribution[item.rating]++;
        }
      });
    });

    // Country exploration over time
    const countryTimeline = {};
    experiences.forEach(exp => {
      const month = exp.date.substring(0, 7);
      if (!countryTimeline[month]) {
        countryTimeline[month] = new Set();
      }
      countryTimeline[month].add(exp.country.id);
    });

    // Convert sets to counts
    Object.keys(countryTimeline).forEach(month => {
      countryTimeline[month] = countryTimeline[month].size;
    });

    setChartData({
      monthlyActivity,
      ratingDistribution,
      countryTimeline
    });
  };

  const handleSearchChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      country: '',
      dateFrom: '',
      dateTo: '',
      minRating: 0,
      searchText: ''
    });
  };

  const getAchievementProgress = (achievement, currentValue) => {
    return Math.min((currentValue / achievement.threshold) * 100, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Cultural Journey</h2>
            <p className="text-gray-600">Track your progress and achievements</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'experiences', label: 'All Experiences', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'text-warm-orange border-b-2 border-warm-orange bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Experiences"
                  value={stats.totalExperiences || 0}
                  icon="🌍"
                  color="bg-blue-100 text-blue-800"
                />
                <StatCard
                  title="Countries Explored"
                  value={stats.countriesExplored || 0}
                  icon="🗺️"
                  color="bg-green-100 text-green-800"
                />
                <StatCard
                  title="Dishes Attempted"
                  value={stats.totalDishesAttempted || 0}
                  icon="🍽️"
                  color="bg-orange-100 text-orange-800"
                />
                <StatCard
                  title="Movies Watched"
                  value={stats.totalMoviesWatched || 0}
                  icon="🎬"
                  color="bg-purple-100 text-purple-800"
                />
              </div>

              {/* Average Ratings */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Average Ratings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RatingDisplay
                    title="Food"
                    rating={stats.averageRatings?.dishes || 0}
                    icon="🍽️"
                  />
                  <RatingDisplay
                    title="Drinks"
                    rating={stats.averageRatings?.drinks || 0}
                    icon="🍹"
                  />
                  <RatingDisplay
                    title="Movies"
                    rating={stats.averageRatings?.movies || 0}
                    icon="🎬"
                  />
                </div>
              </div>

              {/* Favorite Cuisines */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Favorite Cuisines</h3>
                <div className="space-y-3">
                  {Object.entries(stats.favoriteCuisines || {})
                    .sort((a, b) => b[1].avgRating - a[1].avgRating)
                    .slice(0, 5)
                    .map(([cuisine, data]) => (
                      <div key={cuisine} className="flex items-center justify-between">
                        <span className="font-medium">{cuisine}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{data.count} dishes</span>
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(star => (
                              <span key={star} className={star <= data.avgRating ? '' : 'opacity-30'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Recent Experiences */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Experiences</h3>
                <div className="space-y-3">
                  {(stats.recentExperiences || []).slice(0, 5).map(exp => (
                    <div key={exp.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{exp.country.flag}</span>
                        <div>
                          <div className="font-medium">{exp.country.name}</div>
                          <div className="text-sm text-gray-500">{exp.date}</div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {exp.dishes?.some(d => d.attempted) && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                        {exp.drinks?.some(d => d.attempted) && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        {exp.movies?.some(m => m.watched) && <span className="w-2 h-2 bg-purple-500 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(stats.achievements || []).map(achievement => (
                  <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{achievement.emoji}</span>
                      <div>
                        <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <div className="ml-auto text-green-600">✅</div>
                      )}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-warm-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getAchievementProgress(achievement, achievement.value)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {achievement.value} / {achievement.threshold}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Monthly Activity Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Activity</h3>
                <MonthlyActivityChart data={chartData.monthlyActivity || {}} />
              </div>

              {/* Rating Distribution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Rating Distribution</h3>
                <RatingDistributionChart data={chartData.ratingDistribution || {}} />
              </div>

              {/* Most Active Months */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Most Active Months</h3>
                <div className="space-y-2">
                  {Object.entries(stats.mostActiveMonths || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span>{new Date(month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                        <span className="font-bold text-warm-orange">{count} experiences</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* All Experiences Tab */}
          {activeTab === 'experiences' && (
            <div className="space-y-6">
              {/* Search Filters */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Search & Filter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Search text..."
                    value={searchFilters.searchText}
                    onChange={(e) => handleSearchChange('searchText', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    placeholder="From date"
                    value={searchFilters.dateFrom}
                    onChange={(e) => handleSearchChange('dateFrom', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    placeholder="To date"
                    value={searchFilters.dateTo}
                    onChange={(e) => handleSearchChange('dateTo', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                  <select
                    value={searchFilters.minRating}
                    onChange={(e) => handleSearchChange('minRating', parseInt(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value={0}>Any rating</option>
                    <option value={1}>1+ stars</option>
                    <option value={2}>2+ stars</option>
                    <option value={3}>3+ stars</option>
                    <option value={4}>4+ stars</option>
                    <option value={5}>5 stars only</option>
                  </select>
                  <button
                    onClick={clearFilters}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Experience List */}
              <div className="space-y-4">
                {filteredExperiences.map(exp => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
                
                {filteredExperiences.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-3">🔍</div>
                    <p>No experiences found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
        <div className={`text-2xl p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function RatingDisplay({ title, rating, icon }) {
  return (
    <div className="text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium text-gray-800">{title}</div>
      <div className="flex justify-center text-yellow-400 text-lg">
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? '' : 'opacity-30'}>
            ⭐
          </span>
        ))}
      </div>
      <div className="text-sm text-gray-600">{rating.toFixed(1)}/5.0</div>
    </div>
  );
}

function MonthlyActivityChart({ data }) {
  const maxValue = Math.max(...Object.values(data), 1);
  
  return (
    <div className="space-y-2">
      {Object.entries(data)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12) // Last 12 months
        .map(([month, count]) => (
          <div key={month} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600">
              {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
              <div 
                className="bg-warm-orange h-4 rounded-full transition-all duration-300"
                style={{ width: `${(count / maxValue) * 100}%` }}
              ></div>
              <span className="absolute right-2 top-0 text-xs text-gray-600 leading-4">
                {count}
              </span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function RatingDistributionChart({ data }) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map(rating => (
        <div key={rating} className="flex items-center space-x-3">
          <div className="w-8 text-sm text-gray-600">{rating}⭐</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div 
              className="bg-yellow-400 h-4 rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${(data[rating] / total) * 100}%` : '0%' }}
            ></div>
            <span className="absolute right-2 top-0 text-xs text-gray-600 leading-4">
              {data[rating]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceCard({ experience }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{experience.country.flag}</span>
          <div>
            <h3 className="font-bold text-gray-800">{experience.country.name}</h3>
            <p className="text-sm text-gray-600">{experience.date}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {experience.dishes?.filter(d => d.attempted).length > 0 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {experience.dishes.filter(d => d.attempted).length} dishes
            </span>
          )}
          {experience.drinks?.filter(d => d.attempted).length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {experience.drinks.filter(d => d.attempted).length} drinks
            </span>
          )}
          {experience.movies?.filter(m => m.watched).length > 0 && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {experience.movies.filter(m => m.watched).length} movies
            </span>
          )}
        </div>
      </div>
      
      {experience.overall_notes && (
        <p className="text-sm text-gray-600 italic">"{experience.overall_notes}"</p>
      )}
    </div>
  );
}

export default ProgressDashboard;
