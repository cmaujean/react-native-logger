import { createId } from '@paralleldrive/cuid2';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { LoggerDbAdapter } from './adapter';
import { logsTable } from '../schema';
import type { LogLevel } from '../types';
import { IS_DEV } from '../constants';

/**
 * Create a Drizzle ORM adapter for logging
 * 
 * @param db Drizzle SQLite database instance
 * @returns Database adapter for logging
 */
export function createDrizzleAdapter(db: BaseSQLiteDatabase<any, any>): LoggerDbAdapter {
  /**
   * Add a log entry to the database
   */
  const addLogEntry = async (level: LogLevel, message: string): Promise<void> => {
    try {
      // Check if the log table exists before attempting to insert
      try {
        await db.insert(logsTable).values({
          id: createId(),
          level,
          message,
          // timestamp will be set by default in the database
        });
      } catch (insertError) {
        // If the table doesn't exist, store logs in memory until migrations complete
        const logEntry = { level, message, timestamp: new Date().toISOString() };
        
        // Create a global array to store pending logs if it doesn't exist
        if (!global._pendingLogs) {
          global._pendingLogs = [];
        }
        
        // Add to pending logs
        global._pendingLogs.push(logEntry);
        
        // Only log the error in dev mode
        if (IS_DEV && console._originalError) {
          console._originalError('Error adding log entry (stored in memory):', insertError);
        }
      }
    } catch (error) {
      // Don't log this error to avoid infinite loops
      // Log to the original console in development mode only
      if (IS_DEV && console._originalError) {
        console._originalError('Error in addLogEntry:', error);
      }
    }
  };

  /**
   * Get all logs from the database, ordered by timestamp
   */
  const getLogs = async () => {
    try {
      const logs = await db.select().from(logsTable).orderBy(logsTable.timestamp);
      return logs;
    } catch (error) {
      // Use original console to avoid circular logging, but only in development mode
      if (IS_DEV && console._originalError) {
        console._originalError('Error getting logs:', error);
      }
      return [];
    }
  };

  /**
   * Clear all logs from the database
   */
  const clearLogs = async (): Promise<boolean> => {
    try {
      await db.delete(logsTable);
      return true;
    } catch (error) {
      // Use original console to avoid circular logging, but only in development mode
      if (IS_DEV && console._originalError) {
        console._originalError('Error clearing logs:', error);
      }
      return false;
    }
  };

  /**
   * Process any pending logs that were stored in memory
   * before the database was ready
   */
  const processPendingLogs = async (): Promise<void> => {
    if (global._pendingLogs?.length > 0) {
      // Wait a moment to ensure migrations are complete
      setTimeout(async () => {
        try {
          // Process each pending log
          if (IS_DEV && console._originalLog) {
            console._originalLog('Processing pending logs:', global._pendingLogs.length);
          }
          
          for (const log of global._pendingLogs) {
            await addLogEntry(log.level, log.message);
          }
          
          // Clear the pending logs
          global._pendingLogs = [];
        } catch (e) {
          if (IS_DEV && console._originalError) {
            console._originalError('Error processing pending logs:', e);
          }
        }
      }, 500);
    }
  };

  // Process any pending logs when adapter is created
  processPendingLogs();

  return {
    addLogEntry,
    getLogs,
    clearLogs,
  };
}