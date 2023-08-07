// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

const config = {
  inPlace: false,
  ignoreStatic: true,
  coverageAnalysis: "perTest",
  jest: {
    projectType: "custom",
    config: {
      roots: [
        "<rootDir>/src/",
        "<rootDir>/tests/",
        "<rootDir>/tests/__mocks__",
      ],
      preset: "ts-jest",
      moduleFileExtensions: ["ts", "js"],
      testEnvironment: "node",
      bail: false,
      collectCoverage: false,
      notify: false,
      reporters: [],
      verbose: false,
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.test.json",
          },
        ],
      },
      collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
      testMatch: ["<rootDir>/tests/unit/**/(*.)+(spec|test).ts"],
    },
    enableFindRelatedTests: true,
  },
  mutate: ["src/**/*.ts", "!src/**/prettier.ts"],
  ignorePatterns: ["dist", "coverage", "build", "docs", "config", "assets"],
  packageManager: "npm",
  reporters: ["html"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 85, low: 75, break: 70 },
  symlinkNodeModules: true,
  dashboard: {},
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  buildCommand: "tsc -b",
};

module.exports = config;
