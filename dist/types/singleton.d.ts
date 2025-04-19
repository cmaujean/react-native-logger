/**
 * Singleton logger instance for application-wide use
 */
import type { Logger, LoggerOptions } from './types';
import type { LoggerDbAdapter } from './db/adapter';
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
export declare function initializeLoggerSingleton(options?: LoggerOptions, dbAdapter?: LoggerDbAdapter): Logger;
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
export declare const logger: Logger;
export declare const log: (...args: any[]) => void;
export declare const warn: (...args: any[]) => void;
export declare const error: (...args: any[]) => void;
export declare const enableLogging: (enabled: boolean) => void;
export declare const enableSecureMode: (secure: boolean) => void;
/**
 * Set the database adapter for the singleton logger
 *
 * @deprecated Use initializeLoggerSingleton instead for setting the database adapter
 */
export declare const setDatabaseAdapter: (dbAdapter: LoggerDbAdapter) => void;
/**
 * Get current logger configuration
 */
export declare const getLoggerConfig: () => LoggerOptions;
