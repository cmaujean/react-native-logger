"use strict";
/**
 * React Native Consensual Logger
 *
 * A versatile logging system for React Native applications that includes:
 * - Database persistence via Drizzle ORM
 * - Secure mode with automatic redaction of sensitive information
 * - React context and hooks for easy usage in components
 * - Customizable formatting and log levels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGER_SECURE_MODE_KEY = exports.LOGGER_ENABLED_KEY = exports.IS_DEV = exports.setDatabaseAdapter = exports.getLoggerConfig = exports.enableSecureMode = exports.enableLogging = exports.error = exports.warn = exports.log = exports.logger = exports.initializeLoggerSingleton = exports.LoggerSettings = exports.useLoggerSettings = exports.LoggerProvider = exports.withLogger = exports.useLogger = exports.logsTable = exports.noopAdapter = exports.createDrizzleAdapter = exports.redactSensitiveInfo = exports.redactValue = exports.createLogger = void 0;
// Export core functionality
var logger_1 = require("./logger");
Object.defineProperty(exports, "createLogger", { enumerable: true, get: function () { return logger_1.createLogger; } });
var redaction_1 = require("./redaction");
Object.defineProperty(exports, "redactValue", { enumerable: true, get: function () { return redaction_1.redactValue; } });
Object.defineProperty(exports, "redactSensitiveInfo", { enumerable: true, get: function () { return redaction_1.redactSensitiveInfo; } });
// Export database adapters
var db_1 = require("./db");
Object.defineProperty(exports, "createDrizzleAdapter", { enumerable: true, get: function () { return db_1.createDrizzleAdapter; } });
Object.defineProperty(exports, "noopAdapter", { enumerable: true, get: function () { return db_1.noopAdapter; } });
// Export schema for database setup
var schema_1 = require("./schema");
Object.defineProperty(exports, "logsTable", { enumerable: true, get: function () { return schema_1.logsTable; } });
// Export React hooks and components
var hooks_1 = require("./hooks");
Object.defineProperty(exports, "useLogger", { enumerable: true, get: function () { return hooks_1.useLogger; } });
Object.defineProperty(exports, "withLogger", { enumerable: true, get: function () { return hooks_1.withLogger; } });
var provider_1 = require("./provider");
Object.defineProperty(exports, "LoggerProvider", { enumerable: true, get: function () { return provider_1.LoggerProvider; } });
Object.defineProperty(exports, "useLoggerSettings", { enumerable: true, get: function () { return provider_1.useLoggerSettings; } });
Object.defineProperty(exports, "LoggerSettings", { enumerable: true, get: function () { return provider_1.LoggerSettings; } });
// Export the singleton instance for convenience
var singleton_1 = require("./singleton");
Object.defineProperty(exports, "initializeLoggerSingleton", { enumerable: true, get: function () { return singleton_1.initializeLoggerSingleton; } });
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return singleton_1.logger; } });
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return singleton_1.log; } });
Object.defineProperty(exports, "warn", { enumerable: true, get: function () { return singleton_1.warn; } });
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return singleton_1.error; } });
Object.defineProperty(exports, "enableLogging", { enumerable: true, get: function () { return singleton_1.enableLogging; } });
Object.defineProperty(exports, "enableSecureMode", { enumerable: true, get: function () { return singleton_1.enableSecureMode; } });
Object.defineProperty(exports, "getLoggerConfig", { enumerable: true, get: function () { return singleton_1.getLoggerConfig; } });
Object.defineProperty(exports, "setDatabaseAdapter", { enumerable: true, get: function () { return singleton_1.setDatabaseAdapter; } });
// Export constants
var constants_1 = require("./constants");
Object.defineProperty(exports, "IS_DEV", { enumerable: true, get: function () { return constants_1.IS_DEV; } });
Object.defineProperty(exports, "LOGGER_ENABLED_KEY", { enumerable: true, get: function () { return constants_1.LOGGER_ENABLED_KEY; } });
Object.defineProperty(exports, "LOGGER_SECURE_MODE_KEY", { enumerable: true, get: function () { return constants_1.LOGGER_SECURE_MODE_KEY; } });
