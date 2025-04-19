import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { IS_DEV } from '../constants';
// Define the logs table schema directly in the file
export const appLogsTable = sqliteTable('app_logs', {
    id: text('id')
        .$defaultFn(() => createId())
        .notNull()
        .primaryKey(),
    timestamp: text('timestamp').default(sql `(CURRENT_TIMESTAMP)`),
    level: text('level').notNull(),
    message: text('message').notNull(),
    metadata: text('metadata'), // JSON stringified metadata
});
// Add type for _pendingLogs only if you need to access it from this file
// The global type is already defined in tests/setup.ts
/**
 * Create a Drizzle ORM adapter for logging
 *
 * @param db Drizzle SQLite database instance
 * @returns Database adapter for logging
 */
export function createDrizzleAdapter(db) {
    /**
     * Add a log entry to the database
     */
    const addLogEntry = async (level, message, metadata) => {
        try {
            // Check if the log table exists before attempting to insert
            try {
                await db.insert(appLogsTable).values({
                    id: createId(),
                    level,
                    message,
                    metadata: metadata ? JSON.stringify(metadata) : null,
                    // timestamp will be set by default in the database
                });
            }
            catch (insertError) {
                // If the table doesn't exist, store logs in memory until migrations complete
                const logEntry = {
                    level,
                    message,
                    metadata,
                    timestamp: new Date().toISOString()
                };
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
        }
        catch (error) {
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
            const logs = await db.select().from(appLogsTable).orderBy(appLogsTable.timestamp);
            return logs;
        }
        catch (error) {
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
    const clearLogs = async () => {
        try {
            await db.delete(appLogsTable);
            return true;
        }
        catch (error) {
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
    const processPendingLogs = async () => {
        var _a;
        if (((_a = global._pendingLogs) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            // Wait a moment to ensure migrations are complete
            setTimeout(async () => {
                try {
                    // Process each pending log
                    if (IS_DEV && console._originalLog) {
                        console._originalLog('Processing pending logs:', global._pendingLogs.length);
                    }
                    for (const log of global._pendingLogs) {
                        await addLogEntry(log.level, log.message, log.metadata);
                    }
                    // Clear the pending logs
                    global._pendingLogs = [];
                }
                catch (e) {
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
