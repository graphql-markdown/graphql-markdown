const projectConfig = (name) => ({
  displayName: `@graphql-markdown/${name}`,
  rootDir: `./packages/${name}`,
  roots: ["<rootDir>/src/", "<rootDir>/tests/", "<rootDir>/tests/__mocks__"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "<rootDir>../../.nyc_output",
  testMatch: ["<rootDir>/tests/(unit|integration)/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "@graphql-markdown/(.*)$": "<rootDir>/../$1/src",
  },
});


/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: "../",
  preset: "ts-jest",
  collectCoverage: true,
  coverageReporters: ["json"],
  moduleFileExtensions: ["ts", "js"],
  projects: [
    projectConfig("utils"),
    projectConfig("core"),
    projectConfig("printer-legacy"),
    projectConfig("diff"),
    projectConfig("docusaurus"),
  ],
};
