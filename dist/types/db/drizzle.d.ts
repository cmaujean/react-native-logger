import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';
import { LoggerDbAdapter } from './adapter';
export declare const appLogsTable: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
    name: "app_logs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "id";
            tableName: "app_logs";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        timestamp: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "timestamp";
            tableName: "app_logs";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        level: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "level";
            tableName: "app_logs";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        message: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "message";
            tableName: "app_logs";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
        metadata: import("drizzle-orm/sqlite-core").SQLiteColumn<{
            name: "metadata";
            tableName: "app_logs";
            dataType: "string";
            columnType: "SQLiteText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, object>;
    };
    dialect: "sqlite";
}>;
/**
 * Create a Drizzle ORM adapter for logging
 *
 * @param db Drizzle SQLite database instance
 * @returns Database adapter for logging
 */
export declare function createDrizzleAdapter(db: BaseSQLiteDatabase<any, any>): LoggerDbAdapter;
