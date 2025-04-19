import { LoggerDbAdapter } from './db/adapter';
import type { Logger, LoggerOptions } from './types';
/**
 * Create a new logger instance
 *
 * @param options Logger configuration options
 * @param dbAdapter Database adapter for persisting logs (optional)
 * @returns Logger instance
 */
export declare function createLogger(options?: LoggerOptions, dbAdapter?: LoggerDbAdapter): Logger;
