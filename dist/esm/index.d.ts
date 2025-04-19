/**
 * React Native Consensual Logger
 *
 * A versatile logging system for React Native applications that includes:
 * - Database persistence via Drizzle ORM
 * - Secure mode with automatic redaction of sensitive information
 * - React context and hooks for easy usage in components
 * - Customizable formatting and log levels
 */
export type { Logger, LoggerOptions, LogLevel, LogEntry } from './types';
export { createLogger } from './logger';
export { redactValue, redactSensitiveInfo } from './redaction';
export { createDrizzleAdapter, noopAdapter, type LoggerDbAdapter } from './db';
export { logsTable, appLogsTable } from './schema';
export { useLogger, withLogger } from './hooks';
export { LoggerProvider, useLoggerSettings, LoggerSettings } from './provider';
export { initializeLoggerSingleton, logger, log, warn, error, enableLogging, enableSecureMode, getLoggerConfig, setDatabaseAdapter, } from './singleton';
export { IS_DEV, LOGGER_ENABLED_KEY, LOGGER_SECURE_MODE_KEY } from './constants';
