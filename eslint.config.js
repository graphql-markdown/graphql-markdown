// @ts-check
/**
 * ESLint 9 Flat Configuration
 * 
 * This configuration migrates from ESLint 8 .eslintrc.js to ESLint 9 flat config format.
 * 
 * Key changes from ESLint 8:
 * - Uses flat config format (eslint.config.js) instead of .eslintrc.js
 * - Requires @eslint/js package for base configurations
 * - Plugins are specified in the `plugins` object, not as strings
 * - Config extends are now spread into the array
 * - Parser is specified in `languageOptions.parser`
 * 
 * Dependencies required:
 * - @eslint/js (peer dependency of ESLint 9)
 * 
 * Run `bun install` to install missing dependencies.
 */

const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const jestPlugin = require("eslint-plugin-jest");
const importPlugin = require("eslint-plugin-import");
const tsdocPlugin = require("eslint-plugin-tsdoc");
const jsoncPlugin = require("eslint-plugin-jsonc");
const jsoncParser = require("jsonc-eslint-parser");
const mdxPlugin = require("eslint-plugin-mdx");
const graphqlPlugin = require("@graphql-eslint/eslint-plugin");

module.exports = [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.stryker-tmp/**",
      "**/docs/__api/**",
      "website/**",
    ],
  },

  // Base configuration for all files
  js.configs.recommended,

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
      import: importPlugin,
      tsdoc: tsdocPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
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
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/consistent-generic-constructors": "error",
      "@typescript-eslint/consistent-indexed-object-style": "error",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/consistent-type-definitions": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-base-to-string": "error",
      "@typescript-eslint/no-confusing-non-null-assertion": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/no-duplicate-type-constituents": "error",
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-invalid-void-type": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-redeclare": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["packages/*/src"],
              message: "Use package imports instead of direct paths",
            },
          ],
        },
      ],
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-enum-comparison": "error",
      "@typescript-eslint/no-unsafe-function-type": "error",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/non-nullable-type-assertion-style": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/sort-type-constituents": "error",
      "@typescript-eslint/unified-signatures": "error",
      "arrow-body-style": ["error", "always"],
      eqeqeq: "error",
      "no-else-return": "error",
      "no-fallthrough": ["error", { allowEmptyCase: true }],
      "no-mixed-operators": "error",
      "no-restricted-imports": "off",
      "no-return-await": "off",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "off",
      "tsdoc/syntax": "warn",
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      // Disable expensive rules if not critical
      "import/no-cycle": "off",
      "import/no-deprecated": "off",
      "sonarjs/cognitive-complexity": "off",
    },
  },

  // JavaScript files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
    },
  },

  // JSON files
  ...jsoncPlugin.configs["flat/recommended-with-jsonc"],
  {
    files: ["**/*.json"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // MDX files
  {
    files: ["**/*.mdx"],
    ...mdxPlugin.flat,
    plugins: {
      mdx: mdxPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      "mdx/code-blocks": true,
      "mdx/language-mapper": {},
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
    },
  },

  // GraphQL files
  {
    files: ["**/*.graphql", "**/*.gql"],
    plugins: {
      "@graphql-eslint": graphqlPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: graphqlPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
    },
  },

  // Apply prettier config last to override any conflicting rules
  prettierConfig,
];
