// jest.integration.config.js - Optimized for integration tests
const { createProjectConfig } = require("./jest.base.config.js");

const projectConfig = (name) => createProjectConfig(name, {
  testTimeout: 30000,
  testMatch: ["<rootDir>/tests/integration/**/(*.)+(spec|test).ts"],
});

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  collectCoverage: false,
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
