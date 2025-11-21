// jest.base.config.js - Shared base configuration for Jest
const createProjectConfig = (name, options = {}) => ({
  displayName: `@graphql-markdown/${name}`,
  extensionsToTreatAsEsm: [".ts"],
  prettierPath: null,
  rootDir: `./packages/${name}`,
  roots: ["<rootDir>/src/", "<rootDir>/tests/", "<rootDir>/tests/__mocks__"],
  testEnvironment: "node",
  testEnvironmentOptions: {
    globalsCleanup: 'on',
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/__data__/"],
  cacheDirectory: "<rootDir>/node_modules/.jest-cache",
  testTimeout: options.testTimeout || 5000,
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  testMatch: options.testMatch || ["<rootDir>/tests/(unit|integration)/**/(*.)+(spec|test).ts"],
  moduleNameMapper: {
    "@graphql-markdown/(.*)$": "<rootDir>/../$1/src",
  },
});

module.exports = { createProjectConfig };
