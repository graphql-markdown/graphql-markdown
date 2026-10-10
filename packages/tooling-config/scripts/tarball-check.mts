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

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

export const findUnsafeInternalRanges = (
  pkg: Record<string, unknown>,
): string[] => {
  return CHECKED_FIELDS.flatMap((field) => {
    return Object.entries(asRecord(pkg[field]))
      .filter(([name, range]) => {
        return (
          isInternal(name) && typeof range === "string" && isUnpinned(range)
        );
      })
      .map(([name, range]) => {
        return `${field}.${name} = "${String(range)}"`;
      });
  });
};

// Takes the raw package.json text from a packed tarball and returns the list
// of problems; an empty list means the manifest is safe to publish.
export const checkPackedManifest = (json: string): string[] => {
  let pkg: Record<string, unknown>;
  try {
    pkg = JSON.parse(json);
  } catch {
    return ["invalid package.json"];
  }
  const problems = findUnsafeInternalRanges(pkg);
  return problems.length > 0
    ? [`unpinned internal dependency ranges: ${problems.join(", ")}`]
    : [];
};
