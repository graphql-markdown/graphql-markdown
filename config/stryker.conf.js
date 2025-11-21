// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

const config = {
  buildCommand: "tsc --build",
  checkers: ["typescript"],
  plugins: [
    "@stryker-mutator/jest-runner",
    "@stryker-mutator/typescript-checker"
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
      collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
      moduleFileExtensions: ["js", "ts"],
      notify: false,
      preset: "ts-jest",
      reporters: [],
      roots: [
        "<rootDir>/src/",
        "<rootDir>/tests/",
        "<rootDir>/tests/__mocks__",
      ],
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/unit/**/(*.)+(spec|test).ts"],
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.test.json",
          },
        ],
      },
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
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 85, low: 75, break: 70 },
  tsconfigFile: "tsconfig.json",
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  warnings: true,
};

module.exports = config;
