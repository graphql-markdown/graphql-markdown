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

// The base config's `src/**/*.ts` matches nothing in a Nuxt layer, whose
// sources sit at the package root.
config.test.coverage = {
  ...config.test.coverage,
  include: [
    "app/**/*.{ts,vue}",
    "modules/**/*.ts",
    "bin/**/*.mjs",
    "*.ts",
    "swizzle.manifest.mjs",
  ],
  exclude: ["tests/**", "**/*.d.ts", "*.config.*", "**/node_modules/**"],
};

export default config;
