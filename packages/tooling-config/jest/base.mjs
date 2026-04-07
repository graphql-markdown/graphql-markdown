// @ts-check

// Shared base configuration for Jest.
export const PACKAGES = [
  "cli",
  "core",
  "diff",
  "docusaurus",
  "graphql",
  "helpers",
  "logger",
  "printer-legacy",
  "utils",
];

/**
 * @param {string} name
 * @param {{ testTimeout?: number, testMatch?: string[] }} [options]
 * @returns {import('jest').Config}
 */
export const createProjectConfig = (name, options = {}) => ({
  displayName: `@graphql-markdown/${name}`,
  rootDir: `./packages/${name}`,
  roots: ["<rootDir>/src/", "<rootDir>/tests/", "<rootDir>/tests/__mocks__"],
  testEnvironment: "node",
  testEnvironmentOptions: {
    globalsCleanup: "on",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/__data__/"],
  cacheDirectory: "<rootDir>/node_modules/.jest-cache",
  testTimeout: options.testTimeout || 5000,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  testMatch: options.testMatch || ["<rootDir>/tests/(unit|integration)/**/(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "@graphql-markdown/(.*)$": "<rootDir>/../$1/src",
  },
});

/**
 * @param {string} name
 * @param {{ testTimeout?: number, testMatch?: string[] }} [options]
 * @returns {import('ts-jest').JestConfigWithTsJest}
 */
export const createPackageConfig = (name, options = {}) => {
  const { rootDir, ...projectConfig } = createProjectConfig(name, options);

  return {
    preset: "ts-jest",
    collectCoverage: true,
    coverageReporters: ["json", "lcov"],
    moduleFileExtensions: ["ts", "js"],
    workerIdleMemoryLimit: "512M",
    ...projectConfig,
  };
};

/**
 * @param {string} rootDir
 * @param {{ testTimeout?: number, testMatch?: string[] }} projectOptions
 * @param {Partial<import('jest').Config>} [extraOptions]
 * @returns {import('jest').Config}
 */
export const createMultiProjectConfig = (rootDir, projectOptions, extraOptions = {}) => ({
  rootDir,
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "js"],
  workerIdleMemoryLimit: "512M",
  ...extraOptions,
  projects: PACKAGES.map((name) => createProjectConfig(name, projectOptions)),
});
