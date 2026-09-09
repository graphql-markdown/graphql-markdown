// @ts-check

import { defineConfig } from "vitest/config";

/**
 * Standalone project for the repository tooling under `.github/scripts`. These
 * scripts are not part of a workspace package, so they cannot ride the
 * per-package configs, but they gate the whole CI matrix and need coverage.
 */
export default defineConfig({
  test: {
    name: "CI Scripts",
    root: import.meta.dirname,
    environment: "node",
    include: ["**/*.test.mts"],
  },
});
