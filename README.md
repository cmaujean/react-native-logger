# Consensu.al React Native Logger

A flexible, secure, and feature-rich on device logging system for React Native applications.

## Features

- **Database persistence**: Logs are stored in a SQLite database via Drizzle ORM
- **Secure logging**: Automatically redacts sensitive information like passwords, API keys, tokens, etc.
- **React integration**: Includes hooks and providers for easy React integration
- **Customizable**: Configure log levels, storage, and formatting
- **Developer friendly**: Detailed error reporting in development, compact in production

## Installation

```bash
npm install @consensu.al/react-native-logger
# or
yarn add @consensu.al/react-native-logger
# or 
bun add @consensu.al/react-native-logger
```

## Quick Start

### Basic Usage

```typescript
import { logger } from '@consensu.al/react-native-logger';

// Simple logging
logger.log('User signed in');
logger.warn('Rate limit approaching');
logger.error('Failed to fetch data', error);
```

### With Database Persistence (Drizzle)

```typescript
import { createLogger, createDrizzleAdapter, logsTable } from '@consensu.al/react-native-logger';
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
import { initializeLoggerSingleton, createDrizzleAdapter } from '@consensu.al/react-native-logger';
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
import { LoggerProvider } from '@consensu.al/react-native-logger';
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
import { useLogger, LoggerProvider } from '@consensu.al/react-native-logger';

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
import { useLoggerSettings, getLogs, clearLogs } from '@consensu.al/react-native-logger';

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

- `logsTable`, `appLogsTable`: Drizzle table definitions for logs
- `createDrizzleAdapter(db)`: Create a Drizzle adapter for database storage
- `noopAdapter`: No-op adapter for when no database is needed

## Development

### Running Tests

This library uses Jest with Bun as the test runner. The test suite is divided into two projects:

1. `node` - Core functionality tests (redaction, logger, database, singleton)
2. `react` - React integration tests

To run the tests:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run only React tests
bun test:react
```

#### Notes on Test Environment

The current test setup has the following characteristics:

1. All tests are now fully operational and pass successfully
2. React component tests now run correctly alongside the core tests
3. Console logging tests work properly with our custom setup
4. Tests run with Bun for improved performance

#### Known Issues

- React tests show some deprecation warnings about react-test-renderer being deprecated. These warnings do not affect functionality and are related to the testing library, not our code.
- When running React tests, you may see warnings about "The current testing environment is not configured to support act(...)". These are harmless warnings from the React testing library.

## Schema and Migrations

### Schema Structure in v0.2.0+

Starting with v0.2.0, the logger includes improved support for Drizzle migrations with a dedicated schema export:

```typescript
// In your schema.ts file:
import { appLogsTable } from '@consensu.al/react-native-logger/schema';
import { sqliteTable /* ... */ } from 'drizzle-orm/sqlite-core';

// Your other table definitions
export const users = sqliteTable('users', { /* ... */ });

// Re-export the logs table to include it in your schema
export { appLogsTable };
```

The `appLogsTable` (or `logsTable`) defines a table with the following columns:

| Column    | Type   | Description                            |
|-----------|--------|----------------------------------------|
| id        | text   | Primary key, auto-generated using cuid2 |
| timestamp | text   | Timestamp of the log entry, auto-generated |
| level     | text   | Log level (debug, info, warn, error)   |
| message   | text   | The log message                        |
| metadata  | text   | JSON-stringified metadata object       |

### Generating Migrations

With the schema imported in your Drizzle schema file, you can generate migrations that include the logs table:

```bash
bun run db:generate
```

### Database Adapter with Metadata

The logger's database adapter supports storing additional metadata with log entries:

```typescript
// Configure with database adapter
const logger = createLogger({
  // options...
}, createDrizzleAdapter(db));

// Log with metadata
logger.log('User action', { 
  userId: 'user123', 
  action: 'login',
  context: 'mobile' 
});
```

## License

MIT