/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
};
