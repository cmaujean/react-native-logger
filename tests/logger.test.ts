import { createLogger } from "../logger";
import { noopAdapter } from "../db/adapter";
import type { LogLevel } from "../types";

describe("Logger core functionality", () => {
  // Now using the global test setup from setup.ts
  // We don't need any console setup here because it's handled there
  beforeEach(() => {
    jest.clearAllMocks();
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
    
    expect((global as any).mockConsole.log).toHaveBeenCalledTimes(1);
    expect((global as any).mockConsole.warn).toHaveBeenCalledTimes(1);
    expect((global as any).mockConsole.error).toHaveBeenCalledTimes(1);
  });
  
  test("should not log to console when console option is false", () => {
    const logger = createLogger({
      enabled: true,
      console: false,
    }, noopAdapter);
    
    logger.log("Test message");
    logger.warn("Test warning");
    logger.error("Test error");
    
    expect((global as any).mockConsole.log).not.toHaveBeenCalled();
    expect((global as any).mockConsole.warn).not.toHaveBeenCalled();
    expect((global as any).mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should not log when logger is disabled", () => {
    const logger = createLogger({
      enabled: false,
      console: true,
    }, noopAdapter);
    
    logger.log("Test message");
    logger.warn("Test warning");
    logger.error("Test error");
    
    expect((global as any).mockConsole.log).not.toHaveBeenCalled();
    expect((global as any).mockConsole.warn).not.toHaveBeenCalled();
    expect((global as any).mockConsole.error).not.toHaveBeenCalled();
  });
  
  test("should enable and disable logging", () => {
    const logger = createLogger({
      enabled: false,
      console: true,
    }, noopAdapter);
    
    // Initially disabled
    logger.log("This should not be logged");
    expect((global as any).mockConsole.log).not.toHaveBeenCalled();
    
    // Enable logging
    logger.setEnabled(true);
    logger.log("This should be logged");
    expect((global as any).mockConsole.log).toHaveBeenCalledTimes(1);
    
    // Disable logging again
    logger.setEnabled(false);
    logger.log("This should not be logged");
    expect((global as any).mockConsole.log).toHaveBeenCalledTimes(1); // Count stays the same
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
    expect((global as any).mockConsole.log).toHaveBeenCalledTimes(1);
    expect((global as any).mockConsole.log).toHaveBeenCalledWith(
      "Message 1",
      "Message 2",
      { data: "test" }
    );
  });
  
  test("should use the provided database adapter", () => {
    const mockAdapter = {
      addLogEntry: jest.fn((level: LogLevel, message: string) => Promise.resolve()),
      getLogs: jest.fn(() => Promise.resolve([])),
      clearLogs: jest.fn(() => Promise.resolve(true)),
    };
    
    const logger = createLogger({
      enabled: true,
    }, mockAdapter);
    
    logger.log("Test database log");
    
    expect(mockAdapter.addLogEntry).toHaveBeenCalledTimes(1);
    expect(mockAdapter.addLogEntry).toHaveBeenCalledWith("log", expect.any(String));
  });
});