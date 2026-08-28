import type { UserConfig } from "vite";

export declare const PACKAGES: string[];

export declare const createAlias: (
  packagesDir: string,
) => { find: RegExp; replacement: string }[];

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
