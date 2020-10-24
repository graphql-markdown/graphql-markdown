module.exports = {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: false,
  rootDir: __dirname,
  name: "e2e",
  displayName: "End-to-End Tests",
  testMatch: [`${__dirname}/**/?(*.)+(spec|test).js`],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
};
