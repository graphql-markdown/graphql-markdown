// @ts-check

// This config is copied into a scaffolded project by
// .github/scripts/e2e/smoke-test.sh and run there with `npx vitest`. That
// project has no local Vitest install, so the file must not import from
// "vitest/config" -- Vitest accepts a plain object just as well.

/** @type {import('vitest/node').UserConfig} */
const config = {
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
};

export default config;
