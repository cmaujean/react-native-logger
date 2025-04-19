import React from 'react';
import type { Logger } from './types';
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
export declare function useLogger(logger: Logger): {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    setEnabled: (enabled: boolean) => void;
    setSecureMode: (secure: boolean) => void;
    config: import("./types").LoggerOptions;
};
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
export declare function withLogger<P extends object>(Component: React.ComponentType<P & {
    log: Logger['log'];
    warn: Logger['warn'];
    error: Logger['error'];
}>, logger: Logger): React.FC<P>;
