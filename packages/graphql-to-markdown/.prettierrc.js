module.exports = {
  singleQuote: false,
  bracketSpacing: true,
  proseWrap: "preserve",
  overrides: [
    {
      files: "*.{ts,js}",
      options: {
        arrowParens: "always",
        printWidth: 80,
        trailingComma: "all",
        tabWidth: 2,
      },
    },
  ],
};
