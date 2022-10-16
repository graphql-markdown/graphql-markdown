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
  ],
  plugins: ["jest"],
  globals: {
    __OS__: "writable",
  },
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
    "node/no-unpublished-require": 0, // temporary fix
    "node/no-deprecated-api": 2,
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: false,
      },
    ],
  },
};
