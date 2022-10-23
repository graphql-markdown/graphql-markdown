// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */

const config = {
  inPlace: false,
  ignoreStatic: true,
  coverageAnalysis: "perTest",
  jest: {
    config: {
      projects: [],
      bail: false,
      collectCoverage: false,
      notify: false,
      reporters: [],
      verbose: true,
      testMatch: ["<rootDir>/tests/unit/**/?(*.)+(spec|test).js"], // unit tests only
    },
    projectType: "custom",
    enableFindRelatedTests: true,
  },
  mutate: ["src/**/*.js", "!src/**/prettier.js"],
  packageManager: "npm",
  reporters: ["html"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 85, low: 75, break: 70 },
  symlinkNodeModules: true,
  dashboard: {},
};

module.exports = config;
