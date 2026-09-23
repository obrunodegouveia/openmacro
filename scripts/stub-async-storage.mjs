/**
 * Stands in for `@react-native-async-storage/async-storage` when a check runs
 * a module that imports it under plain Node. Nothing under test reads or
 * writes storage; this exists so the import resolves.
 */
const memory = new Map();
export default {
  getItem: async (key) => memory.get(key) ?? null,
  setItem: async (key, value) => void memory.set(key, value),
  removeItem: async (key) => void memory.delete(key),
};
