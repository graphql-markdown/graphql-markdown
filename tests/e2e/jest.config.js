module.exports = {
  displayName: "End-to-End Tests",
  testEnvironment: "node",
  verbose: true,
  rootDir: __dirname,
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).js"],
  collectCoverage: false,
  transform: {},
};
