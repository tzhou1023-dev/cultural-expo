import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Simple mock for the only function App.js actually imports
jest.mock('./utils/experienceManager', () => ({
  getAllExperiences: jest.fn(() => [])
}));

// Mock data files
jest.mock('./data/authenticFoodDatabase.json', () => ({
  dishes: {}
}));

jest.mock('./data/countries.json', () => []);

jest.mock('./data/recipes.json', () => ({}));

describe('App Basic Tests', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Cultural Expo')).toBeInTheDocument();
  });

  test('displays main navigation', () => {
    render(<App />);
    expect(screen.getByText('Commands')).toBeInTheDocument();
    expect(screen.getByText('Add Experience')).toBeInTheDocument();
  });

  test('shows cultural journey section', () => {
    render(<App />);
    expect(screen.getByText('Your Cultural Journey')).toBeInTheDocument();
  });

  test('displays progress dashboard', () => {
    render(<App />);
    expect(screen.getByText('Journey Progress')).toBeInTheDocument();
  });
});
