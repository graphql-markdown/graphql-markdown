module.exports = {
  ...require("@graphql-markdown/tools-config").jest,
  modulePathIgnorePatterns: [
    "<rootDir>/packages/diff/tests/__mocks__",
    "<rootDir>/packages/utils/tests/__mocks__",
  ],
};
