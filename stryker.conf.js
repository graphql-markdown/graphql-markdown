module.exports = {
  commandRunner: {
    command:
      "NODE_ENV=ci node --expose-gc ./node_modules/.bin/jest --logHeapUsage --detectOpenHandles",
  },
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
  mutate: ["src/**/*.js", "!src/**/index.js"],
  packageManager: "yarn",
  reporters: ["clear-text", "progress", "html"],
  testRunner: "jest",
  thresholds: { high: 80, low: 60, break: 50 },
};
