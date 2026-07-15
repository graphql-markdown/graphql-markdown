// @ts-check

/** @type {import('jest').Config} */
const config = {
  collectCoverage: false,
  displayName: "End-to-End Tests",
  globals: {
    __ROOT_DIR__: process.env.PROJECT_DIR ?? "/cli-gqlmd",
    __CLI_COMMAND__: "npx --silent gqlmd",
  },
  rootDir: import.meta.dirname,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).mjs"],
  transform: {},
  verbose: true,
};

export default config;
