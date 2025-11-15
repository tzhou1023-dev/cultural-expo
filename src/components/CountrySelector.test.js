import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountrySelector from './CountrySelector';

// Mock the countries data
jest.mock('../data/countries.json', () => [
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    capital: 'Tokyo',
    population: '125.7M',
    description: 'Land of the Rising Sun'
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    capital: 'Rome',
    population: '60.4M',
    description: 'Beautiful Mediterranean country'
  },
  {
    id: 'mexico',
    name: 'Mexico',
    flag: '🇲🇽',
    region: 'North America',
    capital: 'Mexico City',
    population: '128.9M',
    description: 'Rich in culture and history'
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    capital: 'Canberra',
    population: '25.7M',
    description: 'Land down under'
  }
]);

describe('CountrySelector Component', () => {
  const mockOnCountrySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    expect(screen.getByText('Search Countries')).toBeInTheDocument();
  });

  test('displays search input field', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    expect(searchInput).toBeInTheDocument();
  });

  test('shows all countries initially', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  test('displays country information correctly', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    // Check for Japan's details
    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('125.7M')).toBeInTheDocument();
    expect(screen.getByText('Land of the Rising Sun')).toBeInTheDocument();
  });

  test('filters countries by name search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search for "japan"
    await user.type(searchInput, 'japan');
    
    // Should only show Japan
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
    expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });

  test('filters countries by region search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search for "europe"
    await user.type(searchInput, 'europe');
    
    // Should only show Italy
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });

  test('filters countries by capital search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search for "rome"
    await user.type(searchInput, 'rome');
    
    // Should only show Italy
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.queryByText('Mexico')).not.toBeInTheDocument();
    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });

  test('performs case-insensitive search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search with uppercase
    await user.type(searchInput, 'JAPAN');
    
    // Should still show Japan
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
  });

  test('shows no results message for non-matching search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search for non-existent country
    await user.type(searchInput, 'nonexistent');
    
    expect(screen.getByText('No countries found matching "nonexistent"')).toBeInTheDocument();
  });

  test('calls onCountrySelect when country is clicked', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const japanCard = screen.getByText('Japan').closest('div');
    await user.click(japanCard);
    
    expect(mockOnCountrySelect).toHaveBeenCalledWith({
      id: 'japan',
      name: 'Japan',
      flag: '🇯🇵',
      region: 'Asia',
      capital: 'Tokyo',
      population: '125.7M',
      description: 'Land of the Rising Sun'
    });
  });

  test('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Type some search text
    await user.type(searchInput, 'japan');
    
    // Verify search is working
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
    
    // Clear the search
    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);
    
    // Should show all countries again
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
    
    // Search input should be empty
    expect(searchInput).toHaveValue('');
  });

  test('handles partial search matches', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search for partial name
    await user.type(searchInput, 'jap');
    
    // Should show Japan
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
  });

  test('displays region badges correctly', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    // Check for region badges
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('Oceania')).toBeInTheDocument();
  });

  test('shows population information', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    expect(screen.getByText('125.7M')).toBeInTheDocument();
    expect(screen.getByText('60.4M')).toBeInTheDocument();
    expect(screen.getByText('128.9M')).toBeInTheDocument();
    expect(screen.getByText('25.7M')).toBeInTheDocument();
  });

  test('displays country flags', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    expect(screen.getByText('🇯🇵')).toBeInTheDocument();
    expect(screen.getByText('🇮🇹')).toBeInTheDocument();
    expect(screen.getByText('🇲🇽')).toBeInTheDocument();
    expect(screen.getByText('🇦🇺')).toBeInTheDocument();
  });

  test('maintains dark theme styling', () => {
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const container = screen.getByText('Search Countries').closest('div');
    expect(container).toHaveClass('bg-dark-secondary', 'border-dark-border');
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    // Tab to search input
    await user.tab();
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    expect(searchInput).toHaveFocus();
    
    // Tab to first country card
    await user.tab();
    const firstCountryCard = screen.getByText('Japan').closest('div');
    expect(firstCountryCard).toHaveFocus();
  });

  test('handles empty search input', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Clear the input
    await user.clear(searchInput);
    
    // Should show all countries
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });

  test('handles special characters in search', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Search with special characters
    await user.type(searchInput, 'j@p@n');
    
    // Should show no results
    expect(screen.getByText('No countries found matching "j@p@n"')).toBeInTheDocument();
  });

  test('updates search results in real-time', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Type "j" - should show Japan
    await user.type(searchInput, 'j');
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('Italy')).not.toBeInTheDocument();
    
    // Add "a" - should still show Japan
    await user.type(searchInput, 'a');
    expect(screen.getByText('Japan')).toBeInTheDocument();
    
    // Add "p" - should still show Japan
    await user.type(searchInput, 'p');
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  test('handles rapid search input changes', async () => {
    const user = userEvent.setup();
    render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    const searchInput = screen.getByPlaceholderText('Search by name, region, or capital...');
    
    // Rapidly type and clear
    await user.type(searchInput, 'j');
    await user.clear(searchInput);
    await user.type(searchInput, 'i');
    
    // Should show Italy
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.queryByText('Japan')).not.toBeInTheDocument();
  });

  test('maintains search state when re-rendering', () => {
    const { rerender } = render(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    // Re-render the component
    rerender(<CountrySelector onCountrySelect={mockOnCountrySelect} />);
    
    // Should still show all countries
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Italy')).toBeInTheDocument();
    expect(screen.getByText('Mexico')).toBeInTheDocument();
    expect(screen.getByText('Australia')).toBeInTheDocument();
  });
});
