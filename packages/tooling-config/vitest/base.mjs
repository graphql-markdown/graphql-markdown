// @ts-check

import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Resolves a workspace package `src` folder as an absolute path.
 *
 * @param {string} packagesDir
 * @param {string} subPath
 * @returns {string}
 */
const packagePath = (packagesDir, subPath) => `${packagesDir}/${subPath}`;

/**
 * Aliases replacing Jest's `moduleNameMapper`, resolving `@graphql-markdown/*`
 * specifiers to sibling package sources instead of built `dist` output.
 *
 * Order matters: the two `formatters` entries must be matched before the
 * generic catch-all.
 *
 * @param {string} packagesDir absolute path to the `packages` folder
 * @returns {{ find: RegExp, replacement: string }[]}
 */
const createAlias = (packagesDir) => [
  {
    find: /^@graphql-markdown\/formatters\/defaults$/,
    replacement: packagePath(packagesDir, "formatters/src/defaults"),
  },
  {
    find: /^@graphql-markdown\/formatters\/(.*)$/,
    replacement: packagePath(packagesDir, "formatters/src/$1/index"),
  },
  {
    find: /^@graphql-markdown\/(.*)$/,
    replacement: packagePath(packagesDir, "$1/src"),
  },
];

/**
 * Locates the workspace `packages` folder by walking up from a package root.
 *
 * A plain `../` would do for `packages/<name>/vitest.config.mjs`, but Stryker
 * copies the package into `packages/<name>/.stryker-tmp/sandbox-XXXX/` and runs
 * the config from there. Walking up keeps the `@graphql-markdown/*` aliases
 * pointing at the real sibling sources in both cases; without it they resolve
 * to a path that does not exist and every test file fails to load.
 *
 * @param {string} from absolute path of the package root
 * @returns {string} absolute path of the `packages` folder
 */
const findPackagesDir = (from) => {
  let current = resolve(from);

  while (basename(dirname(current)) !== "packages") {
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(
        `Unable to locate the workspace "packages" folder from "${from}".`,
      );
    }
    current = parent;
  }

  return dirname(current);
};

/**
 * @typedef {object} PackageConfigOptions
 * @property {number} [testTimeout]
 * @property {string[]} [include]
 * @property {boolean} [coverage]
 */

/**
 * @param {string} name package folder name under `packages/`
 * @param {string} configUrl `import.meta.url` of the calling config file
 * @param {PackageConfigOptions} [options]
 * @returns {import('vite').UserConfig}
 */
export const createPackageConfig = (name, configUrl, options = {}) => {
  const root = fileURLToPath(new URL(".", configUrl));
  const packagesDir = findPackagesDir(root);

  return defineConfig({
    resolve: {
      alias: createAlias(packagesDir),
      // Each workspace package resolves its own copy of `graphql`, and the
      // library rejects values built by a different instance ("Cannot use
      // GraphQLObjectType from another module or realm"). Jest collapsed the
      // copies through `moduleNameMapper`; Vite needs to be told explicitly.
      dedupe: ["graphql"],
    },
    test: {
      name: `@graphql-markdown/${name}`,
      root,
      globals: true,
      environment: "node",
      include: options.include ?? [
        "tests/{unit,integration}/**/*.{spec,test}.ts",
      ],
      exclude: ["**/node_modules/**", "**/dist/**", "**/__data__/**"],
      testTimeout: options.testTimeout ?? 5000,
      // Every package tests plain Node code with no native addon and no
      // `process.chdir`, so worker threads are safe and avoid a child process
      // per test file. Roughly 30% off the wall time of the larger packages,
      // where module transform and import dominate over the assertions.
      pool: "threads",
      // `graphql` ships a CJS and an ESM build with no `exports` map, so Vite
      // resolves it to `index.mjs` while an externalised dependency gets the
      // CJS `index.js` through Node. That yields two instances, and the library
      // rejects values built by the other one ("Cannot use GraphQLObjectType
      // from another module or realm"). Inlining the whole GraphQL ecosystem
      // keeps every consumer on one copy. Jest collapsed these via its CJS
      // registry, so it never hit this.
      server: {
        deps: {
          inline: [/^graphql$/, /^graphql\//, /@graphql-tools\//],
        },
      },
      // Replaces Jest's `testEnvironmentOptions.globalsCleanup`: each test file
      // runs in a fresh module registry so globals cannot leak between files.
      //
      // Turning this off is not worth it, and the question is settled: measured
      // across the workspace it saves ~160ms (1.82s -> 1.66s, 9%), and in return
      // `printer-legacy` fails nondeterministically — four identical runs gave
      // 35, 46, 41 and 5 failures, because which files share a worker varies.
      // The other nine packages are already clean; the coupling is `Printer`'s
      // mutable static state (`src/printer.ts`, only reset by `printer.test.ts`)
      // plus a few whole-surface `vi.mock` factories that clobber each other in
      // a shared registry. Both are worth fixing for order-independence, but on
      // their own merits — not for 160ms.
      isolate: true,
      coverage: {
        enabled: options.coverage ?? false,
        provider: "v8",
        include: ["src/**/*.ts"],
        reporter: ["json", "lcov"],
        reportsDirectory: "coverage",
      },
    },
  });
};
