import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Application logs table schema
 */
export const logsTable = sqliteTable('app_logs', {
  id: text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  timestamp: text('timestamp').default(sql`(CURRENT_TIMESTAMP)`),
  level: text('level').notNull(), // 'log', 'warn', 'error'
  message: text('message').notNull(),
});