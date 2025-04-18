"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.originalConsole = exports.LOGGER_SECURE_MODE_KEY = exports.LOGGER_ENABLED_KEY = exports.IS_DEV = void 0;
/**
 * Development mode detection
 */
exports.IS_DEV = process.env.NODE_ENV === 'development' ||
    (typeof __DEV__ !== 'undefined' && __DEV__);
/**
 * Storage keys for logger settings
 */
exports.LOGGER_ENABLED_KEY = 'rn_logger_enabled';
exports.LOGGER_SECURE_MODE_KEY = 'rn_logger_secure_mode';
/**
 * Default console methods
 */
exports.originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
};
