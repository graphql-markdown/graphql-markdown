module.exports = {
  packageManager: "yarn",
  reporters: ["clear-text", "progress", "html"],
  thresholds: { high: 80, low: 60, break: 50 },
  testRunner: "jest",
  coverageAnalysis: "perTest",
  ignorePatterns: ["!node_modules", "tests/e2e/**"],
  symlinkNodeModules: false,
  jest: {
    projectType: "custom",
    configFile: "jest.config.js",
  },
};
