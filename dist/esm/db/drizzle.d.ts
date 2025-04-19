import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { LoggerDbAdapter } from './adapter';
/**
 * Create a Drizzle ORM adapter for logging
 *
 * @param db Drizzle SQLite database instance
 * @returns Database adapter for logging
 */
export declare function createDrizzleAdapter(db: BaseSQLiteDatabase<any, any>): LoggerDbAdapter;
