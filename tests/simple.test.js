// Simple test file using Jest

test("simple test", () => {
  expect(1 + 1).toBe(2);
});

test("async test", async () => {
  const result = await Promise.resolve(42);
  expect(result).toBe(42);
});

test("mock function", () => {
  const mock = () => "original";
  const fn = mock;
  
  expect(fn()).toBe("original");
});