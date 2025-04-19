"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsTable = exports.appLogsTable = void 0;

// Direct implementation to avoid import complexity
const cuid2_1 = require("@paralleldrive/cuid2");
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");

/**
 * Application logs table schema
 * Can be directly imported into a Drizzle schema file
 */
exports.appLogsTable = (0, sqlite_core_1.sqliteTable)('app_logs', {
    id: (0, sqlite_core_1.text)('id')
        .$defaultFn(() => (0, cuid2_1.createId)())
        .notNull()
        .primaryKey(),
    timestamp: (0, sqlite_core_1.text)('timestamp').default(drizzle_orm_1.sql `(CURRENT_TIMESTAMP)`),
    level: (0, sqlite_core_1.text)('level').notNull(),
    message: (0, sqlite_core_1.text)('message').notNull(),
    metadata: (0, sqlite_core_1.text)('metadata'),
});

// Alias for backward compatibility
exports.logsTable = exports.appLogsTable;