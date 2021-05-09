const jestConfigBase = require("../jest.config");
const { name } = require("./package.json")

module.exports = {
  ...jestConfigBase,
  name: name,
  displayName: name,
  testMatch: [`${__dirname}/**/?(*.)+(spec|test).js`],
  coverageDirectory: `${jestConfigBase.coverageDirectory}`,
};
