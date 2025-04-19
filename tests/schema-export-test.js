// Simple test to verify schema exports

// Test CJS import
const cjsSchema = require('../schema.js');
console.log('CJS Schema Test:');
console.log('appLogsTable available:', !!cjsSchema.appLogsTable);
console.log('logsTable available:', !!cjsSchema.logsTable);
console.log('---');

// We can't test ESM import in the same file, but we've confirmed the structure is correct