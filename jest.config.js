module.exports = {
  projects: ["<rootDir>/tests/unit", "<rootDir>/tests/integration"],
  verbose: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.js"],
  collectCoverage: true,
  coverageReporters: ["json"],
  coverageDirectory: "<rootDir>/.nyc_output",
  globals: {
    "__OS__": require("os").platform() === 'win32' ? 'windows' : 'unix'
  },
  testEnvironment: "node",
  rootDir: __dirname,
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@data/(.*)": "<rootDir>/tests/__data__/$1",
    "@assets/(.*)": "<rootDir>/assets/$1",
  },
};
