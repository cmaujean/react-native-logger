/**
 * Pure schema export for drizzle-kit compatibility (ESM version)
 * 
 * This file exports only the database schema without any React dependencies,
 * making it safe to use with drizzle-kit generate and other tools that can't 
 * process JSX or React code.
 */

// Re-export schema from the compiled schema file
export * from './dist/schema/index.mjs';