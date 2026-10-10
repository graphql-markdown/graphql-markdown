// @ts-check

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPackageConfig } from "@graphql-markdown/tooling-config/vitest/base";

const config = createPackageConfig("nuxt-theme", import.meta.url);
const root = fileURLToPath(new URL(".", import.meta.url));

// Add ~ alias for app directory. `resolve.alias` here is the array form
// (see @graphql-markdown/tooling-config/vitest/base's createAlias), so an
// object-index assignment silently no-ops — every existing test happens to
// mock `~/utils/*` rather than import it for real, which is why this went
// unnoticed until a test needed the alias to actually resolve.
config.resolve.alias = [
  ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
  { find: "~", replacement: resolve(root, "app") },
];

config.test.globalSetup = ["./tests/global-setup.mjs"];

// Nuxt's build injects `import.meta.client`; mirror it for unit tests.
config.define = { ...config.define, "import.meta.client": "true" };

// The base config's `src/**/*.ts` matches nothing in a Nuxt layer, whose
// sources sit at the package root. `.vue` files are left out: unit tests run
// without the Vue plugin, so v8 can't parse an un-imported SFC (it fails on
// `<template>` and drops the file anyway). Components are exercised by the
// integration fixtures' `nuxi generate` builds instead, and the SonarCloud
// scan excludes them from coverage to match (see .github/workflows/test.yml).
config.test.coverage = {
  ...config.test.coverage,
  include: [
    "app/**/*.ts",
    "modules/**/*.ts",
    "bin/**/*.mjs",
    "*.ts",
    "formatter.mjs",
    "swizzle.manifest.mjs",
  ],
  exclude: [
    "tests/**",
    "**/*.d.ts",
    "*.config.*",
    // Local dev entry point (not in package.json "files"): a no-op stub.
    "generate-docs.ts",
    "**/node_modules/**",
  ],
};

export default config;
