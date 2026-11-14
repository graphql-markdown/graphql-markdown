export interface MemoryOutputAdapter {
  writeFile: (filePath: string, content: string) => Promise<void>;
  ensureDir: (dirPath: string) => Promise<void>;
  readFile: (filePath: string) => Promise<string | undefined>;
}

export declare const createMemoryOutputAdapter: () => {
  files: Map<string, string>;
  outputAdapter: MemoryOutputAdapter;
};
