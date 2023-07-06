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
  plugins: ["jest", "prettier"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js"],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2022,
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
    "prettier/prettier": "error",
    "node/no-extraneous-require": "off",
    "node/no-deprecated-api": "error",
    "brace-style": [
      "error",
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
