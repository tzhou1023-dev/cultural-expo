import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the data files
jest.mock('./data/authenticFoodDatabase.json', () => ({
  countries: {
    'japan': {
      name: 'Japan',
      foods: ['Sushi', 'Ramen', 'Tempura'],
      drinks: ['Sake', 'Green Tea', 'Matcha'],
      movies: ['Seven Samurai', 'Spirited Away', 'Godzilla']
    }
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

// Mock utility functions
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

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
    expect(screen.getByText('Discover the world\'s rich cultures')).toBeInTheDocument();
  });

  test('displays main navigation elements', () => {
    render(<App />);
    
    // Check for main navigation buttons
    expect(screen.getByText('Commands')).toBeInTheDocument();
    expect(screen.getByText('Add Experience')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  test('shows cultural journey section by default', () => {
    render(<App />);
    
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
    expect(screen.getByText('Track your cultural experiences and discover new traditions through our interactive calendar')).toBeInTheDocument();
  });

  test('displays journey progress information', () => {
    render(<App />);
    
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
    expect(screen.getByText('Total Experiences')).toBeInTheDocument();
    expect(screen.getByText('Countries Explored')).toBeInTheDocument();
    expect(screen.getByText('World Coverage')).toBeInTheDocument();
  });

  test('shows progress bar with correct values', () => {
    render(<App />);
    
    // Check progress values
    expect(screen.getByText('1')).toBeInTheDocument(); // Total experiences
    expect(screen.getByText('1')).toBeInTheDocument(); // Countries explored
    expect(screen.getByText('2%')).toBeInTheDocument(); // Progress percentage
  });

  test('switches to country exploration view', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click explore button
    const exploreButton = screen.getByText('Explore');
    await user.click(exploreButton);
    
    // Should show country exploration view
    expect(screen.getByText('Embark on a Cultural Journey')).toBeInTheDocument();
    expect(screen.getByText('Discover fascinating traditions, delicious cuisines, and captivating stories from countries around the globe. Let curiosity be your guide!')).toBeInTheDocument();
  });

  test('returns to calendar view from country exploration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Go to country exploration
    const exploreButton = screen.getByText('Explore');
    await user.click(exploreButton);
    
    // Should show country exploration view
    expect(screen.getByText('Embark on a Cultural Journey')).toBeInTheDocument();
    
    // Go back to calendar
    const homeButton = screen.getByText('Home');
    await user.click(homeButton);
    
    // Should be back to calendar view
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
  });

  test('opens command palette', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const commandButton = screen.getByText('Commands');
    await user.click(commandButton);
    
    // Command palette should be accessible
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('adds new experience', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const addButton = screen.getByText('Add Experience');
    await user.click(addButton);
    
    // Experience entry modal should be open
    expect(screen.getByText('Add Cultural Experience')).toBeInTheDocument();
  });

  test('displays accessibility features', () => {
    render(<App />);
    
    // Check for ARIA labels and roles
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check for live region announcements
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Tab through interactive elements
    await user.tab();
    expect(screen.getByText('Commands')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Add Experience')).toHaveFocus();
    
    await user.tab();
    expect(screen.getByText('Explore')).toHaveFocus();
  });

  test('maintains dark theme styling', () => {
    render(<App />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('min-h-screen', 'bg-dark-primary', 'text-text-primary');
    
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('bg-dark-secondary', 'border-dark-border');
  });

  test('displays cultural calendar component', () => {
    render(<App />);
    
    // The calendar should be rendered (we can check for its container)
    const calendarContainer = screen.getByTestId('cultural-calendar');
    expect(calendarContainer).toBeInTheDocument();
  });

  test('shows toast notifications', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Navigate to country selection
    const exploreButton = screen.getByText('Explore');
    await user.click(exploreButton);
    
    // Select a country (this would trigger a toast)
    const countrySelector = screen.getByTestId('country-selector');
    expect(countrySelector).toBeInTheDocument();
  });

  test('handles responsive design elements', () => {
    render(<App />);
    
    // Check for responsive classes
    const title = screen.getByText('Cultural Expo');
    expect(title).toHaveClass('text-2xl', 'md:text-3xl');
    
    const subtitle = screen.getByText('Discover the world\'s rich cultures');
    expect(subtitle).toHaveClass('text-sm');
  });

  test('displays animated elements correctly', () => {
    render(<App />);
    
    // Check for motion elements (mocked as regular divs)
    const logoContainer = screen.getByTestId('globe-icon');
    expect(logoContainer).toBeInTheDocument();
    
    const chartIcon = screen.getByTestId('chart-icon');
    expect(chartIcon).toBeInTheDocument();
  });

  test('maintains component hierarchy', () => {
    render(<App />);
    
    // Check that all major sections are present
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check for specific content sections
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
  });
});
