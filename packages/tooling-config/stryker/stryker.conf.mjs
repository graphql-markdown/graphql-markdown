// @ts-check

/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
const config = {
  buildCommand: "tsgo --build",
  checkers: ["typescript"],
  plugins: [
    "@stryker-mutator/vitest-runner",
    "@stryker-mutator/typescript-checker",
  ],
  commandRunner: { command: "npm run test:ci" },
  // The Vitest runner forces "perTest" and does not allow overriding it.
  coverageAnalysis: "perTest",
  dashboard: {},
  ignorePatterns: ["assets", "build", "config", "coverage", "dist", "docs"],
  ignoreStatic: true,
  inPlace: false,
  mutate: ["src/**/*.ts"],
  packageManager: "npm",
  reporters: ["html", "json"],
  symlinkNodeModules: true,
  testRunner: "vitest",
  testRunnerNodeArgs: [],
  thresholds: { high: 85, low: 75, break: 70 },
  tsconfigFile: "tsconfig.json",
  typescriptChecker: {
    prioritizePerformanceOverAccuracy: true,
  },
  vitest: {
    configFile: "vitest.config.mjs",
    // Integration specs exercise the generator end to end rather than
    // importing the mutated module directly, so Vitest's related-test
    // filtering would skip the tests that actually cover those mutants.
    related: false,
  },
  warnings: true,
};

export default config;
