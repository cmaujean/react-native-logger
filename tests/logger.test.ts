import { createLogger } from "../logger";
import { noopAdapter } from "../db/adapter";
import type { LogLevel } from "../types";

describe("Logger core functionality", () => {
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
  });

  afterEach(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
  

  test("should create a logger instance with default options", () => {
    const logger = createLogger();
    const options = logger.getOptions();
    
    expect(options.enabled).toBe(true);
    expect(options.secureMode).toBe(true);
  });
  
  test("should create a logger instance with custom options", () => {
    const logger = createLogger({
      enabled: false,
      secureMode: false,
      console: false,
    });
    
    const options = logger.getOptions();
    expect(options.enabled).toBe(false);
    expect(options.secureMode).toBe(false);
    expect(options.console).toBe(false);
  });
  
  test("should log message to console when enabled with console option", () => {
    const logger = createLogger({
      enabled: true,
      console: true,
    }, noopAdapter);
    
    logger.log("Test message");
    logger.warn("Test warning");
    logger.error("Test error");
    
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    expect(mockConsole.warn).toHaveBeenCalledTimes(1);
    expect(mockConsole.error).toHaveBeenCalledTimes(1);
  });
  
  test("should not log to console when console option is false", () => {
    const logger = createLogger({
      enabled: true,
      console: false,
    }, noopAdapter);
    
    logger.log("Test message");
    logger.warn("Test warning");
    logger.error("Test error");
    
    expect(mockConsole.log).not.toHaveBeenCalled();
    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should not log when logger is disabled", () => {
    const logger = createLogger({
      enabled: false,
      console: true,
    }, noopAdapter);
    
    logger.log("Test message");
    logger.warn("Test warning");
    logger.error("Test error");
    
    expect(mockConsole.log).not.toHaveBeenCalled();
    expect(mockConsole.warn).not.toHaveBeenCalled();
    expect(mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should enable and disable logging", () => {
    const logger = createLogger({
      enabled: false,
      console: true,
    }, noopAdapter);
    
    // Initially disabled
    logger.log("This should not be logged");
    expect(mockConsole.log).not.toHaveBeenCalled();
    
    // Enable logging
    logger.setEnabled(true);
    logger.log("This should be logged");
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    
    // Disable logging again
    logger.setEnabled(false);
    logger.log("This should not be logged");
    expect(mockConsole.log).toHaveBeenCalledTimes(1); // Count stays the same
  });
  
  test("should enable and disable secure mode", () => {
    const logger = createLogger({
      enabled: true,
      secureMode: true,
      console: true,
    }, noopAdapter);
    
    // Set and verify secure mode
    logger.setSecureMode(false);
    expect(logger.getOptions().secureMode).toBe(false);
    
    logger.setSecureMode(true);
    expect(logger.getOptions().secureMode).toBe(true);
  });
  
  test("should allow multiple arguments to log methods", () => {
    const logger = createLogger({
      enabled: true,
      console: true,
    }, noopAdapter);
    
    logger.log("Message 1", "Message 2", { data: "test" });
    expect(mockConsole.log).toHaveBeenCalledTimes(1);
    expect(mockConsole.log).toHaveBeenCalledWith(
      "Message 1",
      "Message 2",
      { data: "test" }
    );
  });
  
  test("should use the provided database adapter", () => {
    const mockAdapter = {
      addLogEntry: jest.fn((level: LogLevel, message: string, metadata?: Record<string, any>) => Promise.resolve()),
      getLogs: jest.fn(() => Promise.resolve([])),
      clearLogs: jest.fn(() => Promise.resolve(true)),
    };
    
    const logger = createLogger({
      enabled: true,
    }, mockAdapter);
    
    logger.log("Test database log");
    
    expect(mockAdapter.addLogEntry).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addLogEntry).toHaveBeenCalledWith("log", expect.any(String), null);
  });
});