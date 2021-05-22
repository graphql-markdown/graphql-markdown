export default {
  globals: {
    'ts-jest': {
      tsConfig: {
        extends: '<rootDir>/tsconfig.json',
        include: ["src", "tests"],
      }
    }
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['node_modules', 'tests'],
  globals: { 'ts-jest': { diagnostics: false } },
  transform: {},
};
