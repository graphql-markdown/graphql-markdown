module.exports = {
  name: "docusaurus2-graphql-doc-generator",
  testEnvironment: "node",
  roots: ['<rootDir>'],
  testMatch: ["<rootDir>/tests/**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {},
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
    "@data/(.*)": "<rootDir>/tests/__data__/$1",
    "@assets/(.*)": "<rootDir>/assets/$1",
  },
};
