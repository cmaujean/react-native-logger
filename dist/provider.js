"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerSettings = exports.useLoggerSettings = exports.LoggerProvider = void 0;
const react_1 = __importStar(require("react"));
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const constants_1 = require("./constants");
/**
 * React context for logger settings
 */
const LoggerContext = (0, react_1.createContext)(null);
/**
 * Provider component for logger settings
 * Manages logger settings state and persistence
 */
const LoggerProvider = ({ children, initialConfig, onSettingsChange }) => {
    var _a, _b, _c;
    // Initialize state with provided or default config
    const [enabled, setEnabledState] = (0, react_1.useState)((_a = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.enabled) !== null && _a !== void 0 ? _a : false);
    const [secureMode, setSecureModeState] = (0, react_1.useState)((_b = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.secureMode) !== null && _b !== void 0 ? _b : true); // ensure the default is to be secure
    const [consoleOutput] = (0, react_1.useState)((_c = initialConfig === null || initialConfig === void 0 ? void 0 : initialConfig.console) !== null && _c !== void 0 ? _c : constants_1.IS_DEV);
    // Load saved settings on mount
    (0, react_1.useEffect)(() => {
        const loadSettings = async () => {
            try {
                const savedEnabled = await async_storage_1.default.getItem(constants_1.LOGGER_ENABLED_KEY);
                const savedSecureMode = await async_storage_1.default.getItem(constants_1.LOGGER_SECURE_MODE_KEY);
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
                if (constants_1.IS_DEV) {
                    console.error('Error loading logger settings:', error);
                }
            }
        };
        loadSettings();
    }, []);
    // Handler for changing enabled state
    const setEnabled = async (value) => {
        setEnabledState(value);
        await async_storage_1.default.setItem(constants_1.LOGGER_ENABLED_KEY, String(value));
        onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled: value, secureMode });
    };
    // Handler for changing secure mode
    const setSecureMode = async (value) => {
        setSecureModeState(value);
        await async_storage_1.default.setItem(constants_1.LOGGER_SECURE_MODE_KEY, String(value));
        onSettingsChange === null || onSettingsChange === void 0 ? void 0 : onSettingsChange({ enabled, secureMode: value });
    };
    // Create the context value
    const contextValue = (0, react_1.useMemo)(() => ({
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
exports.LoggerProvider = LoggerProvider;
/**
 * Hook to access logger settings from context
 * @returns Logger settings and setter functions
 */
function useLoggerSettings() {
    const context = (0, react_1.useContext)(LoggerContext);
    if (!context) {
        throw new Error('useLoggerSettings must be used within a LoggerProvider');
    }
    return context;
}
exports.useLoggerSettings = useLoggerSettings;
const LoggerSettings = ({ renderSettings }) => {
    var _a, _b;
    const settings = useLoggerSettings();
    // Ensure settings has non-undefined values for enabled and secureMode
    return <>{renderSettings({
            ...settings,
            enabled: (_a = settings.enabled) !== null && _a !== void 0 ? _a : false,
            secureMode: (_b = settings.secureMode) !== null && _b !== void 0 ? _b : true, // ensure the default is to be secure
        })}</>;
};
exports.LoggerSettings = LoggerSettings;
