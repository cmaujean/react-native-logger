// Manual test of redaction functions to debug
import { redactSensitiveInfo, redactValue } from "../redaction.js";

// Test password redaction
const passwordInput = "My password is secret123";
console.log(`Original: "${passwordInput}"`);
console.log(`Redacted: "${redactSensitiveInfo(passwordInput)}"`);

// Test email redaction
const emailInput = "User email: test@example.com";
console.log(`\nOriginal: "${emailInput}"`);
console.log(`Redacted: "${redactSensitiveInfo(emailInput)}"`);

// Test API key redaction
const apiKeyInput = "api_key=abc123xyz";
console.log(`\nOriginal: "${apiKeyInput}"`);
console.log(`Redacted: "${redactSensitiveInfo(apiKeyInput)}"`);

// Test token redaction
const tokenInput = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
console.log(`\nOriginal: "${tokenInput}"`);
console.log(`Redacted: "${redactSensitiveInfo(tokenInput)}"`);

// Test complex object redaction
const complexInput = {
  user: {
    name: "John Doe",
    email: "john@example.com",
    credentials: {
      password: "secret123",
      api_key: "sk_test_12345",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    },
  }
};

console.log("\nComplex object redaction:");
console.log("Original:", JSON.stringify(complexInput, null, 2));
console.log("Redacted:", JSON.stringify(redactValue(complexInput), null, 2));