module.exports = {
  projects: ["<rootDir>/tests/unit", "<rootDir>/tests/integration"],
  verbose: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "<rootDir>/.nyc_output",
  testEnvironment: "node",
  rootDir: __dirname
};
