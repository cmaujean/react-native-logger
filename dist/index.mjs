/**
 * React Native Consensual Logger
 *
 * A versatile logging system for React Native applications that includes:
 * - Database persistence via Drizzle ORM
 * - Secure mode with automatic redaction of sensitive information
 * - React context and hooks for easy usage in components
 * - Customizable formatting and log levels
 */
// Export core functionality
export { createLogger } from './logger';
export { redactValue, redactSensitiveInfo } from './redaction';
// Export database adapters
export { createDrizzleAdapter, noopAdapter } from './db';
// Export schema for database setup
export { logsTable, appLogsTable } from './schema';
// Export React hooks and components
export { useLogger, withLogger } from './hooks';
export { LoggerProvider, useLoggerSettings, LoggerSettings } from './provider';
// Export the singleton instance for convenience
export { initializeLoggerSingleton, logger, log, warn, error, enableLogging, enableSecureMode, getLoggerConfig, setDatabaseAdapter, } from './singleton';
// Export constants
export { IS_DEV, LOGGER_ENABLED_KEY, LOGGER_SECURE_MODE_KEY } from './constants';
