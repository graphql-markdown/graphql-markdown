// @ts-check

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "End-to-End Tests",
    root: import.meta.dirname,
    globals: true,
    environment: "node",
    include: ["**/*.{spec,test}.mjs"],
    setupFiles: ["./vitest.setup.mjs"],
    // Replaces the `--runInBand` flag the smoke script passed to Jest: the
    // specs share one scaffolded project directory on disk.
    fileParallelism: false,
  },
});
