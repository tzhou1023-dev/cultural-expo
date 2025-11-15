// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock @heroicons/react to avoid icon rendering issues in tests
jest.mock('@heroicons/react/24/outline', () => ({
  GlobeAltIcon: () => <div data-testid="globe-icon">🌍</div>,
  ChartBarIcon: () => <div data-testid="chart-icon">📊</div>,
  PlusIcon: () => <div data-testid="plus-icon">➕</div>,
  HomeIcon: () => <div data-testid="home-icon">🏠</div>,
  SparklesIcon: () => <div data-testid="sparkles-icon">✨</div>,
  CommandLineIcon: () => <div data-testid="command-icon">⌨️</div>,
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">📅</div>,
  MapPin: () => <div data-testid="map-pin-icon">📍</div>,
  Clock: () => <div data-testid="clock-icon">🕐</div>,
  Edit: () => <div data-testid="edit-icon">✏️</div>,
  Trash: () => <div data-testid="trash-icon">🗑️</div>,
  Plus: () => <div data-testid="plus-icon">➕</div>,
  X: () => <div data-testid="x-icon">❌</div>,
  Search: () => <div data-testid="search-icon">🔍</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">⬇️</div>,
  ChevronUp: () => <div data-testid="chevron-up-icon">⬆️</div>,
  Star: () => <div data-testid="star-icon">⭐</div>,
  Heart: () => <div data-testid="heart-icon">❤️</div>,
  Share: () => <div data-testid="share-icon">📤</div>,
  Bookmark: () => <div data-testid="bookmark-icon">🔖</div>,
  Info: () => <div data-testid="info-icon">ℹ️</div>,
  AlertCircle: () => <div data-testid="alert-circle-icon">⚠️</div>,
  CheckCircle: () => <div data-testid="check-circle-icon">✅</div>,
  XCircle: () => <div data-testid="x-circle-icon">❌</div>,
}));



// Mock localStorage
const localStorageMock = {
  getItem: jest.fn((key) => {
    if (key === 'cultural_expo_experiences') {
      return JSON.stringify([]); // Return empty array by default
    }
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};
