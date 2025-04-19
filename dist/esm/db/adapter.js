/**
 * No-op adapter for when no database is provided
 */
export const noopAdapter = {
    async addLogEntry(_level, _message, _metadata) {
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
