// @ts-check

import { createProjectConfig } from "../jest/base.mjs";

const {
  roots,
  testEnvironment,
  transform,
  collectCoverageFrom,
  moduleNameMapper,
} = createProjectConfig("_", {
  testMatch: ["<rootDir>/tests/unit/**/(*.)+(spec|test).ts"],
});

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  buildCommand: "tsgo --build",
  checkers: ["typescript"],
  plugins: [
    "@stryker-mutator/jest-runner",
    "@stryker-mutator/typescript-checker",
  ],
  commandRunner: { command: "npm run test:ci" },
  coverageAnalysis: "perTest",
  dashboard: {},
  ignorePatterns: ["assets", "build", "config", "coverage", "dist", "docs"],
  ignoreStatic: true,
  inPlace: false,
  jest: {
    config: {
      bail: false,
      collectCoverage: false,
      collectCoverageFrom,
      moduleFileExtensions: ["js", "ts"],
      moduleNameMapper: Object.fromEntries(
        Object.entries(moduleNameMapper).map(([pattern]) => {
          return [pattern, "<rootDir>/../../../$1/src"];
        }),
      ),
      notify: false,
      preset: "ts-jest",
      reporters: [],
      roots,
      testEnvironment,
      testMatch: ["<rootDir>/tests/unit/**/(*.)+(spec|test).ts"],
      transform,
      verbose: false,
    },
    enableFindRelatedTests: true,
    projectType: "custom",
  },
  mutate: ["src/**/*.ts"],
  packageManager: "npm",
  reporters: ["html", "json"],
  symlinkNodeModules: true,
  testRunner: "jest",
  testRunnerNodeArgs: [],
  thresholds: { high: 85, low: 75, break: 70 },
  tsconfigFile: "tsconfig.json",
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  warnings: true,
};

export default config;
