const jestConfigBase = require("../../jest.config");

module.exports = {
  ...jestConfigBase,
  name: "integration",
  displayName: "Integration Tests",
  testMatch: ["integration/**/?(*.)+(spec|test).js"],
  coverageDirectory: `${jestConfigBase.coverageDirectory}/integration`,
};
