import type { UserConfig } from "vite";

export interface PackageConfigOptions {
  testTimeout?: number;
  include?: string[];
  coverage?: boolean;
}

export declare const createPackageConfig: (
  name: string,
  configUrl: string,
  options?: PackageConfigOptions,
) => UserConfig;
