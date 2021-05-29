export default {
  displayName: "graphql-markdown",
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsconfig: "<rootDir>/tsconfig.eslint.json",
    },
  },
  preset: "ts-jest",
  roots: ['<rootDir>'],
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {},
};
