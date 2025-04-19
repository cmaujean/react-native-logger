"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDrizzleAdapter = exports.appLogsTable = void 0;
const cuid2_1 = require("@paralleldrive/cuid2");
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const constants_1 = require("../constants");
// Define the logs table schema directly in the file
exports.appLogsTable = (0, sqlite_core_1.sqliteTable)('app_logs', {
    id: (0, sqlite_core_1.text)('id')
        .$defaultFn(() => (0, cuid2_1.createId)())
        .notNull()
        .primaryKey(),
    timestamp: (0, sqlite_core_1.text)('timestamp').default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`),
    level: (0, sqlite_core_1.text)('level').notNull(),
    message: (0, sqlite_core_1.text)('message').notNull(),
    metadata: (0, sqlite_core_1.text)('metadata'), // JSON stringified metadata
});
// Add type for _pendingLogs only if you need to access it from this file
// The global type is already defined in tests/setup.ts
/**
 * Create a Drizzle ORM adapter for logging
 *
 * @param db Drizzle SQLite database instance
 * @returns Database adapter for logging
 */
function createDrizzleAdapter(db) {
    /**
     * Add a log entry to the database
     */
    const addLogEntry = async (level, message, metadata) => {
        try {
            // Check if the log table exists before attempting to insert
            try {
                await db.insert(exports.appLogsTable).values({
                    id: (0, cuid2_1.createId)(),
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
                if (constants_1.IS_DEV && console._originalError) {
                    console._originalError('Error adding log entry (stored in memory):', insertError);
                }
            }
        }
        catch (error) {
            // Don't log this error to avoid infinite loops
            // Log to the original console in development mode only
            if (constants_1.IS_DEV && console._originalError) {
                console._originalError('Error in addLogEntry:', error);
            }
        }
    };
    /**
     * Get all logs from the database, ordered by timestamp
     */
    const getLogs = async () => {
        try {
            const logs = await db.select().from(exports.appLogsTable).orderBy(exports.appLogsTable.timestamp);
            return logs;
        }
        catch (error) {
            // Use original console to avoid circular logging, but only in development mode
            if (constants_1.IS_DEV && console._originalError) {
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
            await db.delete(exports.appLogsTable);
            return true;
        }
        catch (error) {
            // Use original console to avoid circular logging, but only in development mode
            if (constants_1.IS_DEV && console._originalError) {
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
                    if (constants_1.IS_DEV && console._originalLog) {
                        console._originalLog('Processing pending logs:', global._pendingLogs.length);
                    }
                    for (const log of global._pendingLogs) {
                        await addLogEntry(log.level, log.message, log.metadata);
                    }
                    // Clear the pending logs
                    global._pendingLogs = [];
                }
                catch (e) {
                    if (constants_1.IS_DEV && console._originalError) {
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
exports.createDrizzleAdapter = createDrizzleAdapter;
