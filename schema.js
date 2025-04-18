/**
 * Pure schema export for drizzle-kit compatibility
 * 
 * This file exports only the database schema without any React dependencies,
 * making it safe to use with drizzle-kit generate and other tools that can't 
 * process JSX or React code.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// Re-export schema from the schema directory
var schema = require('./schema/index');

exports.appLogsTable = schema.appLogsTable;
exports.logsTable = schema.logsTable;