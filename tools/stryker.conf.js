module.exports = {
  inPlace: false,
  logLevel: "error",
  coverageAnalysis: "perTest",
  jest: {
    config: {
      bail: false,
      collectCoverage: false,
      notify: false,
      reporters: [],
      verbose: false,
      testMatch: ["packages/**/tests/unit/**/*.(test).js"], // unit tests only
    },
    configFile: "jest.config.js",
    projectType: "custom",
    enableFindRelatedTests: true,
  },
  mutate: ["packages/**/src/**/*.js", "!packages/**/src/**/index.js", "!packages/**/src/**/prettier.js"],
  packageManager: "npm",
  reporters: ["html"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 85, low: 75, break: 70 },
  symlinkNodeModules: true,
};
