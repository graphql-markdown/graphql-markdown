// @ts-check

import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// Shared base configuration for Vitest.
export const PACKAGES = [
  "cli",
  "core",
  "diff",
  "docusaurus",
  "formatters",
  "graphql",
  "helpers",
  "logger",
  "printer-legacy",
  "utils",
];

/**
 * Resolves a workspace package `src` folder as an absolute path.
 *
 * @param {string} packagesDir
 * @param {string} subPath
 * @returns {string}
 */
const packagePath = (packagesDir, subPath) => `${packagesDir}/${subPath}`;

/**
 * Aliases replacing Jest's `moduleNameMapper`, resolving `@graphql-markdown/*`
 * specifiers to sibling package sources instead of built `dist` output.
 *
 * Order matters: the two `formatters` entries must be matched before the
 * generic catch-all.
 *
 * @param {string} packagesDir absolute path to the `packages` folder
 * @returns {{ find: RegExp, replacement: string }[]}
 */
export const createAlias = (packagesDir) => [
  {
    find: /^@graphql-markdown\/formatters\/defaults$/,
    replacement: packagePath(packagesDir, "formatters/src/defaults"),
  },
  {
    find: /^@graphql-markdown\/formatters\/(.*)$/,
    replacement: packagePath(packagesDir, "formatters/src/$1/index"),
  },
  {
    find: /^@graphql-markdown\/(.*)$/,
    replacement: packagePath(packagesDir, "$1/src"),
  },
];

/**
 * @typedef {object} PackageConfigOptions
 * @property {number} [testTimeout]
 * @property {string[]} [include]
 * @property {boolean} [coverage]
 */

/**
 * @param {string} name package folder name under `packages/`
 * @param {string} configUrl `import.meta.url` of the calling config file
 * @param {PackageConfigOptions} [options]
 * @returns {import('vite').UserConfig}
 */
export const createPackageConfig = (name, configUrl, options = {}) => {
  const root = fileURLToPath(new URL(".", configUrl));
  const packagesDir = fileURLToPath(new URL("../", configUrl));

  return defineConfig({
    resolve: {
      alias: createAlias(packagesDir.replace(/\/$/, "")),
    },
    test: {
      name: `@graphql-markdown/${name}`,
      root,
      globals: true,
      environment: "node",
      include: options.include ?? [
        "tests/{unit,integration}/**/*.{spec,test}.ts",
      ],
      exclude: ["**/node_modules/**", "**/dist/**", "**/__data__/**"],
      testTimeout: options.testTimeout ?? 5000,
      // Replaces Jest's `testEnvironmentOptions.globalsCleanup`: each test file
      // runs in a fresh module registry so globals cannot leak between files.
      isolate: true,
      restoreMocks: true,
      unstubGlobals: true,
      coverage: {
        enabled: options.coverage ?? false,
        provider: "v8",
        include: ["src/**/*.ts"],
        reporter: ["json", "lcov"],
        reportsDirectory: "coverage",
      },
    },
  });
};
