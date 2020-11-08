/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "progress"],
  testRunner: "jest",
  coverageAnalysis: "perTest",
  files: ["src/**/*.js", "tests/**/*.js", "!tests/e2e/**/*.js"],
  transpilers: ["typescript"],
};
