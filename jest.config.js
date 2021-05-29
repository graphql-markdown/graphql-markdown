export default {
  coverageDirectory: "./coverage",
  coveragePathIgnorePatterns: ["node_modules", "tests"],
  globals: {
    "ts-jest": {
      diagnostics: false,
      tsconfig: "<rootDir>/tsconfig.eslint.json",
    },
  },
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {},
};
