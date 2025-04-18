import { noopAdapter } from "../db/adapter";
import { createDrizzleAdapter } from "../db/drizzle";
import { appLogsTable } from "../schema";

describe("Database adapters", () => {
  describe("NoopAdapter", () => {
    test("should have the required interface methods", () => {
      expect(typeof noopAdapter.addLogEntry).toBe("function");
      expect(typeof noopAdapter.getLogs).toBe("function");
      expect(typeof noopAdapter.clearLogs).toBe("function");
    });
    
    test("addLogEntry should resolve without error", async () => {
      await expect(noopAdapter.addLogEntry("log", "Test message")).resolves.toBeUndefined();
    });
    
    test("getLogs should return empty array", async () => {
      const logs = await noopAdapter.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBe(0);
    });
    
    test("clearLogs should resolve to true", async () => {
      await expect(noopAdapter.clearLogs()).resolves.toBe(true);
    });
  });
  
  describe("DrizzleAdapter", () => {
    test("should create an adapter with the required methods", () => {
      // Create a mock Drizzle database
      const mockDb = {
        insert: jest.fn(() => ({ values: jest.fn(() => Promise.resolve()) })),
        select: jest.fn(() => ({ from: jest.fn(() => ({ orderBy: jest.fn(() => Promise.resolve([])) })) })),
        delete: jest.fn(() => Promise.resolve()),
      };
      
      const adapter = createDrizzleAdapter(mockDb as any);
      
      expect(typeof adapter.addLogEntry).toBe("function");
      expect(typeof adapter.getLogs).toBe("function");
      expect(typeof adapter.clearLogs).toBe("function");
    });
    
    test("addLogEntry should insert a log record", async () => {
      // Create a mock Drizzle database with spies
      const valuesMock = jest.fn(() => Promise.resolve());
      const insertMock = jest.fn(() => ({ values: valuesMock }));
      
      const mockDb = {
        insert: insertMock,
        select: jest.fn(() => ({ from: jest.fn(() => ({ orderBy: jest.fn(() => Promise.resolve([])) })) })),
        delete: jest.fn(() => Promise.resolve()),
      };
      
      const adapter = createDrizzleAdapter(mockDb as any);
      await adapter.addLogEntry("error", "Test error message");
      
      // Verify the insert was called with the correct table
      expect(insertMock).toHaveBeenCalledTimes(1);
      expect(insertMock).toHaveBeenCalledWith(appLogsTable);
      
      // Verify values was called with an object containing the correct fields
      expect(valuesMock).toHaveBeenCalledTimes(1);
      expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({
        level: "error",
        message: "Test error message",
      }));
    });
    
    test("getLogs should query and return logs", async () => {
      // Mock log data
      const mockLogs = [
        { id: "1", timestamp: "2023-01-01T00:00:00Z", level: "log", message: "Test log" },
        { id: "2", timestamp: "2023-01-01T00:01:00Z", level: "error", message: "Test error" }
      ];
      
      // Create mock chain
      const orderByMock = jest.fn(() => Promise.resolve(mockLogs));
      const fromMock = jest.fn(() => ({ orderBy: orderByMock }));
      const selectMock = jest.fn(() => ({ from: fromMock }));
      
      const mockDb = {
        insert: jest.fn(() => ({ values: jest.fn(() => Promise.resolve()) })),
        select: selectMock,
        delete: jest.fn(() => Promise.resolve()),
      };
      
      const adapter = createDrizzleAdapter(mockDb as any);
      const logs = await adapter.getLogs();
      
      // Verify the query chain was called correctly
      expect(selectMock).toHaveBeenCalledTimes(1);
      expect(fromMock).toHaveBeenCalledTimes(1);
      expect(fromMock).toHaveBeenCalledWith(appLogsTable);
      expect(orderByMock).toHaveBeenCalledTimes(1);
      
      // Verify returned logs
      expect(logs).toEqual(mockLogs);
    });
    
    test("clearLogs should delete all logs", async () => {
      // Create mock for delete operation
      const deleteMock = jest.fn(() => Promise.resolve());
      
      const mockDb = {
        insert: jest.fn(() => ({ values: jest.fn(() => Promise.resolve()) })),
        select: jest.fn(() => ({ from: jest.fn(() => ({ orderBy: jest.fn(() => Promise.resolve([])) })) })),
        delete: deleteMock,
      };
      
      const adapter = createDrizzleAdapter(mockDb as any);
      const result = await adapter.clearLogs();
      
      // Verify delete was called with the logs table
      expect(deleteMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledWith(appLogsTable);
      
      // Verify the function returned true for success
      expect(result).toBe(true);
    });
    
    test("should handle errors when adding logs", async () => {
      // Mock that throws an error
      const valuesMock = jest.fn(() => Promise.reject(new Error("Test error")));
      const insertMock = jest.fn(() => ({ values: valuesMock }));
      
      const mockDb = {
        insert: insertMock,
        select: jest.fn(() => ({ from: jest.fn(() => ({ orderBy: jest.fn(() => Promise.resolve([])) })) })),
        delete: jest.fn(() => Promise.resolve()),
      };
      
      // Spy on console._originalError if available
      const originalError = console._originalError;
      const errorSpy = jest.fn();
      console._originalError = errorSpy;
      
      const adapter = createDrizzleAdapter(mockDb as any);
      
      // This should not throw, but handle the error
      await adapter.addLogEntry("error", "This should not throw");
      
      // Restore console._originalError
      console._originalError = originalError;
    });
    
    test("should handle errors when getting logs", async () => {
      // Mock that throws an error
      const orderByMock = jest.fn(() => Promise.reject(new Error("Test error")));
      const fromMock = jest.fn(() => ({ orderBy: orderByMock }));
      const selectMock = jest.fn(() => ({ from: fromMock }));
      
      const mockDb = {
        insert: jest.fn(() => ({ values: jest.fn(() => Promise.resolve()) })),
        select: selectMock,
        delete: jest.fn(() => Promise.resolve()),
      };
      
      // Spy on console._originalError if available
      const originalError = console._originalError;
      const errorSpy = jest.fn();
      console._originalError = errorSpy;
      
      const adapter = createDrizzleAdapter(mockDb as any);
      
      // This should not throw, but return an empty array
      const logs = await adapter.getLogs();
      
      // Verify that an empty array was returned
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBe(0);
      
      // Restore console._originalError
      console._originalError = originalError;
    });
  });
});