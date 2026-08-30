// @ts-check

import { defineConfig } from "vitest/config";

/**
 * Root config for running the whole workspace in one Vitest instance, sharing a
 * single Vite server and transform cache across every package instead of
 * bootstrapping ten of them through turbo. Used by `bun run test:all`.
 *
 * The per-package `vitest.config.mjs` files remain the entry point for turbo,
 * the CI matrix and Stryker, which all need a single package in isolation.
 */
export default defineConfig({
  test: {
    projects: ["packages/*/vitest.config.mjs"],
  },
});
