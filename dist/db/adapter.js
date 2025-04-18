"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noopAdapter = void 0;
/**
 * No-op adapter for when no database is provided
 */
exports.noopAdapter = {
    async addLogEntry() {
        // Do nothing
        return Promise.resolve();
    },
    async getLogs() {
        return Promise.resolve([]);
    },
    async clearLogs() {
        return Promise.resolve(true);
    },
};
// Global array for storing pending logs
if (!global._pendingLogs) {
    global._pendingLogs = [];
}
