import { noopAdapter } from "../db/adapter";

describe("NoopAdapter", () => {
  test("should have all required methods", () => {
    expect(typeof noopAdapter.addLogEntry).toBe("function");
    expect(typeof noopAdapter.getLogs).toBe("function");
    expect(typeof noopAdapter.clearLogs).toBe("function");
  });
  
  test("should resolve getLogs with empty array", async () => {
    const logs = await noopAdapter.getLogs();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBe(0);
  });
  
  test("should resolve clearLogs with true", async () => {
    const result = await noopAdapter.clearLogs();
    expect(result).toBe(true);
  });
});