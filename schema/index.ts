import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Application logs table schema
 * Can be directly imported into a Drizzle schema file
 * 
 * This file can be imported directly without pulling in React dependencies:
 * import { appLogsTable } from '@consensu.al/react-native-logger/schema';
 */
export const appLogsTable = sqliteTable('app_logs', {
  id: text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
  level: text('level').notNull(), // 'debug', 'info', 'warn', 'error'
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON stringified metadata
});

// Alias for backward compatibility
export const logsTable = appLogsTable;