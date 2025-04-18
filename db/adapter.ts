import { createId } from '@paralleldrive/cuid2';
import type { LogLevel } from '../types';
import { IS_DEV } from '../constants';

/**
 * Database adapter interface for the logger
 */
export interface LoggerDbAdapter {
  /**
   * Add a log entry to the database
   * @param level Log level (debug, info, warn, error)
   * @param message Log message text
   * @param metadata Optional metadata object to store with the log
   */
  addLogEntry: (level: LogLevel, message: string, metadata?: Record<string, any>) => Promise<void>;
  
  /**
   * Get all logs from the database
   */
  getLogs: () => Promise<any[]>;
  
  /**
   * Clear all logs from the database
   */
  clearLogs: () => Promise<boolean>;
}

/**
 * No-op adapter for when no database is provided
 */
export const noopAdapter: LoggerDbAdapter = {
  async addLogEntry(_level: LogLevel, _message: string, _metadata?: Record<string, any>) {
    // Do nothing
    return Promise.resolve();
  },
  
  async getLogs() {
    return Promise.resolve([]);
  },
  
  async clearLogs() {
    return Promise.resolve(true);
  },
};

// Global array for storing pending logs
if (!global._pendingLogs) {
  global._pendingLogs = [];
}