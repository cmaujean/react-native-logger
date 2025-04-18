import type { LogLevel } from '../types';
/**
 * Database adapter interface for the logger
 */
export interface LoggerDbAdapter {
    /**
     * Add a log entry to the database
     */
    addLogEntry: (level: LogLevel, message: string) => Promise<void>;
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
export declare const noopAdapter: LoggerDbAdapter;
