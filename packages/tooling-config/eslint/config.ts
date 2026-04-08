import { join } from "node:path";
import globals from "globals";
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import jestPlugin from "eslint-plugin-jest";
import importPlugin from "eslint-plugin-import";
import tsdocPlugin from "eslint-plugin-tsdoc";
import jsoncPlugin from "eslint-plugin-jsonc";
import * as jsoncParser from "jsonc-eslint-parser";
import * as mdxPlugin from "eslint-plugin-mdx";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import type { ESLint, Linter } from "eslint";

// Get the project root directory (parent of packages/tooling-config/eslint/)
const projectRoot = join(import.meta.dirname, "../../..");

const prettierRules = {
  ...prettierConfig.rules,
  "prettier/prettier": "error" as const,
};

export default [
  // Global ignores
  {
    languageOptions: {
      globals: globals.node,
    },
  },
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
      "@typescript-eslint": tsPlugin as unknown as ESLint.Plugin,
      prettier: prettierPlugin,
      jest: jestPlugin,
      import: importPlugin,
      tsdoc: tsdocPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: projectRoot,
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: [
            "./tsconfig.json",
            "./packages/*/tsconfig.json",
            "./packages/*/tsconfig.test.json",
          ],
        },
      },
    },
    rules: {
      ...prettierRules,
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

  // TypeScript test files - use tsconfig.test.json
  {
    files: ["**/tests/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./packages/*/tsconfig.test.json"],
        tsconfigRootDir: projectRoot,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
  },

  // JavaScript files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    plugins: {
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
      ...prettierRules,
      "brace-style": [
        "error",
        "1tbs",
        {
          allowSingleLine: false,
        },
      ],
    },
  },

  {
    files: ["**/tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // JSON files
  {
    files: ["**/*.json"],
    plugins: {
      jsonc: jsoncPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: jsoncParser,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  // MDX files - using legacy config approach
  {
    files: ["**/*.mdx"],
    plugins: {
      mdx: mdxPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      "mdx/code-blocks": true,
      "mdx/language-mapper": {},
    },
    rules: {
      ...prettierRules,
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
      parser: graphqlPlugin.parser,
    },
    rules: {
      ...prettierRules,
    },
  },

  // Apply prettier config last to override any conflicting rules
  prettierConfig,
] satisfies Linter.FlatConfig[];
