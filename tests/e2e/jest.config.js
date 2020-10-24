module.exports = {
  name: "e2e",
  displayName: "End-to-End Tests",
  testEnvironment: "node",
  verbose: true,
  rootDir: __dirname,
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "/usr/src/app/docusaurus2-graphql-doc-generator/src/**/*.js",
  ],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "<rootDir>/.nyc_output/e2e",
};
