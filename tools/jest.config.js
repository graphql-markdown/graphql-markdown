const path = require("path");

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/packages/**/src/**/*.js"],
  coverageDirectory: "<rootDir>/.nyc_output",
  coverageReporters: ["json"],
  globals: {
    __OS__: require("os").platform() === "win32" ? "windows" : "unix",
  },
  projects: ["<rootDir>/packages/docusaurus/tests/unit", "<rootDir>/packages/docusaurus/tests/integration"],
  rootDir: path.join(__dirname, ".."),
  setupFilesAfterEnv: ["<rootDir>/packages/docusaurus/tests/jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/tests/(unit|integration)/**/*.(test|spec).js"],
  watchPathIgnorePatterns: ["__expected__"],
};
