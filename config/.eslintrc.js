// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["jest", "prettier", "@typescript-eslint"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
      },
    },
  },
  rules: {
    "prettier/prettier": "error",
    "brace-style": [
      "error",
      "1tbs",
      {
        allowSingleLine: false,
      },
    ],
  },
  ignorePatterns: ["**/packages/**/*.md"],
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: join(__dirname, ".."),
        project: ["./packages/*/tsconfig.test.json"],
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
      },
    },
    {
      files: ["**/*.mdx?"],
      extends: ["plugin:mdx/recommended"],
      settings: {
        "mdx/code-blocks": true,
        "mdx/language-mapper": {},
      },
    },
    {
      files: ["**/*.js"],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    {
      files: ["**/*.json"],
      extends: [
        "eslint:recommended",
        "plugin:prettier/recommended",
        "prettier",
        "plugin:jsonc/recommended-with-jsonc",
      ],
      parser: "jsonc-eslint-parser",
    },
    {
      files: ["**/*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
    },
  ],
};
