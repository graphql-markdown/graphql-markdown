// @ts-check

import { createPackageConfig } from "@graphql-markdown/tooling-config/jest/base";

const baseConfig = createPackageConfig("cli");

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  ...baseConfig,
  // Commander v15 is ESM-only; configure Jest to transform it rather than ignore it.
  // The pattern excludes commander both as a direct install (node_modules/commander/)
  // and as a nested install (e.g. bun's .bun/commander@x/node_modules/commander/).
  transformIgnorePatterns: ["/node_modules/(?!(commander/|.*\\/commander/))"],
  transform: {
    ...baseConfig.transform,
    // Transform commander ESM JS files to CJS for the Jest (CJS) test environment
    "/commander/.*\\.js$": [
      "ts-jest",
      {
        tsconfig: {
          allowJs: true,
          module: "commonjs",
          moduleResolution: "bundler",
        },
        diagnostics: false,
      },
    ],
  },
};

export default config;
