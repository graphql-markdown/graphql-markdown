const config = {
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  coverageReporters: ["json"],
  globals: {
    __OS__: require("os").platform() === "win32" ? "windows" : "unix",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  watchPathIgnorePatterns: ["__expected__"],
};

module.exports = {
  projects: [
    {
      displayName: "unit",
      testMatch: ["<rootDir>/tests/unit/**/?(*.)+(spec|test).js"],
      coverageDirectory: `<rootDir>/.nyc_output/unit`,
      ...config,
    },
    {
      displayName: "integration",
      testMatch: ["<rootDir>/tests/integration/**/?(*.)+(spec|test).js"],
      coverageDirectory: `<rootDir>/.nyc_output/integration`,
      ...config,
    },
  ],
};
