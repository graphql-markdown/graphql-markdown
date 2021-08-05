module.exports = {
  collectCoverage: false,
  displayName: "End-to-End Tests",
  name: "e2e",
  rootDir: __dirname,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).js"],
  verbose: true,
};
