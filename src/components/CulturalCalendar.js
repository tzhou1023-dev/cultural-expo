import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { getCalendarData, getAllExperiences, deleteExperience } from '../utils/experienceManager';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CulturalCalendar({ onDateSelect, onAddExperience, onEditExperience }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [experiences, setExperiences] = useState([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load calendar data when date changes
  useEffect(() => {
    const data = getCalendarData(year, month);
    setCalendarData(data);
    setExperiences(getAllExperiences());
  }, [year, month]);

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Navigate to current month
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().getDate());
  };

  // Handle date click
  const handleDateClick = (day) => {
    setSelectedDate(day);
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onDateSelect) {
      onDateSelect(dateString, calendarData[day] || []);
    }
  };

  // Handle right-click context menu
  const handleContextMenu = useCallback((e, day) => {
    e.preventDefault();
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayExperiences = calendarData[day] || [];
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.className = 'fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    
    const menuItems = [
      {
        label: '+ Add Experience',
        action: () => onAddExperience && onAddExperience(dateString)
      }
    ];

    if (dayExperiences.length > 0) {
      menuItems.push(
        { label: '✏️ Edit Experience', action: () => onEditExperience && onEditExperience(dayExperiences[0].id) },
        { label: '🗑️ Delete Experience', action: () => handleDeleteExperience(dayExperiences[0].id) }
      );
    }

    menuItems.forEach(item => {
      const menuItem = document.createElement('button');
      menuItem.className = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100';
      menuItem.textContent = item.label;
      menuItem.onclick = () => {
        item.action();
        document.body.removeChild(contextMenu);
      };
      contextMenu.appendChild(menuItem);
    });

    // Remove menu when clicking elsewhere
    const removeMenu = () => {
      if (document.body.contains(contextMenu)) {
        document.body.removeChild(contextMenu);
      }
      document.removeEventListener('click', removeMenu);
    };

    document.addEventListener('click', removeMenu);
    document.body.appendChild(contextMenu);
  }, [calendarData, year, month, onAddExperience, onEditExperience]);

  // Handle delete experience
  const handleDeleteExperience = (experienceId) => {
    if (window.confirm('Are you sure you want to delete this cultural experience?')) {
      deleteExperience(experienceId);
      // Refresh calendar data
      const data = getCalendarData(year, month);
      setCalendarData(data);
      setExperiences(getAllExperiences());
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedDate) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (selectedDate > 1) {
            handleDateClick(selectedDate - 1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (selectedDate < daysInMonth) {
            handleDateClick(selectedDate + 1);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (selectedDate > 7) {
            handleDateClick(selectedDate - 7);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (selectedDate <= daysInMonth - 7) {
            handleDateClick(selectedDate + 7);
          }
          break;
        case 'Enter':
          e.preventDefault();
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
          onAddExperience && onAddExperience(dateString);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedDate, daysInMonth, onAddExperience, year, month]);

  // Generate calendar days
  const calendarDays = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push(
      <CalendarDay
        key={`prev-${day}`}
        day={day}
        isCurrentMonth={false}
        isToday={false}
        isSelected={false}
        experiences={[]}
        onClick={() => {}}
        onContextMenu={() => {}}
        onHover={() => {}}
      />
    );
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      year === new Date().getFullYear() && 
      month === new Date().getMonth() && 
      day === new Date().getDate();
    
    const isSelected = selectedDate === day;
    const dayExperiences = calendarData[day] || [];

    calendarDays.push(
      <CalendarDay
        key={day}
        day={day}
        isCurrentMonth={true}
        isToday={isToday}
        isSelected={isSelected}
        experiences={dayExperiences}
        onClick={() => handleDateClick(day)}
        onContextMenu={(e) => handleContextMenu(e, day)}
        onHover={(hovering) => setHoveredDate(hovering ? day : null)}
      />
    );
  }

  // Next month's leading days
  const remainingCells = 42 - calendarDays.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push(
      <CalendarDay
        key={`next-${day}`}
        day={day}
        isCurrentMonth={false}
        isToday={false}
        isSelected={false}
        experiences={[]}
        onClick={() => {}}
        onContextMenu={() => {}}
        onHover={() => {}}
      />
    );
  }

  return (
    <motion.div 
      className="card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Modern Calendar Header */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-1">
              {MONTHS[month]} {year}
            </h2>
            <p className="text-white text-opacity-80 text-sm flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Your Cultural Journey Calendar
            </p>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              onClick={goToPreviousMonth}
              className="btn btn-icon bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Previous month"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={goToToday}
              className="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0 text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Today
            </motion.button>
            
            <motion.button
              onClick={goToNextMonth}
              className="btn btn-icon bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Next month"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Enhanced Quick Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            { value: experiences.length, label: "Total Experiences", icon: "🌍" },
            { value: new Set(experiences.map(exp => exp.country.id)).size, label: "Countries Explored", icon: "🗺️" },
            { value: Object.keys(calendarData).length, label: "Active Days This Month", icon: "📅" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center bg-white bg-opacity-10 rounded-lg p-3 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <motion.div 
                className="text-2xl font-bold text-white"
                key={stat.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-white text-opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 pb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Food Experience</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Drink Experience</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Movie Experience</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Notes Available</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Right-click on any date for quick actions, use arrow keys to navigate
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function CalendarDay({ 
  day, 
  isCurrentMonth, 
  isToday, 
  isSelected, 
  experiences, 
  onClick, 
  onContextMenu, 
  onHover 
}) {
  const hasExperiences = experiences.length > 0;
  const experience = experiences[0]; // Show first experience if multiple

  return (
    <div
      className={`relative min-h-[80px] p-2 border border-gray-100 cursor-pointer transition-all duration-200 ${
        isCurrentMonth 
          ? 'hover:bg-gray-50' 
          : 'text-gray-300 bg-gray-50'
      } ${
        isSelected 
          ? 'bg-warm-orange bg-opacity-20 border-warm-orange' 
          : ''
      } ${
        isToday 
          ? 'bg-blue-50 border-blue-300 font-bold' 
          : ''
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Day Number */}
      <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
        {day}
      </div>

      {/* Experience Indicators */}
      {hasExperiences && (
        <div className="mt-1">
          {/* Country Flag */}
          <div className="text-lg mb-1" title={experience.country.name}>
            {experience.country.flag}
          </div>

          {/* Activity Dots */}
          <div className="flex space-x-1">
            {experience.completedItems.dishes > 0 && (
              <div 
                className="w-2 h-2 bg-green-500 rounded-full" 
                title={`${experience.completedItems.dishes} dishes attempted`}
              />
            )}
            {experience.completedItems.drinks > 0 && (
              <div 
                className="w-2 h-2 bg-blue-500 rounded-full" 
                title={`${experience.completedItems.drinks} drinks tried`}
              />
            )}
            {experience.completedItems.movies > 0 && (
              <div 
                className="w-2 h-2 bg-purple-500 rounded-full" 
                title={`${experience.completedItems.movies} movies watched`}
              />
            )}
            {experience.hasNotes && (
              <div 
                className="w-2 h-2 bg-yellow-500 rounded-full" 
                title="Has notes"
              />
            )}
          </div>

          {/* Multiple experiences indicator */}
          {experiences.length > 1 && (
            <div className="absolute top-1 right-1 bg-warm-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {experiences.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CulturalCalendar;
