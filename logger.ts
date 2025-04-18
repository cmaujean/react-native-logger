import { IS_DEV, originalConsole } from './constants';
import { LoggerDbAdapter, noopAdapter } from './db/adapter';
import { redactValue } from './redaction';
import type { Logger, LoggerOptions, LogLevel } from './types';

// Make sure we have the original methods available globally
if (!console._originalLog) {
  console._originalLog = originalConsole.log;
}
if (!console._originalWarn) {
  console._originalWarn = originalConsole.warn;
}
if (!console._originalError) {
  console._originalError = originalConsole.error;
}

/**
 * Process arguments for logging, converting them to a single string
 */
function processArgs(args: any[], secureMode: boolean): string {
  try {
    // Apply redaction if in secure mode
    const processedArgs = secureMode
      ? args.map((arg) => redactValue(arg))
      : args;

    // Convert arguments to strings
    return processedArgs
      .map((arg) => {
        try {
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');
  } catch (e) {
    // If processing fails, return a fallback message
    return '[Error processing log arguments]';
  }
}

/**
 * Create a new logger instance
 * 
 * @param options Logger configuration options
 * @param dbAdapter Database adapter for persisting logs (optional)
 * @returns Logger instance
 */
export function createLogger(
  options: LoggerOptions = {}, 
  dbAdapter: LoggerDbAdapter = noopAdapter
): Logger {
  // Default options
  const loggerState = {
    enabled: options.enabled ?? true,
    secureMode: options.secureMode ?? true,
    console: options.console ?? (IS_DEV ? true : false), // Default to console in dev mode
  };

  /**
   * Log handler for all log levels
   */
  const logHandler = (level: LogLevel, ...args: any[]) => {
    // Skip if logging is disabled
    if (!loggerState.enabled) return;

    // Create a copy of the args array for processing
    const argsForProcessing = [...args];
    
    // Always log to console in development mode
    // In production, only log to console if explicitly enabled
    if (IS_DEV || loggerState.console) {
      // Special handling for test environment - use mockConsole if available
      if (typeof global !== 'undefined' && typeof (global as any).mockConsole !== 'undefined') {
        switch(level) {
          case 'log':
            (global as any).mockConsole.log(...args);
            break;
          case 'warn':
            (global as any).mockConsole.warn(...args);
            break;
          case 'error':
            (global as any).mockConsole.error(...args);
            break;
        }
      } else {
        // Use regular console in normal operation
        switch(level) {
          case 'log':
            console.log(...args);
            break;
          case 'warn':
            console.warn(...args);
            break;
          case 'error':
            console.error(...args);
            break;
        }
      }
    }

    // Process the arguments into a single message string
    const message = processArgs(argsForProcessing, loggerState.secureMode);

    // Extract metadata if the last argument is an object
    const lastArg = args.length > 0 ? args[args.length - 1] : undefined;
    const metadata = typeof lastArg === 'object' && lastArg !== null ? lastArg : null;

    // Add to database asynchronously with optional metadata
    dbAdapter.addLogEntry(level, message, metadata).catch(() => {
      // Silently fail to avoid infinite loops
    });
  };

  return {
    // Logging methods
    log: (...args: any[]) => logHandler('log', ...args),
    warn: (...args: any[]) => logHandler('warn', ...args),
    error: (...args: any[]) => logHandler('error', ...args),

    // Configuration methods
    setEnabled: (enabled: boolean) => {
      loggerState.enabled = enabled;
    },

    setSecureMode: (secure: boolean) => {
      loggerState.secureMode = secure;
    },

    getOptions: () => ({
      enabled: loggerState.enabled,
      secureMode: loggerState.secureMode,
      console: loggerState.console,
    }),
  };
}