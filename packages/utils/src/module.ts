/**
 * Runtime module specifier helpers.
 *
 * @packageDocumentation
 */

import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

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

/**
 * Matches a relative path (`./` or `../`, with `/` or `\\` separators).
 */
const RELATIVE_PATH = /^\.{1,2}[/\\]/;

/**
 * Resolves a relative module path from a base folder, for dynamic `import()`.
 *
 * `import()` resolves a relative specifier from the importing module, which is a file inside
 * the installed package. A relative path is turned into an absolute `file:` URL resolved from
 * `base`, so that a path set in the user's configuration is read from their project folder.
 * Package names, absolute paths and URLs are returned unchanged.
 *
 * @param specifier - the module specifier.
 * @param base - the folder relative paths are resolved from. Defaults to `process.cwd()`.
 *
 * @returns the specifier to pass to `import()`.
 *
 * @example
 * ```ts
 * resolveRelativeSpecifier("./lib/custom-mdx.cjs"); // "file:///<cwd>/lib/custom-mdx.cjs"
 * resolveRelativeSpecifier("@graphql-markdown/formatters/mdx"); // unchanged
 * ```
 */
export const resolveRelativeSpecifier = (
  specifier: string,
  base: string = process.cwd(),
): string => {
  if (!RELATIVE_PATH.test(specifier)) {
    return specifier;
  }
  return pathToFileURL(resolve(base, specifier)).href;
};
