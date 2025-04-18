/**
 * Common setup file for Jest tests
 */

// Add export to make this a module
export {};

// Types for our global mocks
declare global {
  namespace NodeJS {
    interface Global {
      _pendingLogs: Array<{ level: string; message: string; metadata?: Record<string, any>; timestamp: string }>;
      mockConsole: {
        log: jest.Mock;
        warn: jest.Mock;
        error: jest.Mock;
      };
    }
  }
  interface Console {
    _originalLog?: typeof console.log;
    _originalWarn?: typeof console.warn;
    _originalError?: typeof console.error;
  }
}

// Store original console methods
console._originalLog = console.log;
console._originalWarn = console.warn;
console._originalError = console.error;

// Create mock console functions
global.mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};

// Initialize _pendingLogs global array for testing
global._pendingLogs = [];

// Clean up before each test
beforeEach(() => {
  jest.clearAllMocks();
  global._pendingLogs = [];
  
  // Set up mock console functions
  console.log = global.mockConsole.log;
  console.warn = global.mockConsole.warn;
  console.error = global.mockConsole.error;
});

// Restore original console methods after each test
afterEach(() => {
  // Restore console methods
  if (console._originalLog) console.log = console._originalLog;
  if (console._originalWarn) console.warn = console._originalWarn;
  if (console._originalError) console.error = console._originalError;
});

// Clean up after all tests
afterAll(() => {
  // Final restoration of console methods
  if (console._originalLog) console.log = console._originalLog;
  if (console._originalWarn) console.warn = console._originalWarn;
  if (console._originalError) console.error = console._originalError;
});