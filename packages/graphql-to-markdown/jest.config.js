const { name } = require("./package.json");

module.exports = {
  verbose: true,
  collectCoverageFrom: ["<rootDir>/packages/**/src/**/*.ts"],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "<rootDir>/.nyc_output",
  testEnvironment: "node",
  name: name,
  rootDir: __dirname,
  displayName: name,
  preset: "ts-jest",
  testMatch: ["<rootDir>/tests/**/?(*.)+(spec|test).ts"]
};
