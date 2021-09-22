module.exports = {
  packageManager: "yarn",
  reporters: ["clear-text", "progress", "html"],
  thresholds: { high: 80, low: 60, break: 50 },
  testRunner: "jest",
  coverageAnalysis: "perTest",
  mutate: ["src/**/*.js", "!src/**/index.js"],
  jest: {
    projectType: "custom",
    configFile: "jest.config.js",
    config: {
      bail: false,
      collectCoverage: false,
      notify: false,
      reporters: [],
      verbose: false,
    },
  },
};
