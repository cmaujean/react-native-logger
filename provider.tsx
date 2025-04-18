import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGGER_ENABLED_KEY, LOGGER_SECURE_MODE_KEY, IS_DEV } from './constants';
import type { LoggerOptions } from './types';

/**
 * Context value interface
 */
interface LoggerContextValue extends LoggerOptions {
  setEnabled: (enabled: boolean) => void;
  setSecureMode: (secure: boolean) => void;
}

/**
 * React context for logger settings
 */
const LoggerContext = createContext<LoggerContextValue | null>(null);

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
  onSettingsChange?: (settings: { enabled: boolean; secureMode: boolean }) => void;
}

/**
 * Provider component for logger settings
 * Manages logger settings state and persistence
 */
export const LoggerProvider: React.FC<LoggerProviderProps> = ({ 
  children, 
  initialConfig,
  onSettingsChange
}) => {
  // Initialize state with provided or default config
  const [enabled, setEnabledState] = useState(initialConfig?.enabled ?? false);
  const [secureMode, setSecureModeState] = useState(initialConfig?.secureMode ?? true); // ensure the default is to be secure
  const [consoleOutput] = useState(initialConfig?.console ?? IS_DEV);
  
  // Load saved settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedEnabled = await AsyncStorage.getItem(LOGGER_ENABLED_KEY);
        const savedSecureMode = await AsyncStorage.getItem(LOGGER_SECURE_MODE_KEY);
        
        if (savedEnabled !== null) {
          const parsedValue = savedEnabled === 'true';
          setEnabledState(parsedValue);
          onSettingsChange?.({ enabled: parsedValue, secureMode });
        }
        
        if (savedSecureMode !== null) {
          const parsedValue = savedSecureMode === 'true';
          setSecureModeState(parsedValue);
          onSettingsChange?.({ enabled, secureMode: parsedValue });
        }
      } catch (error) {
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
  const setEnabled = async (value: boolean) => {
    setEnabledState(value);
    await AsyncStorage.setItem(LOGGER_ENABLED_KEY, String(value));
    onSettingsChange?.({ enabled: value, secureMode });
  };
  
  // Handler for changing secure mode
  const setSecureMode = async (value: boolean) => {
    setSecureModeState(value);
    await AsyncStorage.setItem(LOGGER_SECURE_MODE_KEY, String(value));
    onSettingsChange?.({ enabled, secureMode: value });
  };
  
  // Create the context value
  const contextValue = useMemo(
    () => ({
      enabled,
      secureMode,
      console: consoleOutput,
      setEnabled,
      setSecureMode,
    }),
    [enabled, secureMode, consoleOutput]
  );
  
  return (
    <LoggerContext.Provider value={contextValue}>
      {children}
    </LoggerContext.Provider>
  );
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

/**
 * Render props component for rendering logger settings UI
 */
interface LoggerSettingsRenderProps {
  enabled: boolean;
  secureMode: boolean;
  setEnabled: (enabled: boolean) => void;
  setSecureMode: (secure: boolean) => void;
}

export const LoggerSettings: React.FC<{
  renderSettings: (settings: LoggerSettingsRenderProps) => React.ReactNode;
}> = ({ renderSettings }) => {
  const settings = useLoggerSettings();
  
  // Ensure settings has non-undefined values for enabled and secureMode
  return <>{renderSettings({
    ...settings,
    enabled: settings.enabled ?? false,
    secureMode: settings.secureMode ?? true, // ensure the default is to be secure
  })}</>;
};