"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsTable = exports.appLogsTable = void 0;
const cuid2_1 = require("@paralleldrive/cuid2");
const drizzle_orm_1 = require("drizzle-orm");
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
/**
 * Application logs table schema
 * Can be directly imported into a Drizzle schema file
 *
 * This file can be imported directly without pulling in React dependencies:
 * import { appLogsTable } from '@consensu.al/react-native-logger/schema';
 */
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
// Alias for backward compatibility
exports.logsTable = exports.appLogsTable;
