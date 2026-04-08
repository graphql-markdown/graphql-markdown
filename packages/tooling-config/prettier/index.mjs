// @ts-check

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

export default {
  singleQuote: false,
  bracketSpacing: true,
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.js",
      options: {
        arrowParens: "always",
        printWidth: 80,
        trailingComma: "all",
        tabWidth: 2,
      },
    },
  ],
};
