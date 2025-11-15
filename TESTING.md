# Testing Guide for Cultural Expo

This document provides comprehensive information about the testing setup for the Cultural Expo application.

## 🧪 Testing Overview

The Cultural Expo application includes a comprehensive testing suite to ensure:
- **Component Rendering**: All React components render correctly
- **User Interactions**: User interactions work as expected
- **Data Management**: Utility functions handle data correctly
- **Integration**: Components work together seamlessly
- **Accessibility**: ARIA labels and roles are properly implemented
- **Responsive Design**: UI elements adapt to different screen sizes

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD pipeline
npm run test:ci

# Run tests for specific file
npm test -- --testPathPattern=App.test.js
```

### Test Coverage

The test suite aims for **70%+ coverage** across:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

## 📁 Test File Structure

```
src/
├── __tests__/                    # Test files directory
├── App.test.js                   # Main App component tests
├── App.integration.test.js       # Integration tests
├── components/
│   ├── FoodSection.test.js       # Food section component tests
│   ├── CountrySelector.test.js   # Country selector tests
│   └── ...                       # Other component tests
├── utils/
│   ├── experienceManager.test.js # Utility function tests
│   └── ...                       # Other utility tests
└── setupTests.js                 # Test configuration and mocks
```

## 🧩 Test Categories

### 1. Unit Tests
- **Component Tests**: Test individual React components in isolation
- **Utility Tests**: Test helper functions and data management
- **Mock Tests**: Test with mocked dependencies

### 2. Integration Tests
- **App Integration**: Test how components work together
- **Data Flow**: Test data passing between components
- **User Journey**: Test complete user workflows

### 3. Accessibility Tests
- **ARIA Labels**: Verify proper accessibility attributes
- **Keyboard Navigation**: Test keyboard-only interactions
- **Screen Reader**: Test with accessibility tools

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)
- **Environment**: jsdom for DOM testing
- **Coverage**: HTML, text, and LCOV reports
- **Transformers**: Babel for JSX support
- **Setup**: Custom test setup file

### Test Setup (`src/setupTests.js`)
- **Jest DOM**: Custom matchers for DOM testing
- **Mock Libraries**: Framer Motion, Heroicons, Lucide React
- **Global Mocks**: localStorage, IntersectionObserver, ResizeObserver
- **CSS Mocks**: Handle CSS imports in tests

### Babel Configuration (`.babelrc`)
- **Presets**: React and environment presets
- **Targets**: Current Node.js version
- **Runtime**: Automatic React runtime

## 📊 Test Coverage Areas

### Component Testing
- ✅ **Rendering**: Components render without crashing
- ✅ **Props**: Components handle props correctly
- ✅ **State**: State changes work as expected
- ✅ **Events**: User interactions trigger correct responses
- ✅ **Styling**: CSS classes are applied correctly

### Utility Testing
- ✅ **Data CRUD**: Create, read, update, delete operations
- ✅ **Data Filtering**: Search and filter functionality
- ✅ **Data Validation**: Input validation and error handling
- ✅ **Local Storage**: Data persistence and retrieval
- ✅ **Error Handling**: Graceful error handling

### Integration Testing
- ✅ **Component Communication**: Props and callbacks work
- ✅ **Data Flow**: Data moves correctly between components
- ✅ **User Workflows**: Complete user journeys work
- ✅ **State Management**: App state is maintained correctly

## 🎯 Key Test Scenarios

### App Component
- [x] Renders main navigation
- [x] Shows cultural journey section
- [x] Displays progress dashboard
- [x] Handles view switching
- [x] Opens command palette
- [x] Adds new experiences

### Food Section
- [x] Displays country-specific dishes
- [x] Filters by difficulty level
- [x] Expands recipe details
- [x] Marks dishes as cooked
- [x] Saves to localStorage

### Country Selector
- [x] Shows all countries
- [x] Filters by search terms
- [x] Handles country selection
- [x] Displays country information
- [x] Maintains search state

### Experience Manager
- [x] Manages experience data
- [x] Handles CRUD operations
- [x] Filters experiences
- [x] Calculates statistics
- [x] Exports/imports data

## 🚨 Common Test Issues & Solutions

### 1. Mock Dependencies
**Issue**: External libraries causing test failures
**Solution**: Use comprehensive mocks in `setupTests.js`

### 2. Async Operations
**Issue**: Tests failing due to timing
**Solution**: Use `waitFor()` and proper async/await patterns

### 3. DOM Queries
**Issue**: Can't find elements in tests
**Solution**: Use semantic queries (getByRole, getByText) over getByTestId

### 4. State Management
**Issue**: Component state not updating in tests
**Solution**: Use `act()` wrapper for state changes

## 📈 Improving Test Coverage

### 1. Add Missing Tests
```bash
# Check current coverage
npm run test:coverage

# Identify uncovered lines
# Add tests for uncovered functionality
```

### 2. Test Edge Cases
- Empty data scenarios
- Error conditions
- Boundary values
- Invalid inputs

### 3. Test User Interactions
- Click events
- Form submissions
- Keyboard navigation
- Touch events

## 🔍 Debugging Tests

### 1. Verbose Output
```bash
npm test -- --verbose
```

### 2. Debug Mode
```bash
npm test -- --no-cache --watch
```

### 3. Single Test File
```bash
npm test -- --testPathPattern=ComponentName.test.js
```

### 4. Coverage Report
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html
```

## 🏗️ Adding New Tests

### 1. Component Test Template
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from './ComponentName';

describe('ComponentName Component', () => {
  test('renders without crashing', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  test('handles user interactions', async () => {
    const user = userEvent.setup();
    render(<ComponentName />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### 2. Utility Test Template
```javascript
import { functionName } from './utilityFile';

describe('functionName', () => {
  test('handles normal input', () => {
    const result = functionName('input');
    expect(result).toBe('expected');
  });

  test('handles edge case', () => {
    const result = functionName('');
    expect(result).toBe('default');
  });
});
```

## 🚀 Continuous Integration

### GitHub Actions
Tests run automatically on:
- Pull requests
- Push to main branch
- Scheduled runs

### Pre-commit Hooks
Consider adding:
- Test execution
- Coverage checks
- Linting
- Type checking

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.npmjs.com/package/@testing-library/jest-dom)

## 🤝 Contributing to Tests

When adding new features:
1. **Write tests first** (TDD approach)
2. **Test all user interactions**
3. **Cover edge cases**
4. **Maintain coverage above 70%**
5. **Update this documentation**

## 📞 Support

For testing questions or issues:
1. Check this documentation
2. Review existing test examples
3. Check Jest and React Testing Library docs
4. Create an issue with detailed description

---

**Remember**: Good tests are the foundation of reliable software. Write tests that give you confidence in your code! 🧪✨
