import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGGER_ENABLED_KEY, LOGGER_SECURE_MODE_KEY, IS_DEV } from './constants';
/**
 * React context for logger settings
 */
const LoggerContext = createContext(null);
/**
 * Provider component for logger settings
 * Manages logger settings state and persistence
 */
export const LoggerProvider = ({ children, initialConfig, onSettingsChange }) => {
    var _a, _b, _c;
    // Initialize state with provided or default config
    const [enabled, setEnabledState] = useState((_a = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.enabled) !== null && _a !== void 0 ? _a : false);
    const [secureMode, setSecureModeState] = useState((_b = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.secureMode) !== null && _b !== void 0 ? _b : true); // ensure the default is to be secure
    const [consoleOutput] = useState((_c = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.console) !== null && _c !== void 0 ? _c : IS_DEV);
    // Load saved settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedEnabled = await AsyncStorage.getItem(LOGGER_ENABLED_KEY);
                const savedSecureMode = await AsyncStorage.getItem(LOGGER_SECURE_MODE_KEY);
                if (savedEnabled !== null) {
                    const parsedValue = savedEnabled === 'true';
                    setEnabledState(parsedValue);
                    onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled: parsedValue, secureMode });
                }
                if (savedSecureMode !== null) {
                    const parsedValue = savedSecureMode === 'true';
                    setSecureModeState(parsedValue);
                    onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled, secureMode: parsedValue });
                }
            }
            catch (error) {
                // If there's an error loading settings, use defaults
                // Only log in development mode
                if (IS_DEV) {
                    console.error('Error loading logger settings:', error);
                }
            }
        };
        loadSettings();
    }, []);
    // Handler for changing enabled state
    const setEnabled = async (value) => {
        setEnabledState(value);
        await AsyncStorage.setItem(LOGGER_ENABLED_KEY, String(value));
        onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled: value, secureMode });
    };
    // Handler for changing secure mode
    const setSecureMode = async (value) => {
        setSecureModeState(value);
        await AsyncStorage.setItem(LOGGER_SECURE_MODE_KEY, String(value));
        onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled, secureMode: value });
    };
    // Create the context value
    const contextValue = useMemo(() => ({
        enabled,
        secureMode,
        console: consoleOutput,
        setEnabled,
        setSecureMode,
    }), [enabled, secureMode, consoleOutput]);
    return (<LoggerContext.Provider value={contextValue}>
      {children}
    </LoggerContext.Provider>);
};
/**
 * Hook to access logger settings from context
 * @returns Logger settings and setter functions
 */
export function useLoggerSettings() {
    const context = useContext(LoggerContext);
    if (!context) {
        throw new Error('useLoggerSettings must be used within a LoggerProvider');
    }
    return context;
}
export const LoggerSettings = ({ renderSettings }) => {
    var _a, _b;
    const settings = useLoggerSettings();
    // Ensure settings has non-undefined values for enabled and secureMode
    return <>{renderSettings({
            ...settings,
            enabled: (_a = settings.enabled) !== null && _a !== void 0 ? _a : false,
            secureMode: (_b = settings.secureMode) !== null && _b !== void 0 ? _b : true, // ensure the default is to be secure
        })}</>;
};
