# Logger Tests

This directory contains tests for the @consensual/react-native-logger package. The tests are written using Jest with Bun as the runtime.

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
- The `jest.setup.ts` file provides global mocks and environment setup
- Some tests, particularly those involving console mocking and React components, are currently skipped

## Writing Tests

When writing new tests:

1. Follow the existing patterns for structure and organization
2. Use Jest's `jest.fn()` for mocking functions
3. Keep tests isolated and avoid shared state
4. For React component tests, use `@testing-library/react-hooks` for hook testing (requires proper React test renderer setup)

## Known Issues

- Console mocking is complicated when using Bun as the runtime, so those tests are skipped
- React component tests require proper setup of react-test-renderer with the correct React version
- Running tests in the /dist directory can cause duplicate test runs