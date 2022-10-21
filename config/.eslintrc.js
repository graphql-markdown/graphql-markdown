const path = require("path");

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
    commonjs: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:node/recommended",
    "plugin:import/recommended",
  ],
  plugins: ["jest"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js"],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["packages/**/tests/**/*.js"],
      extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "prettier",
        "plugin:jest/recommended",
        "plugin:jest/style",
      ],
    },
  ],
  rules: {
    "node/no-extraneous-require": 0,
    "node/no-deprecated-api": 2,
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: false,
      },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true,
        packageDir: [
          "./",
          "packages/core",
          "packages/diff",
          "packages/docusaurus",
          "packages/printer-legacy",
          "packages/utils",
        ],
      },
    ],
  },
};
