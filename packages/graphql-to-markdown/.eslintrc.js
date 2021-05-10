module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
    commonjs: true,
    "jest/globals": true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["jest"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js",".ts"],
      },
    },
  },
  parserOptions: {
    sourceType: "module",
  },
  overrides: [
    {
      files: ["tests/**/*.{ts,js}"],
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
    "brace-style": [
      2,
      "1tbs",
      {
        allowSingleLine: false,
      },
    ],
  },
};
