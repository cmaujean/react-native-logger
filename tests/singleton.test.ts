import { initializeLoggerSingleton, logger, log, warn, error, enableLogging, enableSecureMode, getLoggerConfig } from "../singleton";
import { LogLevel } from "../types";

describe("Logger singleton", () => {
  // Set up mocks for console methods
  const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };

  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up mock console methods for each test
    console.log = mockConsole.log;
    console.warn = mockConsole.warn;
    console.error = mockConsole.error;
    
    // Reset the singleton at the start of each test
    initializeLoggerSingleton({
      enabled: false,
      secureMode: true,
      console: false,
    });
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  test("should have default singleton instance", () => {
    // We initialize with disabled in our test setup, but let's re-initialize with default settings
    initializeLoggerSingleton();
    
    expect(logger).toBeDefined();
    expect(typeof log).toBe("function");
    expect(typeof warn).toBe("function");
    expect(typeof error).toBe("function");
    
    const config = getLoggerConfig();
    expect(config.enabled).toBe(true);
    expect(config.secureMode).toBe(true);
  });
  
  test("should initialize singleton with custom options", () => {
    const customLogger = initializeLoggerSingleton({
      enabled: false,
      secureMode: false,
      console: true,
    });
    
    // Check the custom instance
    expect(customLogger).toBeDefined();
    const config = customLogger.getOptions();
    expect(config.enabled).toBe(false);
    expect(config.secureMode).toBe(false);
    expect(config.console).toBe(true);
    
    // The global singleton should now reflect these settings
    const globalConfig = getLoggerConfig();
    expect(globalConfig.enabled).toBe(false);
    expect(globalConfig.secureMode).toBe(false);
  });
  
  test("should use the custom database adapter", () => {
    const mockAdapter = {
      addLogEntry: jest.fn((level: LogLevel, message: string, metadata?: Record<string, any>) => Promise.resolve()),
      getLogs: jest.fn(() => Promise.resolve([])),
      clearLogs: jest.fn(() => Promise.resolve(true)),
    };
    
    const customLogger = initializeLoggerSingleton({
      enabled: true,
      console: false,
    }, mockAdapter);
    
    // Log through the custom instance
    customLogger.log("Test message for custom adapter");
    
    // Verify the adapter was called
    expect(mockAdapter.addLogEntry).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addLogEntry).toHaveBeenCalledWith("log", expect.any(String), null);
    
    // Also verify that the global functions now use this adapter
    log("Test message for global adapter");
    expect(mockAdapter.addLogEntry).toHaveBeenCalledTimes(2);
  });
  
  test("should update global convenience methods when singleton is initialized", () => {
    // Initialize with console logging enabled
    initializeLoggerSingleton({
      enabled: true,
      console: true,
    });
    
    // Use the global methods
    log("Test log message");
    warn("Test warning message");
    error("Test error message");
    
    // Verify console methods were called
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    expect(mockConsole.warn).toHaveBeenCalledTimes(1);
    expect(mockConsole.error).toHaveBeenCalledTimes(1);
  });
  
  test("should respect enableLogging settings", () => {
    initializeLoggerSingleton({
      enabled: true,
      console: true,
    });
    
    // Test with logging enabled
    log("This should be logged");
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    
    // Disable logging
    enableLogging(false);
    log("This should not be logged");
    expect(mockConsole.log).toHaveBeenCalledTimes(1); // Still 1, not incremented
    
    // Re-enable logging
    enableLogging(true);
    log("This should be logged again");
    expect(mockConsole.log).toHaveBeenCalledTimes(2);
  });
  
  test("singleton methods should handle multiple arguments", () => {
    initializeLoggerSingleton({
      enabled: true,
      console: true,
    });
    
    log("Message 1", "Message 2", { data: "test" });
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    expect(mockConsole.log).toHaveBeenCalledWith(
      "Message 1",
      "Message 2",
      { data: "test" }
    );
  });
});