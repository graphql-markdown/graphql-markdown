// jest.config.js
const { createProjectConfig } = require("./jest.base.config.js");

const projectConfig = (name) => createProjectConfig(name, {
  testMatch: ["<rootDir>/tests/(unit|integration)/**/(*.)+(spec|test).ts"],
});

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  collectCoverage: true,
  coverageReporters: ["json", "lcov"],
  moduleFileExtensions: ["ts", "js"],
  workerIdleMemoryLimit: "512M",
  projects: [
    projectConfig("cli"),
    projectConfig("core"),
    projectConfig("diff"),
    projectConfig("docusaurus"),
    projectConfig("graphql"),
    projectConfig("helpers"),
    projectConfig("logger"),
    projectConfig("printer-legacy"),
    projectConfig("utils"),
  ],
};
