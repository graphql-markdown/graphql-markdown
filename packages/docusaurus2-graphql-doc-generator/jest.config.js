module.exports = {
  displayName: "docusaurus2-graphql-doc-generator",
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsconfig: "<rootDir>/tsconfig.eslint.json",
    },
  },
  preset: "ts-jest",
  roots: ['<rootDir>'],
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.(spec|test).ts"],
  testPathIgnorePatterns: ["/node_modules/", "e2e"],
  transform: {},
};
