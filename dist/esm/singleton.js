/**
 * Singleton logger instance for application-wide use
 */
import { createLogger } from './logger';
import { IS_DEV } from './constants';
import { noopAdapter } from './db/adapter';
// Create a default instance with default settings
const defaultInstance = createLogger({
    enabled: true,
    secureMode: true,
    console: IS_DEV,
}, noopAdapter);
// Instance variable that will be updated by initialization
let instance = defaultInstance;
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
export function initializeLoggerSingleton(options = {}, dbAdapter = noopAdapter) {
    var _a, _b, _c;
    // Create a logger instance with the provided options and adapter
    instance = createLogger({
        enabled: (_a = options.enabled) !== null && _a !== void 0 ? _a : true,
        secureMode: (_b = options.secureMode) !== null && _b !== void 0 ? _b : true,
        console: (_c = options.console) !== null && _c !== void 0 ? _c : IS_DEV,
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
export const logger = instance;
// Export convenience methods directly for ease of use
export const log = (...args) => instance.log(...args);
export const warn = (...args) => instance.warn(...args);
export const error = (...args) => instance.error(...args);
// Configuration functions
export const enableLogging = (enabled) => {
    instance.setEnabled(enabled);
};
export const enableSecureMode = (secure) => {
    instance.setSecureMode(secure);
};
/**
 * Set the database adapter for the singleton logger
 *
 * @deprecated Use initializeLoggerSingleton instead for setting the database adapter
 */
export const setDatabaseAdapter = (dbAdapter) => {
    // This is a placeholder - in a real implementation,
    // we would need to modify the logger to support changing 
    // the database adapter at runtime
    console.warn('setDatabaseAdapter is deprecated. Use initializeLoggerSingleton instead.');
};
/**
 * Get current logger configuration
 */
export const getLoggerConfig = () => {
    return instance.getOptions();
};
