// Jest setup file for backend tests
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testflux_test';

// Mock external dependencies
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
  })),
}));

jest.mock('axios', () => ({
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Global test utilities
global.testUtils = {
  // Database helpers
  cleanDatabase: async () => {
    // Implementation for cleaning test database
  },
  
  // Auth helpers
  createAuthToken: (payload = { id: 'test-user', role: 'user' }) => {
    // Mock JWT token creation
    return 'mock-jwt-token';
  },
  
  // Mock data generators
  mockUser: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
    ...overrides,
  }),
  
  mockProduct: (overrides = {}) => ({
    id: 'test-product-id',
    name: 'Test Product',
    description: 'Test product description',
    isActive: true,
    ...overrides,
  }),
};

// Console.log suppression for tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
