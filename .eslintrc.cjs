const defaultExtends = [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended",
  "plugin:prettier/recommended",
  "prettier",
];

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    es6: true,
    jest: true,
    commonjs: true,
    "jest/globals": true,
  },
  extends: defaultExtends,
  plugins: ["@typescript-eslint", "jest"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["tests/**/*.ts"],
      extends: [
        ...defaultExtends,
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
