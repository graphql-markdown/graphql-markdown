module.exports = {
  projects: ["<rootDir>/tests/unit"],
  verbose: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  collectCoverage: true,
  coverageReporters: ["text"],
  testEnvironment: "node",
  testMatch: ["**/?(*.)+(spec|test).js"],
  rootDir: __dirname,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@data/(.*)": "<rootDir>/tests/__data__/$1",
    "@assets/(.*)": "<rootDir>/assets/$1",
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
