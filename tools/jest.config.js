module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageDirectory: "<rootDir>/.nyc_output",
  coverageReporters: ["json"],
  globals: {
    __OS__: require("os").platform() === "win32" ? "windows" : "unix",
  },
  projects: ["<rootDir>/tests/unit", "<rootDir>/tests/integration"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/tests/(unit|integration)/**/*.(test|spec).js"],
  watchPathIgnorePatterns: ["__expected__"],
};
