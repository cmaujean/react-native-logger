import { redactValue, redactSensitiveInfo } from "../redaction";

describe("Redaction functionality", () => {
  test("should redact sensitive information in strings", () => {
    const result = redactSensitiveInfo("My password is secret123");
    expect(result).toContain("password=***REDACTED-PASSWORD***");
    expect(result).not.toContain("secret123");
  });
  
  test("should redact multiple sensitive info in the same string", () => {
    const input = "User login: user@example.com password: 12345 api_key: sk_test_123456789";
    const result = redactSensitiveInfo(input);
    
    expect(result).not.toContain("user@example.com");
    expect(result).not.toContain("12345");
    expect(result).not.toContain("sk_test_123456789");
    expect(result).toContain("***REDACTED");
  });
  
  test("should redact passwords in strings", () => {
    const cases = [
      "password=secret123",
      "password: mysecret",
      '"password":"securepassword"',
      "Password: MyS3cur3P4ss!",
      "pwd=1234",
      "passwd: 123456",
    ];
    
    for (const input of cases) {
      const result = redactSensitiveInfo(input);
      expect(result).toContain("***REDACTED");
      expect(result).not.toMatch(/password.*secret|pwd.*1234|passwd.*123456/i);
    }
  });
  
  test("should redact API keys", () => {
    const cases = [
      "api_key=abc123xyz",
      "apikey: my-secret-key",
      '"api_key":"sk_test_123456789"',
      "ApiKey: 12345abcde",
      "X-Api-Key: my-api-key-123",
    ];
    
    for (const input of cases) {
      const result = redactSensitiveInfo(input);
      expect(result).toContain("***REDACTED");
      // Just check that the original API key is gone
      expect(result).not.toMatch(/my-secret-key|sk_test_123456789|12345abcde|my-api-key-123/i);
    }
  });
  
  test("should redact tokens", () => {
    const cases = [
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "auth_token: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      '"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."',
      "Token: secret-token-12345",
      "refresh_token: rt-abcde12345",
    ];
    
    for (const input of cases) {
      const result = redactSensitiveInfo(input);
      expect(result).toContain("***REDACTED");
    }
  });
  
  test("should redact email addresses", () => {
    const cases = [
      "email=user@example.com",
      "email: john.doe@company.org",
      '"email":"contact@service.net"',
      "Email: admin@website.com",
    ];
    
    for (const input of cases) {
      const result = redactSensitiveInfo(input);
      expect(result).toContain("***REDACTED");
      expect(result).not.toMatch(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    }
  });
  
  test("should redact credit card numbers", () => {
    const cases = [
      "card=4111111111111111",
      "credit_card: 5555 5555 5555 4444",
      '"card_number":"3714-4963-5398-431"',
      "Credit Card: 6011000990139424",
    ];
    
    for (const input of cases) {
      const result = redactSensitiveInfo(input);
      expect(result).toContain("***REDACTED");
      expect(result).not.toMatch(/[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}[- ]?[0-9]{4}/);
    }
  });
  
  test("should handle complex nested objects with sensitive data", () => {
    const input = {
      user: {
        name: "John Doe",
        email: "john@example.com",
        credentials: {
          password: "secret123",
          api_key: "sk_test_12345",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
      payment: {
        card_number: "4111111111111111",
        expiry: "12/25",
        cvv: "123",
      },
      message: "Login with password: 12345",
    };
    
    const result = redactValue(input);
    
    expect(result.user.name).toBe("John Doe"); // Non-sensitive data preserved
    expect(result.user.email).toBe("***REDACTED-EMAIL***");
    expect(result.user.credentials.password).toBe("***REDACTED***");
    expect(result.user.credentials.api_key).toBe("***REDACTED***");
    expect(result.user.credentials.token).toBe("***REDACTED***");
    expect(result.payment.card_number).toBe("***REDACTED-CC***");
    expect(result.payment.cvv).toBe("***REDACTED***");
    expect(result.message).toContain("***REDACTED-PASSWORD***");
  });
  
  test("should handle arrays with sensitive data", () => {
    const input = [
      "User email: test@example.com",
      { password: "secret" },
      ["api_key=12345", "token=abcde"]
    ];
    
    const result = redactValue(input);
    
    expect(result[0]).toContain("***REDACTED-EMAIL***");
    expect(result[1].password).toBe("***REDACTED***");
    expect(result[2][0]).toContain("***REDACTED-API-KEY***");
    expect(result[2][1]).toContain("***REDACTED");
  });
  
  test("should handle non-object/non-string values", () => {
    expect(redactValue(123)).toBe(123);
    expect(redactValue(true)).toBe(true);
    expect(redactValue(null)).toBe(null);
    expect(redactValue(undefined)).toBe(undefined);
  });
});