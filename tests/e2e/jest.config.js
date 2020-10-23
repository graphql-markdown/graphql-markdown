module.exports = {
  testEnvironment: "node",
  verbose: true,
  rootDir: __dirname,
  name: "e2e",
  displayName: "End-to-End Tests",
  testMatch: [`${__dirname}/**/?(*.)+(spec|test).js`],
};
