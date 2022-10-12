const jestConfigBase = require("../../../../tools/jest.config");

module.exports = {
  ...jestConfigBase,
  displayName: "Integration Tests",
  testMatch: ["**/tests/integration/**/?(*.)+(spec|test).js"],
  coverageDirectory: `${jestConfigBase.coverageDirectory}/integration`,
};
