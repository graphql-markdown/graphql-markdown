module.exports = {
  inPlace: true,
  logLevel: "error",
  coverageAnalysis: "perTest",
  jest: {
    config: {
      bail: false,
      collectCoverage: false,
      notify: false,
      reporters: [],
      verbose: false,
    },
    configFile: "jest.config.js",
    projectType: "custom",
    enableFindRelatedTests: true,
  },
  mutate: ["src/**/*.js", "!src/**/index.js", "!src/**/prettier.js"],
  packageManager: "yarn",
  reporters: ["clear-text", "progress", "html"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 85, low: 75, break: 70 },
};
