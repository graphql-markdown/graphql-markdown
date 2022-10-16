module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageReporters: ["json"],
  testEnvironment: "node",
  coverageThreshold: {
    global: require("./nyc.config"),
  },
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
