/**
 * Development mode detection
 */
export declare const IS_DEV: boolean;
/**
 * Storage keys for logger settings
 */
export declare const LOGGER_ENABLED_KEY = "rn_logger_enabled";
export declare const LOGGER_SECURE_MODE_KEY = "rn_logger_secure_mode";
/**
 * Default console methods
 */
export declare const originalConsole: {
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    warn: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    error: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
};
