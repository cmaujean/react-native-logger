# React Native Consensual Logger

A flexible, secure, and feature-rich logging system for React Native applications.

## Features

- **Database persistence**: Logs are stored in a SQLite database via Drizzle ORM
- **Secure logging**: Automatically redacts sensitive information like passwords, API keys, tokens, etc.
- **React integration**: Includes hooks and providers for easy React integration
- **Customizable**: Configure log levels, storage, and formatting
- **Developer friendly**: Detailed error reporting in development, compact in production

## Installation

```bash
npm install @consensual/react-native-logger
# or
yarn add @consensual/react-native-logger
# or 
bun add @consensual/react-native-logger
```

## Quick Start

### Basic Usage

```typescript
import { logger } from '@consensual/react-native-logger';

// Simple logging
logger.log('User signed in');
logger.warn('Rate limit approaching');
logger.error('Failed to fetch data', error);
```

### With Database Persistence (Drizzle)

```typescript
import { createLogger, createDrizzleAdapter, logsTable } from '@consensual/react-native-logger';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabase } from 'expo-sqlite';

// Create database connection
const sqliteDB = openDatabase('my-app.db');
const db = drizzle(sqliteDB);

// Create logger with database adapter
const logger = createLogger({
  enabled: true,
  secureMode: true, // Redact sensitive info
  console: true, // Also log to console
}, createDrizzleAdapter(db));

// Use logger
logger.log('This will be saved to the database');
```

### Setting Up Singleton with LoggerProvider and Database Persistence

For apps that need a global logger instance with database persistence and settings management:

```typescript
// In a file like src/services/logger.ts
import { initializeLoggerSingleton, createDrizzleAdapter } from '@consensual/react-native-logger';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabase } from 'expo-sqlite';

// Create database connection
const sqliteDB = openDatabase('app-logs.db');
const db = drizzle(sqliteDB);

// Initialize the singleton logger with database adapter
export const logger = initializeLoggerSingleton({
  enabled: true,
  secureMode: true,
  console: __DEV__, // Only log to console in development
}, createDrizzleAdapter(db));

// Export for convenience
export const { log, warn, error } = logger;
```

Then in your app's entry point:

```tsx
// In App.tsx or index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { LoggerProvider } from '@consensual/react-native-logger';
import { logger } from './src/services/logger';

// Import the singleton instance to ensure it's initialized
import './src/services/logger';

function App() {
  return (
    <LoggerProvider
      initialConfig={logger.getOptions()}
      onSettingsChange={(settings) => {
        // Update logger settings when changed through the UI
        logger.setEnabled(settings.enabled);
        logger.setSecureMode(settings.secureMode);
      }}
    >
      <View>
        <Text>Your App Content</Text>
      </View>
      
      {/* Optional: Add a settings screen or debug panel */}
      <LogsDebugPanel />
    </LoggerProvider>
  );
}

// Optional logs debug panel component
function LogsDebugPanel() {
  // Only show in development
  if (!__DEV__) return null;
  
  return (
    <LoggerSettings
      renderSettings={({ enabled, secureMode, setEnabled, setSecureMode }) => (
        <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
          <Switch value={enabled} onValueChange={setEnabled} />
          <Switch value={secureMode} onValueChange={setSecureMode} />
        </View>
      )}
    />
  );
}

export default App;
```

### In React Components

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useLogger, LoggerProvider } from '@consensual/react-native-logger';

function MyComponent() {
  const { log, warn, error } = useLogger(logger);
  
  const handlePress = () => {
    log('Button pressed');
  };
  
  return (
    <View>
      <Button title="Press Me" onPress={handlePress} />
    </View>
  );
}

// Wrap your app with LoggerProvider to enable settings persistence
function App() {
  return (
    <LoggerProvider>
      <MyComponent />
    </LoggerProvider>
  );
}
```

### Creating a Logs Screen

```tsx
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Button } from 'react-native';
import { useLoggerSettings, getLogs, clearLogs } from '@consensual/react-native-logger';

function LogsScreen() {
  const [logs, setLogs] = useState([]);
  const { enabled, secureMode, setEnabled, setSecureMode } = useLoggerSettings();
  
  const loadLogs = async () => {
    const logData = await getLogs();
    setLogs(logData);
  };
  
  useEffect(() => {
    loadLogs();
  }, []);
  
  return (
    <View>
      <View>
        <Text>Log Capture: {enabled ? 'Enabled' : 'Disabled'}</Text>
        <Switch value={enabled} onValueChange={setEnabled} />
      </View>
      
      <View>
        <Text>Secure Mode: {secureMode ? 'Enabled' : 'Disabled'}</Text>
        <Switch value={secureMode} onValueChange={setSecureMode} />
      </View>
      
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {new Date(item.timestamp).toLocaleTimeString()} 
            [{item.level}] {item.message}
          </Text>
        )}
      />
      
      <Button title="Clear Logs" onPress={() => clearLogs()} />
      <Button title="Refresh" onPress={() => loadLogs()} />
    </View>
  );
}
```

## API Reference

### Core Functions

- `createLogger(options, dbAdapter)`: Create a new logger instance
- `redactValue(value)`: Redact sensitive information from any value
- `redactSensitiveInfo(string)`: Redact sensitive information from a string

### React Hooks

- `useLogger(logger)`: Hook for using a logger in React components
- `useLoggerSettings()`: Hook for accessing logger settings
- `withLogger(Component, logger)`: HOC to inject logger into a component

### Components

- `LoggerProvider`: Provider component for logger settings
- `LoggerSettings`: Render props component for displaying settings UI

### Database

- `logsTable`: Drizzle table definition for logs
- `createDrizzleAdapter(db)`: Create a Drizzle adapter for database storage
- `noopAdapter`: No-op adapter for when no database is needed

## Development

### Running Tests

This library uses Jest with Bun as the test runner. The test suite is divided into two projects:

1. `node` - Core functionality tests (redaction, logger, database, singleton)
2. `react` - React integration tests (currently disabled until React/Jest/Bun compatibility issues are resolved)

To run the tests:

```bash
# Run all core tests
bun test

# Run tests in watch mode
bun test:watch
```

#### Notes on Test Environment

The current test setup has the following characteristics:

1. Core functionality tests are fully operational and pass successfully
2. React component tests are temporarily disabled due to compatibility issues between Jest, React, and Bun
3. Some tests are skipped (mainly those that mock console output) but will be re-enabled in future updates
4. Tests run with Bun for improved performance

#### Known Issues

- When running tests, you may see warnings about the dist directory tests. These can be safely ignored as they are duplicates of the source tests.
- React component testing is currently disabled and will be fixed in a future update.

## License

MIT