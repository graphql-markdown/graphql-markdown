module.exports = {
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
  },
  mutate: ["src/**/*.js", "!src/**/index.js", "!src/**/prettier.js"],
  packageManager: "yarn",
  reporters: ["clear-text", "progress", "html"],
  testRunner: "jest",
  testRunnerNodeArgs: ["--experimental-vm-modules"],
  thresholds: { high: 80, low: 60, break: 50 },
};
