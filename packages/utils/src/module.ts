/**
 * Runtime module specifier helpers.
 *
 * @packageDocumentation
 */

const PASSTHROUGH = /^(?:\.{1,2}\/|\/|(?:file|http|https|jsr|npm|node|data):)/;

/**
 * Resolves a module specifier for dynamic `import()` at runtime.
 *
 * Node.js and Bun resolve bare names from `node_modules`, but Deno does not resolve them from
 * inside a JSR package. On Deno, `@graphql-markdown/*` names are prefixed with `jsr:` and other
 * bare names with `npm:`. Relative, absolute, URL and already prefixed specifiers are untouched.
 *
 * @param name - the module specifier.
 * @param range - optional version range inserted after the package name (e.g. `^3.8.3`).
 *
 * @returns the specifier to pass to `import()`.
 *
 * @example
 * ```ts
 * runtimeModuleSpecifier("prettier", "^3.8.3"); // Deno: "npm:prettier@^3.8.3", else "prettier"
 * ```
 */
export const runtimeModuleSpecifier = (
  name: string,
  range?: string,
): string => {
  if (!("Deno" in globalThis) || PASSTHROUGH.test(name)) {
    return name;
  }

  const prefix = name.startsWith("@graphql-markdown/") ? "jsr:" : "npm:";
  if (range === undefined || range === "") {
    return `${prefix}${name}`;
  }

  const segments = name.split("/");
  const count = name.startsWith("@") ? 2 : 1;
  const pkg = segments.slice(0, count).join("/");
  const subpath = segments.slice(count).map((segment) => {
    return `/${segment}`;
  });
  return `${prefix}${pkg}@${range}${subpath.join("")}`;
};
