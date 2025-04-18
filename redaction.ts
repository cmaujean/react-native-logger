/**
 * Redaction utilities for sensitive information in logs
 */

// Credit card numbers (Visa, Mastercard, Amex, Discover, etc.)
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;

// Social Security Numbers
const SSN_REGEX = /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g;

// Common API key patterns
const API_KEY_REGEX = /(?:api[_-]?key|apikey|key)(?:[\s:='"]*\s*|\s*[:=]\s*|\s*[=]\s*|['"]\s*:\s*['"]\s*|\s*:\s*['"]\s*)([\w\d-]{3,})/gi;

// Auth tokens (Bearer, JWT, etc.)
const AUTH_TOKEN_REGEX = /(?:bearer|authorization|auth|token|access_token|refresh_token)(?:[\s:='"]*)([\w\d\._\-]{5,})/gi;

// Email addresses
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

// Phone numbers (various formats)
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

// Password fields
const PASSWORD_REGEX = /(?:password|passwd|pwd)(?:[\s:='"]*\s*is\s*|\s*[:=]\s*|\s*[=]\s*|['"]\s*:\s*['"]\s*|\s*:\s*['"]\s*)([^\s,;'"]{3,})/gi;

// Private keys and secrets
const PRIVATE_KEY_REGEX = /(?:private[._-]?key|secret)(?:[\s:='"]*)([\w\d\._\-]{8,})/gi;

// JWT pattern (detects JWT format with base64 sections separated by periods)
const JWT_REGEX = /eyJ[\w-]*\.[\w-]*\.[\w-]*/g;

/**
 * List of all patterns to check for redaction
 */
const REDACTION_PATTERNS = [
  { regex: CREDIT_CARD_REGEX, replacement: '***REDACTED-CC***' },
  { regex: SSN_REGEX, replacement: '***REDACTED-SSN***' },
  { regex: API_KEY_REGEX, replacement: 'apikey=***REDACTED-API-KEY***' },
  { regex: AUTH_TOKEN_REGEX, replacement: 'authorization=***REDACTED-AUTH-TOKEN***' },
  { regex: EMAIL_REGEX, replacement: '***REDACTED-EMAIL***' },
  { regex: PHONE_REGEX, replacement: '***REDACTED-PHONE***' },
  { regex: PASSWORD_REGEX, replacement: 'password=***REDACTED-PASSWORD***' },
  { regex: PRIVATE_KEY_REGEX, replacement: 'private_key=***REDACTED-SECRET***' },
  { regex: JWT_REGEX, replacement: '***REDACTED-JWT-TOKEN***' },
];

/**
 * Redacts sensitive information in a string
 * 
 * @param input The string to redact
 * @returns A redacted version of the string
 */
export function redactSensitiveInfo(input: string): string {
  let result = input;
  
  // Apply each redaction pattern
  for (const pattern of REDACTION_PATTERNS) {
    result = result.replace(pattern.regex, pattern.replacement);
  }
  
  return result;
}

/**
 * Sensitive field names that should always be redacted
 */
const SENSITIVE_FIELD_NAMES = [
  'password',
  'secret',
  'token',
  'key',
  'auth',
  'credential',
  'jwt',
  'private',
  'cvv',
];

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
export function redactValue(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }
  
  // Handle strings directly
  if (typeof value === 'string') {
    return redactSensitiveInfo(value);
  }
  
  // Handle arrays recursively
  if (Array.isArray(value)) {
    return value.map(item => redactValue(item));
  }
  
  // Handle objects recursively (excluding non-plain objects like Date, etc.)
  if (typeof value === 'object' && value.constructor === Object) {
    const result: Record<string, any> = {};
    
    for (const key of Object.keys(value)) {
      // Special handling for common sensitive keys
      if (
        SENSITIVE_FIELD_NAMES.some(sensitiveKey => 
          key.toLowerCase().includes(sensitiveKey)
        ) &&
        // Don't redact objects containing sensitive keys, only the values
        typeof value[key] !== 'object'
      ) {
        result[key] = '***REDACTED***';
      } else {
        result[key] = redactValue(value[key]);
      }
    }
    
    return result;
  }
  
  // For other types (number, boolean, etc.)
  return value;
}