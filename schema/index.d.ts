import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Application logs table schema
 * Can be directly imported into a Drizzle schema file
 *
 * This file can be imported directly without pulling in React dependencies:
 * import { appLogsTable } from '@consensu.al/react-native-logger/schema';
 */
export declare const appLogsTable: ReturnType<typeof sqliteTable>;

// Alias for backward compatibility
export declare const logsTable: ReturnType<typeof sqliteTable>;