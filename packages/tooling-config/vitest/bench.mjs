// @ts-check

/**
 * Creates an in-memory output adapter for benchmarks, so they measure the code
 * under test rather than disk writes.
 *
 * @returns {{
 *   files: Map<string, string>,
 *   outputAdapter: {
 *     writeFile: (filePath: string, content: string) => Promise<void>,
 *     ensureDir: (dirPath: string) => Promise<void>,
 *     readFile: (filePath: string) => Promise<string | undefined>,
 *   },
 * }}
 */
export const createMemoryOutputAdapter = () => {
  /** @type {Map<string, string>} */
  const files = new Map();

  return {
    files,
    outputAdapter: {
      writeFile: async (filePath, content) => {
        files.set(filePath, content);
      },
      ensureDir: async () => {},
      readFile: async (filePath) => files.get(filePath),
    },
  };
};
