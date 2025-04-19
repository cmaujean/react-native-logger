import React, { useCallback, useMemo } from 'react';
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
export function useLogger(logger) {
    // Memoize the logger methods to prevent unnecessary re-renders
    const log = useCallback((...args) => logger.log(...args), [logger]);
    const warn = useCallback((...args) => logger.warn(...args), [logger]);
    const error = useCallback((...args) => logger.error(...args), [logger]);
    const setEnabled = useCallback((enabled) => logger.setEnabled(enabled), [logger]);
    const setSecureMode = useCallback((secure) => logger.setSecureMode(secure), [logger]);
    const config = useMemo(() => logger.getOptions(), [logger]);
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
export function withLogger(Component, logger) {
    return (props) => {
        const { log, warn, error } = useLogger(logger);
        return <Component {...props} log={log} warn={warn} error={error}/>;
    };
}
