/**
 * Pure schema export for drizzle-kit compatibility
 * 
 * This file exports only the database schema without any React dependencies,
 * making it safe to use with drizzle-kit generate and other tools that can't 
 * process JSX or React code.
 */

'use strict';

// Re-export schema from the compiled schema file
module.exports = require('./dist/schema/index.js');