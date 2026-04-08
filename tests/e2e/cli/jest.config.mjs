// @ts-check

/** @type {import('jest').Config} */
const config = {
  collectCoverage: false,
  displayName: "End-to-End Tests",
  globals: {
    __ROOT_DIR__: "/cli-gqlmd",
    __CLI_COMMAND__: "npx gqlmd",
  },
  rootDir: import.meta.dirname,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).mjs"],
  transform: {},
  verbose: true,
};

export default config;
