const jestConfigBase = require("../../jest.config");

module.exports = {
  ...jestConfigBase,
  name: "unit",
  displayName: "Unit Tests",
  testMatch: [`${__dirname}/**/?(*.)+(spec|test).js`],
  coverageDirectory: `${jestConfigBase.coverageDirectory}/unit`,
};
