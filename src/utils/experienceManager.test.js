import {
  getAllExperiences,
  getExperienceById,
  saveExperience,
  deleteExperience,
  getExperiencesByDate,
  getExperiencesByMonth,
  getExperienceForCountryOnDate,
  getCulturalStatistics,
  getUserPreferences,
  saveUserPreferences,
  exportExperiences,
  importExperiences,
  clearAllData,
  searchExperiences,
  getCalendarData
} from './experienceManager';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Experience Manager', () => {
  const mockExperience = {
    id: '1',
    country: { id: 'japan', name: 'Japan' },
    date: '2024-01-15',
    dishes: [
      { name: 'Sushi', attempted: true, rating: 5, notes: 'Amazing experience!', difficulty: 'Medium' }
    ],
    drinks: [],
    movies: [],
    overall_notes: 'Great cultural experience!',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  };

  const mockExperience2 = {
    id: '2',
    country: { id: 'italy', name: 'Italy' },
    date: '2024-01-20',
    dishes: [],
    drinks: [
      { name: 'Wine', attempted: true, rating: 4, notes: 'Great wine!', type: 'Alcoholic' }
    ],
    movies: [],
    overall_notes: 'Wine tasting experience!',
    created_at: '2024-01-20T10:30:00Z',
    updated_at: '2024-01-20T10:30:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('[]');
    localStorageMock.setItem.mockClear();
  });

  describe('getAllExperiences', () => {
    test('returns empty array when no experiences exist', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      const experiences = getAllExperiences();
      expect(experiences).toEqual([]);
    });

    test('returns all experiences from localStorage', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const experiences = getAllExperiences();
      expect(experiences).toEqual(mockExperiences);
    });

    test('handles invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      const experiences = getAllExperiences();
      expect(experiences).toEqual([]);
    });
  });

  describe('getExperienceById', () => {
    test('returns experience by ID when it exists', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const experience = getExperienceById('1');
      expect(experience).toEqual(mockExperience);
    });

    test('returns null when experience ID does not exist', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const experience = getExperienceById('999');
      expect(experience).toBeNull();
    });

    test('returns null when no experiences exist', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const experience = getExperienceById('1');
      expect(experience).toBeNull();
    });
  });

  describe('saveExperience', () => {
    test('saves new experience successfully', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const newExperience = {
        country: { id: 'france', name: 'France' },
        date: '2024-02-01',
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: 'Visited Louvre Museum'
      };
      
      const result = saveExperience(newExperience);
      
      expect(result).toBeDefined();
      expect(result).toMatch(/^exp_\d+_[a-z0-9]+$/);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('generates unique ID for new experience', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const experience1 = saveExperience({
        country: { id: 'france', name: 'France' },
        date: '2024-02-01',
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: 'Visited Louvre Museum'
      });
      
      const experience2 = saveExperience({
        country: { id: 'germany', name: 'Germany' },
        date: '2024-02-02',
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: 'Ate bratwurst'
      });
      
      expect(experience1).not.toEqual(experience2);
    });

    test('saves experience to existing list', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockExperience]));
      
      const newExperience = {
        country: { id: 'france', name: 'France' },
        date: '2024-02-01',
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: 'Visited Louvre Museum'
      };
      
      saveExperience(newExperience);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        expect.stringContaining('"id"')
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        expect.stringContaining('"id"')
      );
    });
  });

  describe('deleteExperience', () => {
    test('deletes existing experience successfully', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      deleteExperience('1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        JSON.stringify([mockExperience2])
      );
    });

    test('handles deleting non-existent experience gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      deleteExperience('999');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        '[]'
      );
    });

    test('handles deletion from empty list gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      deleteExperience('1');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        '[]'
      );
    });
  });

  describe('getExperiencesByDate', () => {
    test('returns experiences for specific date', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const dateExperiences = getExperiencesByDate('2024-01-15');
      
      expect(dateExperiences).toHaveLength(1);
      expect(dateExperiences[0].date).toEqual('2024-01-15');
    });

    test('returns empty array for date with no experiences', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const dateExperiences = getExperiencesByDate('2024-12-25');
      
      expect(dateExperiences).toEqual([]);
    });

    test('handles different date formats', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const dateExperiences = getExperiencesByDate('2024-01-15');
      
      expect(dateExperiences).toHaveLength(1);
    });
  });

  describe('getExperiencesByMonth', () => {
    test('returns experiences for specific month', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const monthExperiences = getExperiencesByMonth(2024, 0); // January 2024
      
      expect(monthExperiences).toHaveLength(2);
      expect(monthExperiences[0].date).toEqual('2024-01-15');
      expect(monthExperiences[1].date).toEqual('2024-01-20');
    });

    test('returns empty array for month with no experiences', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const monthExperiences = getExperiencesByMonth(2023, 11); // December 2023
      
      expect(monthExperiences).toEqual([]);
    });
  });

  describe('getExperienceForCountryOnDate', () => {
    test('returns experience for specific country on specific date', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const experience = getExperienceForCountryOnDate('japan', '2024-01-15');
      
      expect(experience).toEqual(mockExperience);
    });

    test('returns null when no experience found', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const experience = getExperienceForCountryOnDate('france', '2024-01-20');
      
      expect(experience).toBeNull();
    });
  });

  describe('getCulturalStatistics', () => {
    test('returns correct statistics for experiences', () => {
      const mockExperiences = [mockExperience, mockExperience2];


      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const stats = getCulturalStatistics();
      
      expect(stats.totalExperiences).toEqual(2);
      expect(stats.countriesExplored).toEqual(2);
      expect(stats.totalDishesAttempted).toEqual(1);
      expect(stats.totalDrinksAttempted).toEqual(1);
      expect(stats.totalMoviesWatched).toEqual(0);
    });

    test('returns zero statistics for empty experience list', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const stats = getCulturalStatistics();
      
      expect(stats.totalExperiences).toEqual(0);
      expect(stats.countriesExplored).toEqual(0);
      expect(stats.totalDishesAttempted).toEqual(0);
      expect(stats.totalDrinksAttempted).toEqual(0);
      expect(stats.totalMoviesWatched).toEqual(0);
    });

    test('calculates average rating correctly', () => {
      const experiencesWithRatings = [
        { ...mockExperience, rating: 5 },
        { ...mockExperience2, rating: 3 }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(experiencesWithRatings));
      
      const stats = getCulturalStatistics();
      
      expect(stats.averageRatings.dishes).toEqual(5);
      expect(stats.averageRatings.drinks).toEqual(4);
    });
  });

  describe('exportExperiences', () => {
    test('exports experiences to JSON string', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const exportData = exportExperiences();
      const parsed = JSON.parse(exportData);
      
      expect(parsed.experiences).toEqual(mockExperiences);
      expect(parsed.exportDate).toBeDefined();
      expect(parsed.version).toBe('1.0');
    });

    test('exports empty array when no experiences', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const exportData = exportExperiences();
      const parsed = JSON.parse(exportData);
      
      expect(parsed.experiences).toEqual([]);
      expect(parsed.exportDate).toBeDefined();
      expect(parsed.version).toBe('1.0');
    });
  });

  describe('importExperiences', () => {
    test('imports experiences from JSON string', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      const importData = JSON.stringify({ experiences: [mockExperience, mockExperience2] });
      const result = importExperiences(importData);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        JSON.stringify([mockExperience, mockExperience2])
      );
    });

    test('returns false for invalid JSON', () => {
      const result = importExperiences('invalid json');
      
      expect(result).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    test('overwrites existing experiences', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockExperience]));
      
      const importData = JSON.stringify({ experiences: [mockExperience2] });
      const result = importExperiences(importData);
      
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cultural_expo_experiences',
        JSON.stringify([mockExperience2])
      );
    });
  });

  describe('clearAllData', () => {
    test('clears all experiences successfully', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockExperience, mockExperience2]));
      
      clearAllData();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_experiences');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_preferences');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_achievements');
    });

    test('handles clearing empty experience list', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      
      clearAllData();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_experiences');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_preferences');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('cultural_expo_achievements');
    });
  });

  describe('searchExperiences', () => {
    test('searches experiences by description', () => {
      const mockExperiences = [mockExperience, mockExperience2];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const searchResults = searchExperiences({ searchText: 'sushi' });
      
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0]).toEqual(mockExperience);
    });

    test('returns empty array when no experiences match', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const searchResults = searchExperiences({ searchText: 'pizza' });
      
      expect(searchResults).toEqual([]);
    });
  });

  describe('getCalendarData', () => {
    test('returns calendar data for a month', () => {
      const mockExperiences = [
        { ...mockExperience, date: '2024-01-05' },
        { ...mockExperience2, date: '2024-01-10' },
        { ...mockExperience, date: '2024-01-15' },
        { ...mockExperience2, date: '2024-01-20' },
        { ...mockExperience, date: '2024-01-25' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const calendarData = getCalendarData(2024, 0); // January 2024
      
      expect(calendarData).toBeDefined();
      expect(calendarData[15]).toBeDefined(); // Day 15
      expect(calendarData[20]).toBeDefined(); // Day 20
      expect(calendarData[15][0].id).toEqual('1');
      expect(calendarData[20][0].id).toEqual('2');
    });

    test('returns empty array for month with no experiences', () => {
      const mockExperiences = [mockExperience];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockExperiences));
      
      const calendarData = getCalendarData(2023, 11); // December 2023
      
      expect(calendarData).toEqual({});
    });
  });

  describe('Error handling', () => {
    test('handles localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const experiences = getAllExperiences();
      expect(experiences).toEqual([]);
    });

    test('handles setItem errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('[]');
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('setItem error');
      });
      
      const result = saveExperience({
        country: { id: 'france', name: 'France' },
        date: '2024-02-01',
        dishes: [],
        drinks: [],
        movies: [],
        overall_notes: 'Test'
      });
      
      expect(result).toBeNull();
    });
  });
});
