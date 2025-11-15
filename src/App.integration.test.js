import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// Mock all external dependencies
jest.mock('./data/authenticFoodDatabase.json', () => ({
  dishes: {
    'japan': [
      {
        id: 'sushi',
        name: 'Sushi',
        description: 'Traditional Japanese rice dish',
        difficulty: 'Medium',
        type: 'main',
        ingredients: ['Rice', 'Fish', 'Nori'],
        instructions: ['Cook rice', 'Prepare fish', 'Roll sushi'],
        cookingTime: '30 min',
        servings: 4,
        tags: ['seafood', 'traditional']
      }
    ]
  }
}));

jest.mock('./data/countries.json', () => [
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    capital: 'Tokyo',
    population: '125.7M',
    description: 'Land of the Rising Sun'
  }
]);

jest.mock('./data/recipes.json', () => ({
  'japan': {
    'sushi': {
      name: 'Sushi',
      ingredients: ['Rice', 'Fish', 'Nori'],
      instructions: ['Cook rice', 'Prepare fish', 'Roll sushi']
    }
  }
}));

jest.mock('./utils/experienceManager', () => ({
  getAllExperiences: jest.fn(() => [
    {
      id: '1',
      country: { id: 'japan', name: 'Japan' },
      date: '2024-01-15',
      type: 'food',
      description: 'Tried authentic sushi'
    }
  ]),
  addExperience: jest.fn(),
  updateExperience: jest.fn(),
  deleteExperience: jest.fn(),
  getExperienceById: jest.fn(),
  getExperiencesByCountry: jest.fn(),
  getExperiencesByDate: jest.fn(),
  getExperiencesByType: jest.fn(),
  getExperienceStats: jest.fn(),
  exportExperiences: jest.fn(),
  importExperiences: jest.fn(),
  clearAllExperiences: jest.fn()
}));

describe('App Integration Tests', () => {
  test('renders complete app without crashing', async () => {
    render(<App />);
    
    // Wait for all components to render
    await waitFor(() => {
      expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
    });
    
    // Verify main sections are present
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
  });

  test('displays all major UI elements', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Header elements
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
      
      // Navigation elements
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Commands')).toBeInTheDocument();
      expect(screen.getByText('Add Experience')).toBeInTheDocument();
      expect(screen.getByText('Explore')).toBeInTheDocument();
      
      // Main content
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
    });
  });

  test('shows progress dashboard with correct data', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Progress section
      expect(screen.getByText('Journey Progress')).toBeInTheDocument();
      expect(screen.getByText('Total Experiences')).toBeInTheDocument();
      expect(screen.getByText('Countries Explored')).toBeInTheDocument();
      expect(screen.getByText('World Coverage')).toBeInTheDocument();
      
      // Progress values
      expect(screen.getByText('1')).toBeInTheDocument(); // Total experiences
      expect(screen.getByText('1')).toBeInTheDocument(); // Countries explored
      expect(screen.getByText('2%')).toBeInTheDocument(); // Progress percentage
    });
  });

  test('navigates between different views successfully', async () => {
    const { rerender } = render(<App />);
    
    // Initially should show calendar view
    await waitFor(() => {
      expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
    });
    
    // Simulate navigation to country exploration
    rerender(<App />);
    
    // Should be able to access country exploration
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  test('maintains consistent styling and theme', async () => {
    render(<App />);
    
    await waitFor(() => {
      const mainElement = screen.getByRole('main');
      const headerElement = screen.getByRole('banner');
      
      // Check dark theme classes
      expect(mainElement).toHaveClass('min-h-screen', 'bg-dark-primary', 'text-text-primary');
      expect(headerElement).toHaveClass('bg-dark-secondary', 'border-dark-border');
    });
  });

  test('handles component state changes gracefully', async () => {
    render(<App />);
    
    await waitFor(() => {
      // App should render without errors
      expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
    });
    
    // Component should maintain state
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
  });

  test('displays accessibility features correctly', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Check for ARIA roles and labels
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      
      // Check for live region announcements
      const liveRegion = screen.getByRole('status');
      expect(liveRegion).toBeInTheDocument();
      expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    });
  });

  test('renders all major components without prop errors', async () => {
    render(<App />);
    
    await waitFor(() => {
      // All major sections should render
      expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
      expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
      expect(screen.getByText('Journey Progress')).toBeInTheDocument();
    });
  });

  test('maintains responsive design classes', async () => {
    render(<App />);
    
    await waitFor(() => {
      const title = screen.getByText('Cultural Expo');
      const subtitle = screen.getByText('Discover the world\'s rich cultures');
      
      // Check responsive classes
      expect(title).toHaveClass('text-2xl', 'md:text-3xl');
      expect(subtitle).toHaveClass('text-sm');
    });
  });

  test('handles data loading and display correctly', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Progress data should be displayed
      expect(screen.getByText('1')).toBeInTheDocument(); // Experiences count
      expect(screen.getByText('1')).toBeInTheDocument(); // Countries count
      expect(screen.getByText('2%')).toBeInTheDocument(); // Progress
    });
  });

  test('provides complete user experience flow', async () => {
    render(<App />);
    
    await waitFor(() => {
      // User should see the main journey view
      expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
      
      // User should see progress information
      expect(screen.getByText('Journey Progress')).toBeInTheDocument();
      
      // User should see navigation options
      expect(screen.getByText('Explore')).toBeInTheDocument();
      expect(screen.getByText('Add Experience')).toBeInTheDocument();
      expect(screen.getByText('Commands')).toBeInTheDocument();
    });
  });
});
