/**
 * Type definitions for the logging library
 */

/**
 * Available log levels for the logger
 */
export type LogLevel = 'log' | 'warn' | 'error';

/**
 * Log entry structure as stored in the database
 */
export interface LogEntry {
  id: string;
  timestamp: Date | string;
  level: LogLevel;
  message: string;
}

/**
 * Options for configuring a logger instance
 */
export interface LoggerOptions {
  /**
   * Whether logging is enabled
   * @default true
   */
  enabled?: boolean;

  /**
   * Whether to use secure mode (redacting sensitive info)
   * @default true
   */
  secureMode?: boolean;

  /**
   * Whether to also log to console
   * @default true in dev, false in production
   */
  console?: boolean;
}

/**
 * Core logger interface
 */
export interface Logger {
  /**
   * Log an informational message
   */
  log: (...args: any[]) => void;

  /**
   * Log a warning message
   */
  warn: (...args: any[]) => void;

  /**
   * Log an error message
   */
  error: (...args: any[]) => void;

  /**
   * Enable or disable logging
   */
  setEnabled: (enabled: boolean) => void;

  /**
   * Enable or disable secure mode (redacting sensitive info)
   */
  setSecureMode: (secure: boolean) => void;

  /**
   * Get current logger settings
   */
  getOptions: () => LoggerOptions;
}

/**
 * Extended Console interface to include original methods
 */
declare global {
  interface Console {
    _originalLog?: typeof console.log;
    _originalWarn?: typeof console.warn;
    _originalError?: typeof console.error;
  }

  var _pendingLogs: Array<{ level: LogLevel; message: string; timestamp: string }>
}