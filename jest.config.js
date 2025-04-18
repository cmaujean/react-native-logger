/** @type {import('jest').Config} */
module.exports = {
  // Only run tests in the 'tests' directory, not in the 'dist' directory
  roots: ['<rootDir>/tests'],
  
  // Configure TypeScript support
  preset: 'ts-jest',
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Explicitly exclude test backups
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.bak$',
    '\\.disabled$'
  ],
  
  // Project specific configurations
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.test.js'
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '\\.bak$',
        '\\.disabled$',
        'react.test'
      ],
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
    {
      displayName: 'react',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/tests/react.test.tsx'
      ],
      setupFilesAfterEnv: [
        '<rootDir>/tests/setup.ts'
      ],
      moduleNameMapper: {
        // Mock for @react-native-async-storage/async-storage
        "^@react-native-async-storage/async-storage$": 
          "@react-native-async-storage/async-storage/jest/async-storage-mock"
      },
    }
  ],
  
  // Transform with ts-jest for TypeScript and JSX
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  
  // Skip coverage collection for now
  collectCoverage: false,
  
  // Set up the proper mock path for the project
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$": "<rootDir>/tests/__mocks__/@react-native-async-storage/async-storage.js"
  }
};