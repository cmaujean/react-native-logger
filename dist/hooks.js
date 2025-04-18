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
Object.defineProperty(exports, "__esModule", { value: true });
exports.withLogger = exports.useLogger = void 0;
const react_1 = __importStar(require("react"));
/**
 * React hook for using a logger in components
 *
 * @param logger Logger instance to use
 * @returns Logger methods with cached references
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { log, warn, error } = useLogger(myLogger);
 *
 *   log('Component rendered');
 *
 *   return <View />;
 * };
 * ```
 */
function useLogger(logger) {
    // Memoize the logger methods to prevent unnecessary re-renders
    const log = (0, react_1.useCallback)((...args) => logger.log(...args), [logger]);
    const warn = (0, react_1.useCallback)((...args) => logger.warn(...args), [logger]);
    const error = (0, react_1.useCallback)((...args) => logger.error(...args), [logger]);
    const setEnabled = (0, react_1.useCallback)((enabled) => logger.setEnabled(enabled), [logger]);
    const setSecureMode = (0, react_1.useCallback)((secure) => logger.setSecureMode(secure), [logger]);
    const config = (0, react_1.useMemo)(() => logger.getOptions(), [logger]);
    // Return the logger methods and configuration functions
    return {
        log,
        warn,
        error,
        setEnabled,
        setSecureMode,
        config,
    };
}
exports.useLogger = useLogger;
/**
 * Higher-order component to provide logging capabilities to a component
 *
 * @param Component The component to wrap
 * @param logger Logger instance to provide
 * @returns A component with logger props
 *
 * @example
 * ```tsx
 * const MyComponent = ({ log, warn, error }) => {
 *   log('Component rendered');
 *   return <View />;
 * };
 *
 * export default withLogger(MyComponent, myLogger);
 * ```
 */
function withLogger(Component, logger) {
    return (props) => {
        const { log, warn, error } = useLogger(logger);
        return <Component {...props} log={log} warn={warn} error={error}/>;
    };
}
exports.withLogger = withLogger;
