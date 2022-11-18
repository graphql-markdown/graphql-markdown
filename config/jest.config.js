module.exports = {
  extensionsToTreatAsEsm: [".ts"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageReporters: ["json"],
  testEnvironment: "node",
  coverageDirectory: "<rootDir>/.nyc_output",
  roots: ["<rootDir>", "<rootDir>/src"],
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/?(*.)+(spec|test).js"],
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/?(*.)+(spec|test).js"],
    },
  ],
};
