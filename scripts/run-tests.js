#!/usr/bin/env bun
/**
 * Custom test runner script for executing tests with Bun
 * This script avoids the issue with Jest running tests from the dist directory
 */

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { renameSync, existsSync } from 'fs';

const rootDir = dirname(import.meta.dir);
const distDir = join(rootDir, 'dist');
const tempDistDir = join(rootDir, '_dist_backup');

// Temporarily rename dist directory if it exists
if (existsSync(distDir)) {
  console.log('Temporarily moving dist directory...');
  renameSync(distDir, tempDistDir);
}

try {
  // Specify the tests to run
  const testFiles = [
    'tests/redaction.test.ts',
    'tests/database.test.ts',
    'tests/db.test.ts',
    'tests/logger.test.ts',
    'tests/singleton.test.ts',
    'tests/simple.test.js'
  ];

  // Run Jest with specific test files
  const jest = spawn('bun', ['jest', '--no-cache', ...testFiles], {
    stdio: 'inherit',
    cwd: rootDir
  });

  // Handle process exit
  jest.on('exit', (code) => {
    // Restore dist directory
    if (existsSync(tempDistDir)) {
      console.log('Restoring dist directory...');
      renameSync(tempDistDir, distDir);
    }
    process.exit(code);
  });
} catch (error) {
  // Make sure to restore dist directory on error
  if (existsSync(tempDistDir)) {
    console.log('Restoring dist directory after error...');
    renameSync(tempDistDir, distDir);
  }
  console.error('Error running tests:', error);
  process.exit(1);
}