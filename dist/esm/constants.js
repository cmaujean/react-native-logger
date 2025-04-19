/**
 * Development mode detection
 */
export const IS_DEV = process.env.NODE_ENV === 'development' ||
    (typeof __DEV__ !== 'undefined' && __DEV__);
/**
 * Storage keys for logger settings
 */
export const LOGGER_ENABLED_KEY = 'rn_logger_enabled';
export const LOGGER_SECURE_MODE_KEY = 'rn_logger_secure_mode';
/**
 * Default console methods
 */
export const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
};
