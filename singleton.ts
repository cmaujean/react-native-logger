/**
 * Singleton logger instance for application-wide use
 */

import { createLogger } from './logger';
import type { Logger, LoggerOptions } from './types';
import { IS_DEV } from './constants';
import { noopAdapter } from './db/adapter';
import type { LoggerDbAdapter } from './db/adapter';

// Create a default instance with default settings
const defaultInstance = createLogger({
  enabled: true,
  secureMode: true,
  console: IS_DEV,
}, noopAdapter);

// Instance variable that will be updated by initialization
let instance: Logger = defaultInstance;

/**
 * Initialize the logger singleton with custom options and database adapter
 * 
 * This should be called early in your application setup to configure
 * the logger with the desired options and database adapter.
 * 
 * @param options Logger configuration options
 * @param dbAdapter Database adapter for log persistence
 * @returns The configured logger instance
 * 
 * @example
 * ```typescript
 * import { initializeLoggerSingleton, createDrizzleAdapter } from '@consensual/react-native-logger';
 * import { drizzle } from 'drizzle-orm/expo-sqlite';
 * import { openDatabase } from 'expo-sqlite';
 * 
 * const sqliteDB = openDatabase('app-logs.db');
 * const db = drizzle(sqliteDB);
 * 
 * export const logger = initializeLoggerSingleton({
 *   enabled: true,
 *   secureMode: true,
 *   console: __DEV__,
 * }, createDrizzleAdapter(db));
 * ```
 */
export function initializeLoggerSingleton(
  options: LoggerOptions = {}, 
  dbAdapter: LoggerDbAdapter = noopAdapter
): Logger {
  // Create a logger instance with the provided options and adapter
  instance = createLogger({
    enabled: options.enabled ?? true,
    secureMode: options.secureMode ?? true,
    console: options.console ?? IS_DEV,
  }, dbAdapter);
  
  return instance;
}

/**
 * Global application logger instance
 *
 * This logger is a singleton that can be imported and used anywhere
 * in the application without having to create a new instance each time.
 *
 * Usage:
 * ```
 * import { logger } from '@consensual/react-native-logger';
 *
 * logger.log('Message');
 * logger.warn('Warning message');
 * logger.error('Error message', error);
 * ```
 */
export const logger: Logger = instance;

// Export convenience methods directly for ease of use
export const log = (...args: any[]) => instance.log(...args);
export const warn = (...args: any[]) => instance.warn(...args);
export const error = (...args: any[]) => instance.error(...args);

// Configuration functions
export const enableLogging = (enabled: boolean): void => {
  instance.setEnabled(enabled);
};

export const enableSecureMode = (secure: boolean): void => {
  instance.setSecureMode(secure);
};

/**
 * Set the database adapter for the singleton logger
 * 
 * @deprecated Use initializeLoggerSingleton instead for setting the database adapter
 */
export const setDatabaseAdapter = (dbAdapter: LoggerDbAdapter): void => {
  // This is a placeholder - in a real implementation,
  // we would need to modify the logger to support changing 
  // the database adapter at runtime
  console.warn('setDatabaseAdapter is deprecated. Use initializeLoggerSingleton instead.');
};

/**
 * Get current logger configuration
 */
export const getLoggerConfig = (): LoggerOptions => {
  return instance.getOptions();
};