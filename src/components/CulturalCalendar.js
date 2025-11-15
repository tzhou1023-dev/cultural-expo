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

    // Add context menu to page
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    const removeContextMenu = () => {
      if (document.body.contains(contextMenu)) {
        document.body.removeChild(contextMenu);
      }
      document.removeEventListener('click', removeContextMenu);
    };
    
    setTimeout(() => {
      document.addEventListener('click', removeContextMenu);
    }, 100);
  }, [year, month, calendarData, onAddExperience, onEditExperience]);

  // Handle delete experience
  const handleDeleteExperience = (experienceId) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      deleteExperience(experienceId);
      // Reload data
      const data = getCalendarData(year, month);
      setCalendarData(data);
      setExperiences(getAllExperiences());
    }
  };

  // Build calendar days array
  const calendarDays = [];

  // Previous month's trailing days
  for (let day = firstDay - 1; day >= 0; day--) {
    const prevMonthDay = daysInPrevMonth - day;
    calendarDays.push(
      <CalendarDay
        key={`prev-${prevMonthDay}`}
        day={prevMonthDay}
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
    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
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
      className="max-w-4xl mx-auto bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Compact Calendar Header */}
      <div className="bg-gradient-to-r from-accent-primary to-accent-secondary p-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-1">
              {MONTHS[month]} {year}
            </h2>
            <p className="text-white text-opacity-80 text-sm flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1 text-white" />
              Cultural Journey Calendar
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
                              <ChevronLeftIcon className="w-5 h-5 text-white" />
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
                              <ChevronRightIcon className="w-5 h-5 text-white" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Compact Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays}
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
      className={`relative min-h-[60px] p-1 border border-gray-600/30 cursor-pointer transition-all duration-200 ${
        isCurrentMonth 
          ? 'hover:bg-gray-700/30' 
          : 'text-gray-500 bg-gray-800/20'
      } ${
        isSelected 
          ? 'bg-accent-primary/20 border-accent-primary/50' 
          : ''
      } ${
        isToday 
          ? 'bg-accent-secondary/20 border-accent-secondary font-bold' 
          : ''
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Day Number */}
      <div className={`text-xs ${isToday ? 'text-accent-secondary' : 'text-gray-300'}`}>
        {day}
      </div>

      {/* Experience Indicators - Focus on Country Flag */}
      {hasExperiences && (
        <div className="mt-1">
          {/* Large Country Flag - Main Focus */}
          <div className="text-2xl mb-1 flex justify-center" title={experience.country.name}>
            {experience.country.flag}
          </div>

          {/* Multiple experiences indicator */}
          {experiences.length > 1 && (
            <div className="absolute top-1 right-1 bg-accent-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {experiences.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CulturalCalendar;
