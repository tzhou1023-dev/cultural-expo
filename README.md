# Cultural Expo 🌍

A beautiful React web application that lets you discover cultures from around the world through food, drinks, and movies.

## Features

### 🌍 **Core Discovery Experience**
- **Modern, Clean UI**: Built with Tailwind CSS and custom animations
- **Responsive Design**: Works perfectly on mobile and desktop devices
- **Comprehensive Database**: 50+ countries with detailed cultural information
- **Smart Random Selection**: No-repeat random discovery with localStorage persistence
- **Interactive Sections**: Explore food recipes, traditional drinks, and cultural films

### 📅 **Cultural Calendar System**
- **Interactive Monthly Calendar**: Main homepage feature showing your cultural journey
- **Experience Tracking**: Visual indicators for completed activities (food/drinks/movies)
- **Quick Actions**: Right-click context menus for adding/editing/deleting experiences
- **Keyboard Navigation**: Arrow keys, Enter to edit, full accessibility support
- **Country Flags**: Visual country indicators on calendar dates
- **Activity Dots**: Color-coded dots showing completed food (green), drinks (blue), movies (purple)

### 📝 **Experience Management**
- **Manual Entry System**: Multi-step form for adding past cultural experiences
- **Detailed Experience Records**: Date, country, dishes, drinks, movies with ratings and notes
- **Smart Validation**: Prevents duplicates, validates required fields
- **Edit/Delete Functionality**: Full CRUD operations for experience management
- **Bulk Operations**: Mark multiple items as completed quickly
- **Search & Filter**: Find experiences by country, date, rating, or text search

### 📊 **Progress Tracking & Analytics**
- **Comprehensive Dashboard**: Statistics, achievements, and progress visualization
- **Achievement System**: Unlock badges for milestones (10 countries, 25 dishes, etc.)
- **Visual Charts**: Monthly activity, rating distribution, country exploration timeline
- **Favorite Cuisines**: Track your highest-rated culinary experiences
- **Recent Activity**: Quick view of your latest cultural adventures
- **Export Functionality**: Download your cultural journal as JSON

### 🍽️ **Enhanced Recipe System**
- **Detailed Recipes**: Complete ingredients, instructions, prep/cook times
- **Interactive Checklists**: Check off ingredients as you cook
- **Shopping List Integration**: Add recipe ingredients to persistent shopping list
- **Print-Friendly Recipes**: Clean layouts optimized for printing
- **Cooking Tracker**: Mark recipes as cooked with date tracking
- **Difficulty Filters**: Filter recipes by Easy/Medium/Hard levels
- **Dietary Tags**: Vegetarian, vegan, gluten-free, and more

### 🛒 **Smart Shopping & Planning**
- **Persistent Shopping Lists**: Organized by category or recipe
- **Progress Tracking**: Visual completion percentages and statistics
- **Export Lists**: Download shopping lists as text files
- **Group Management**: Organize ingredients by category (protein, vegetables, etc.)
- **Quick Actions**: Check off items, remove individual items, clear all

### 💾 **Data Persistence & Backup**
- **localStorage Integration**: All data persists across browser sessions
- **Import/Export**: Backup and restore your entire cultural journey
- **Data Validation**: Graceful error handling and data integrity checks
- **User Preferences**: Theme settings, default views, and personalization
- **Statistics Tracking**: Comprehensive analytics on your cultural exploration

### 🎨 **Enhanced User Experience**
- **Loading Animations**: Smooth transitions and engaging interactions
- **Dark/Light Mode Ready**: Prepared for theme switching
- **Mobile Responsive**: Optimized for all screen sizes with touch interactions
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Context Menus**: Right-click actions throughout the interface
- **Smooth Animations**: Custom CSS animations for delightful interactions

## Components

- **App.js**: Main application component with header and layout
- **CountrySelector.js**: Random country picker with flag grid
- **CountryDisplay.js**: Shows selected country information with flag and details
- **FoodSection.js**: Displays traditional dishes with recipes and difficulty levels
- **DrinkSection.js**: Shows popular beverages with serving information
- **MovieSection.js**: Features cultural films and cinema recommendations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd cultural-expo
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Technologies Used

- **React 18**: Modern React with functional components and hooks
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Custom Animations**: CSS keyframes and transitions
- **Responsive Design**: Mobile-first approach

## Countries Featured

The app includes comprehensive cultural data for **50+ countries** from all continents:

### 🌍 **Africa**
- Egypt, Ethiopia, Nigeria, South Africa, Morocco

### 🌏 **Asia** 
- Japan, China, India, Thailand, South Korea, Vietnam, Indonesia, Philippines, Iran, Israel, Pakistan, Bangladesh, Saudi Arabia

### 🌍 **Europe**
- Italy, France, Germany, Spain, Greece, United Kingdom, Poland, Sweden, Norway, Denmark, Finland, Netherlands, Belgium, Austria, Switzerland, Ireland, Portugal, Czech Republic, Hungary, Romania, Croatia, Ukraine, Russia

### 🌎 **North America**
- Mexico, Canada

### 🌎 **South America** 
- Brazil, Argentina, Peru, Chile, Colombia, Venezuela, Ecuador, Uruguay

### 🌏 **Oceania**
- Australia

Each country features detailed information including cuisine descriptions, traditional foods, beverages, cultural films, and regional context.

## Building for Production

To create a production build:

```bash
npm run build
```

## Contributing

Feel free to add more countries, update cultural data, or enhance the UI/UX!

---

**Cultural Expo** - Bringing the world closer, one culture at a time 🌍✨
