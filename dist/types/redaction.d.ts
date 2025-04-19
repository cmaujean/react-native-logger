/**
 * Redaction utilities for sensitive information in logs
 */
/**
 * Redacts sensitive information in a string
 *
 * @param input The string to redact
 * @returns A redacted version of the string
 */
export declare function redactSensitiveInfo(input: string): string;
/**
 * Redacts sensitive information in any value
 * - For objects, redacts each property recursively
 * - For arrays, redacts each element recursively
 * - For strings, applies redaction patterns
 * - For other primitives, returns as-is
 *
 * @param value Any value to redact
 * @returns Redacted value
 */
export declare function redactValue(value: any): any;
