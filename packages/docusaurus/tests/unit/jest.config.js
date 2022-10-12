const jestConfigBase = require("../../../../tools/jest.config");

module.exports = {
  ...jestConfigBase,
  displayName: "Unit Tests",
  testMatch: ["**/tests/unit/**/?(*.)+(spec|test).js"],
  coverageDirectory: `${jestConfigBase.coverageDirectory}/unit`,
};
