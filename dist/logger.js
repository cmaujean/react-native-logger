"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const constants_1 = require("./constants");
const adapter_1 = require("./db/adapter");
const redaction_1 = require("./redaction");
// Make sure we have the original methods available globally
if (!console._originalLog) {
    console._originalLog = constants_1.originalConsole.log;
}
if (!console._originalWarn) {
    console._originalWarn = constants_1.originalConsole.warn;
}
if (!console._originalError) {
    console._originalError = constants_1.originalConsole.error;
}
/**
 * Process arguments for logging, converting them to a single string
 */
function processArgs(args, secureMode) {
    try {
        // Apply redaction if in secure mode
        const processedArgs = secureMode
            ? args.map((arg) => (0, redaction_1.redactValue)(arg))
            : args;
        // Convert arguments to strings
        return processedArgs
            .map((arg) => {
            try {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg);
            }
            catch (_a) {
                return String(arg);
            }
        })
            .join(' ');
    }
    catch (e) {
        // If processing fails, return a fallback message
        return '[Error processing log arguments]';
    }
}
/**
 * Create a new logger instance
 *
 * @param options Logger configuration options
 * @param dbAdapter Database adapter for persisting logs (optional)
 * @returns Logger instance
 */
function createLogger(options = {}, dbAdapter = adapter_1.noopAdapter) {
    var _a, _b, _c;
    // Default options
    const loggerState = {
        enabled: (_a = options.enabled) !== null && _a !== void 0 ? _a : true,
        secureMode: (_b = options.secureMode) !== null && _b !== void 0 ? _b : true,
        console: (_c = options.console) !== null && _c !== void 0 ? _c : (constants_1.IS_DEV ? true : false), // Default to console in dev mode
    };
    /**
     * Log handler for all log levels
     */
    const logHandler = (level, ...args) => {
        // Skip if logging is disabled
        if (!loggerState.enabled)
            return;
        // Create a copy of the args array for processing
        const argsForProcessing = [...args];
        // Always log to console in development mode
        // In production, only log to console if explicitly enabled
        if (constants_1.IS_DEV || loggerState.console) {
            // Use the global console methods directly to avoid circular references
            // This fixes issues with Bun's environment
            switch (level) {
                case 'log':
                    console.log(...args);
                    break;
                case 'warn':
                    console.warn(...args);
                    break;
                case 'error':
                    console.error(...args);
                    break;
            }
        }
        // Process the arguments into a single message string
        const message = processArgs(argsForProcessing, loggerState.secureMode);
        // Add to database asynchronously
        dbAdapter.addLogEntry(level, message).catch(() => {
            // Silently fail to avoid infinite loops
        });
    };
    return {
        // Logging methods
        log: (...args) => logHandler('log', ...args),
        warn: (...args) => logHandler('warn', ...args),
        error: (...args) => logHandler('error', ...args),
        // Configuration methods
        setEnabled: (enabled) => {
            loggerState.enabled = enabled;
        },
        setSecureMode: (secure) => {
            loggerState.secureMode = secure;
        },
        getOptions: () => ({
            enabled: loggerState.enabled,
            secureMode: loggerState.secureMode,
            console: loggerState.console,
        }),
    };
}
exports.createLogger = createLogger;
