# Logger Tests

This directory contains tests for the @consensu.al/react-native-logger package. The tests are written using Jest with Bun as the runtime.

## Running Tests

To run all tests:

```bash
bun test
```

To run only core tests (database and redaction):

```bash
bun test:core
```

To run tests with watch mode (rerun on file changes):

```bash
bun test:watch
```

## Test Files

- **logger.test.ts**: Tests core logger functionality
- **redaction.test.ts**: Tests redaction of sensitive information
- **database.test.ts**: Tests database adapters
- **singleton.test.ts**: Tests the singleton logger instance
- **react.test.tsx**: Tests React integration (hooks and components)

## Notes on Test Environment

- The tests use Jest as the test framework with Bun as the runtime
- The `jest.setup.ts` file provides global mocks and environment setup including console mocking
- All tests are now operational, including console logging tests and React component tests
- A custom AsyncStorage mock is implemented in the `__mocks__` directory for React tests

## Writing Tests

When writing new tests:

1. Follow the existing patterns for structure and organization
2. Use Jest's `jest.fn()` for mocking functions
3. Keep tests isolated and avoid shared state
4. For React component tests, use `@testing-library/react-hooks` for hook testing
5. For console tests, use the global mockConsole object provided in the setup file
6. Always import React properly for JSX even if it's only used for types: `import * as React from "react";`

## Known Issues

- React tests show deprecation warnings about react-test-renderer being deprecated. These warnings don't affect functionality.
- When running React tests, you may see warnings about "The current testing environment is not configured to support act(...)". These are harmless.
- TypeScript compilation no longer includes test files in the dist directory as we've fixed the tsconfig.json configuration.