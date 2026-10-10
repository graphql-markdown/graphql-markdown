// Checks a packed package.json for internal dependency ranges that would not
// resolve to a real semver range once published.
//
// Only the dependency fields consumers install from are inspected
// (dependencies, peerDependencies, optionalDependencies); devDependencies
// never reach the registry. An internal dependency is one scoped under
// `@graphql-markdown/` or the `create-graphql-markdown-docs` package itself.
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

const CHECKED_FIELDS = [
  "dependencies",
  "peerDependencies",
  "optionalDependencies",
] as const;

const isInternal = (name: string): boolean =>
  name.startsWith("@graphql-markdown/") ||
  name === "create-graphql-markdown-docs";

const isUnpinned = (range: string): boolean => {
  const trimmed = range.trim();
  return (
    trimmed === "" ||
    trimmed === "*" ||
    trimmed === "latest" ||
    trimmed.startsWith("workspace:")
  );
};

export const findUnsafeInternalRanges = (
  pkg: Record<string, unknown>,
): string[] => {
  const problems: string[] = [];
  for (const field of CHECKED_FIELDS) {
    const deps = pkg[field];
    if (typeof deps !== "object" || deps === null) {
      continue;
    }
    for (const [name, range] of Object.entries(deps)) {
      if (isInternal(name) && typeof range === "string" && isUnpinned(range)) {
        problems.push(`${field}.${name} = "${range}"`);
      }
    }
  }
  return problems;
};
