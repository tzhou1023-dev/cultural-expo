import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FoodSection from './FoodSection';

// Mock the food database
jest.mock('../data/authenticFoodDatabase.json', () => ({
  dishes: {
    'japan': [
      {
        name: 'Sushi',
        type: 'main',
        description: 'Vinegared rice with raw fish, vegetables, or other ingredients',
        difficulty: 'Hard'
      },
      {
        name: 'Ramen',
        type: 'main',
        description: 'Traditional noodle soup with rich broth, often with pork, eggs, and vegetables',
        difficulty: 'Medium'
      }
    ],
    'italy': [
      {
        name: 'Risotto alla Milanese',
        type: 'main',
        description: 'Creamy saffron risotto with bone marrow and parmesan',
        difficulty: 'Medium'
      }
    ]
  }
}));

describe('FoodSection Component', () => {
  const mockCountry = {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia'
  };

  test('component can be imported', () => {
    expect(FoodSection).toBeDefined();
    expect(typeof FoodSection).toBe('function');
  });

  test('renders without crashing', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    expect(screen.getByText('Traditional Cuisine')).toBeInTheDocument();
  });

  test('displays country-specific dishes', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    expect(screen.getByText('Sushi')).toBeInTheDocument();
    expect(screen.getByText('Ramen')).toBeInTheDocument();
    expect(screen.getByText('Traditional Japanese rice dish')).toBeInTheDocument();
    expect(screen.getByText('Japanese noodle soup')).toBeInTheDocument();
  });

  test('shows dish emojis', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Check for dish emojis
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  test('expands recipe details', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Click on a dish card to expand
    const dishCard = screen.getByText('Sushi').closest('div');
    await user.click(dishCard);
    
    // Should show expanded content
    expect(screen.getByText('Cultural Story')).toBeInTheDocument();
    expect(screen.getByText('Dish Information')).toBeInTheDocument();
    expect(screen.getByText('Cooking Tips')).toBeInTheDocument();
  });

  test('collapses recipe details', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Expand a recipe
    const dishCard = screen.getByText('Sushi').closest('div');
    await user.click(dishCard);
    
    // Should show expanded content
    expect(screen.getByText('Cultural Story')).toBeInTheDocument();
    
    // Click again to collapse
    await user.click(dishCard);
    
    // Should hide expanded content
    expect(screen.queryByText('Cultural Story')).not.toBeInTheDocument();
  });

  test('handles country with no dishes', () => {
    const countryWithNoDishes = {
      id: 'antarctica',
      name: 'Antarctica',
      flag: '🇦🇶',
      region: 'Antarctica'
    };
    
    render(<FoodSection selectedCountry={countryWithNoDishes} />);
    
    expect(screen.getByText('No Dishes Found')).toBeInTheDocument();
    expect(screen.getByText('No dish information available for this country.')).toBeInTheDocument();
  });

  test('maintains dark theme styling', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    const section = screen.getByText('Traditional Cuisine').closest('div');
    expect(section).toHaveClass('bg-gray-800/50', 'border', 'border-gray-700/50');
  });

  test('displays proper card layout', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Check that dishes are displayed in a grid layout
    const gridContainer = screen.getByText('Traditional Cuisine').closest('div').querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });

  test('shows cultural story in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Expand a recipe
    const expandButton = screen.getByText('Show Details');
    await user.click(expandButton);
    
    // Should show cultural story
    expect(screen.getByText(/Sushi is a beloved traditional dish/)).toBeInTheDocument();
    expect(screen.getByText(/represents the authentic flavors/)).toBeInTheDocument();
  });

  test('shows dish information in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Expand a recipe
    const expandButton = screen.getByText('Show Details');
    await user.click(expandButton);
    
    // Should show dish information
    expect(screen.getByText('Dish Information')).toBeInTheDocument();
    expect(screen.getByText('Traditional Cuisine')).toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  test('shows cooking tips in expanded view', async () => {
    const user = userEvent.setup();
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Expand a recipe
    const expandButton = screen.getByText('Show Details');
    await user.click(expandButton);
    
    // Should show cooking tips
    expect(screen.getByText('Cooking Tips')).toBeInTheDocument();
    expect(screen.getByText(/To achieve the authentic taste/)).toBeInTheDocument();
  });

  test('handles multiple countries correctly', () => {
    const italyCountry = {
      id: 'italy',
      name: 'Italy',
      flag: '🇮🇹',
      region: 'Europe'
    };
    
    render(<FoodSection selectedCountry={italyCountry} />);
    
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('Classic Italian pizza')).toBeInTheDocument();
  });

  test('displays proper accessibility features', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('Traditional Cuisine')).toBeInTheDocument();
  });

  test('maintains responsive design classes', () => {
    render(<FoodSection selectedCountry={mockCountry} />);
    
    const gridContainer = screen.getByText('Traditional Cuisine').closest('div').querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
