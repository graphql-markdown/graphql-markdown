import type { Config } from "jest";
import type { JestConfigWithTsJest } from "ts-jest";

export declare const PACKAGES: string[];

export declare const createProjectConfig: (
  name: string,
  options?: { testTimeout?: number; testMatch?: string[] },
) => Config;

export declare const createPackageConfig: (
  name: string,
  options?: { testTimeout?: number; testMatch?: string[] },
) => JestConfigWithTsJest;

export declare const createMultiProjectConfig: (
  rootDir: string,
  projectOptions: { testTimeout?: number; testMatch?: string[] },
  extraOptions?: Partial<Config>,
) => Config;
