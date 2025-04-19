#!/usr/bin/env node

/**
 * Script to generate a drizzle schema file for the logger
 * This creates a logging-schema.ts file that users can include in their Drizzle schema
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Schema content to generate
const schemaContent = `/**
 * Generated schema file for @consensu.al/react-native-logger
 * Created on ${new Date().toISOString()}
 * 
 * This file can be imported into your main Drizzle schema to include the logging table
 */

import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Application logs table schema
 * Import this into your main Drizzle schema file
 */
export const appLogsTable = sqliteTable('app_logs', {
  id: text('id')
    .$defaultFn(() => createId())
    .notNull()
    .primaryKey(),
  timestamp: text('timestamp').default(sql\`(CURRENT_TIMESTAMP)\`),
  level: text('level').notNull(), // 'debug', 'info', 'warn', 'error'
  message: text('message').notNull(),
  metadata: text('metadata'), // JSON stringified metadata
});

// Alias for backward compatibility if you're upgrading from an older version
export const logsTable = appLogsTable;
`;

const targetDir = process.cwd();
const targetFile = path.join(targetDir, 'db', 'logging-schema.ts');
const mainSchemaFile = path.join(targetDir, 'db', 'schema.ts');

// Check if the directory exists
if (!fs.existsSync(path.join(targetDir, 'db'))) {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  Warning: db directory not found! Creating it...');
  fs.mkdirSync(path.join(targetDir, 'db'), { recursive: true });
}

// Write the schema file
fs.writeFileSync(targetFile, schemaContent);
console.log('\x1b[32m%s\x1b[0m', '✅ Created logging schema file at: ' + targetFile);

// Check if schema.ts exists and suggest import
let importInstructions = '';
if (fs.existsSync(mainSchemaFile)) {
  importInstructions = `
To import the logging schema in your main schema file, add the following line to ${mainSchemaFile}:

import { appLogsTable } from './logging-schema';

// And make sure to export it:
export { appLogsTable };
`;
} else {
  importInstructions = `
Could not find your main schema file (${mainSchemaFile}). 
When you create it, remember to import the logging schema:

import { appLogsTable } from './logging-schema';

// And make sure to export it:
export { appLogsTable };
`;
}

// Print instructions to the user
console.log(`
\x1b[36m%s\x1b[0m
🔍 Next Steps:
${importInstructions}
Then when configuring your logger:

import { createLogger, createDrizzleAdapter } from '@consensu.al/react-native-logger';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabase } from 'expo-sqlite';

// Create database connection
const sqliteDB = openDatabase('my-app.db');
const db = drizzle(sqliteDB);

// Create logger with database adapter
const logger = createLogger({
  enabled: true,
  secureMode: true,
  console: true,
}, createDrizzleAdapter(db));
`);

// Add a reminder about drizzle-kit
console.log('\x1b[33m%s\x1b[0m', `
Don't forget to run your Drizzle migrations to create the logging table:
bun x drizzle-kit generate
`);