/** @type {import('jest').Config} */
const config = {
  collectCoverage: false,
  displayName: "End-to-End Tests",
  globals: {
    __ROOT_DIR__: "/cli-gqlmd",
  },
  rootDir: __dirname,
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/?(*.)+(spec|test).js"],
  transform: {},
  verbose: true,
};

module.exports = config;
