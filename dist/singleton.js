"use strict";
/**
 * Singleton logger instance for application-wide use
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggerConfig = exports.setDatabaseAdapter = exports.enableSecureMode = exports.enableLogging = exports.error = exports.warn = exports.log = exports.logger = exports.initializeLoggerSingleton = void 0;
const logger_1 = require("./logger");
const constants_1 = require("./constants");
const adapter_1 = require("./db/adapter");
// Create a default instance with default settings
const defaultInstance = (0, logger_1.createLogger)({
    enabled: true,
    secureMode: true,
    console: constants_1.IS_DEV,
}, adapter_1.noopAdapter);
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
function initializeLoggerSingleton(options = {}, dbAdapter = adapter_1.noopAdapter) {
    var _a, _b, _c;
    // Create a logger instance with the provided options and adapter
    instance = (0, logger_1.createLogger)({
        enabled: (_a = options.enabled) !== null && _a !== void 0 ? _a : true,
        secureMode: (_b = options.secureMode) !== null && _b !== void 0 ? _b : true,
        console: (_c = options.console) !== null && _c !== void 0 ? _c : constants_1.IS_DEV,
    }, dbAdapter);
    return instance;
}
exports.initializeLoggerSingleton = initializeLoggerSingleton;
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
exports.logger = instance;
// Export convenience methods directly for ease of use
const log = (...args) => instance.log(...args);
exports.log = log;
const warn = (...args) => instance.warn(...args);
exports.warn = warn;
const error = (...args) => instance.error(...args);
exports.error = error;
// Configuration functions
const enableLogging = (enabled) => {
    instance.setEnabled(enabled);
};
exports.enableLogging = enableLogging;
const enableSecureMode = (secure) => {
    instance.setSecureMode(secure);
};
exports.enableSecureMode = enableSecureMode;
/**
 * Set the database adapter for the singleton logger
 *
 * @deprecated Use initializeLoggerSingleton instead for setting the database adapter
 */
const setDatabaseAdapter = (dbAdapter) => {
    // This is a placeholder - in a real implementation,
    // we would need to modify the logger to support changing 
    // the database adapter at runtime
    console.warn('setDatabaseAdapter is deprecated. Use initializeLoggerSingleton instead.');
};
exports.setDatabaseAdapter = setDatabaseAdapter;
/**
 * Get current logger configuration
 */
const getLoggerConfig = () => {
    return instance.getOptions();
};
exports.getLoggerConfig = getLoggerConfig;
