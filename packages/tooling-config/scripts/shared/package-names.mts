// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

/** The npm org scope every workspace package is normally published under — one package (create-graphql-markdown-docs) is deliberately unscoped, see its own package.json comment/the plan history for why. */
export const ORG_NAME = "@graphql-markdown";

/**
 * Strips the `@graphql-markdown/` prefix off a package name, or returns it
 * unchanged if it never had one — a deliberately-unscoped package name has
 * no prefix to strip, not an error case.
 */
export const shortName = (packageName: string): string => {
  return packageName.startsWith(`${ORG_NAME}/`)
    ? packageName.slice(ORG_NAME.length + 1)
    : packageName;
};
