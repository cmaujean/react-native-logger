/**
 * Simplified mock for @react-native-async-storage/async-storage
 * 
 * This replaces the implementation with a simple in-memory storage.
 */

const storage = new Map();

module.exports = {
  getItem: jest.fn(key => Promise.resolve(storage.get(key) || null)),
  setItem: jest.fn((key, value) => {
    storage.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn(key => {
    storage.delete(key);
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    storage.clear();
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve([...storage.keys()])),
  multiGet: jest.fn(keys => Promise.resolve(keys.map(key => [key, storage.get(key) || null]))),
  multiSet: jest.fn(keyValuePairs => {
    keyValuePairs.forEach(([key, value]) => storage.set(key, value));
    return Promise.resolve();
  }),
  multiRemove: jest.fn(keys => {
    keys.forEach(key => storage.delete(key));
    return Promise.resolve();
  }),
  multiMerge: jest.fn(() => Promise.resolve()),
  mergeItem: jest.fn(() => Promise.resolve()),
  flushGetRequests: jest.fn()
};