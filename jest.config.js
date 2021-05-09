module.exports = {
  projects: ["<rootDir>/packages"],
  verbose: true,
  collectCoverageFrom: ["<rootDir>/packages/**/src/**/*.js"],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "<rootDir>/.nyc_output",
  testEnvironment: "node",
};
