import React from 'react';
import type { LoggerOptions } from './types';
/**
 * Context value interface
 */
interface LoggerContextValue extends LoggerOptions {
    setEnabled: (enabled: boolean) => void;
    setSecureMode: (secure: boolean) => void;
}
/**
 * Props for the LoggerProvider component
 */
interface LoggerProviderProps {
    children: React.ReactNode;
    /**
     * Initial configuration for the logger
     */
    initialConfig?: Partial<LoggerOptions>;
    /**
     * Function to handle changes to logger settings
     */
    onSettingsChange?: (settings: {
        enabled: boolean;
        secureMode: boolean;
    }) => void;
}
/**
 * Provider component for logger settings
 * Manages logger settings state and persistence
 */
export declare const LoggerProvider: React.FC<LoggerProviderProps>;
/**
 * Hook to access logger settings from context
 * @returns Logger settings and setter functions
 */
export declare function useLoggerSettings(): LoggerContextValue;
/**
 * Render props component for rendering logger settings UI
 */
interface LoggerSettingsRenderProps {
    enabled: boolean;
    secureMode: boolean;
    setEnabled: (enabled: boolean) => void;
    setSecureMode: (secure: boolean) => void;
}
export declare const LoggerSettings: React.FC<{
    renderSettings: (settings: LoggerSettingsRenderProps) => React.ReactNode;
}>;
export {};
