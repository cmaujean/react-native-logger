/**
 * Application logs table schema
 */
export declare const logsTable: import("drizzle-orm/sqlite-core").SQLiteTableWithColumns<{
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
    };
    dialect: "sqlite";
}>;
