// @ts-check

// Replaces Jest's `globals` config option, which Vitest has no equivalent for.
// The specs and the shared CLI helper read these off the global scope.
globalThis.__ROOT_DIR__ = process.env.PROJECT_DIR ?? "/docusaurus-gqlmd";
globalThis.__CLI_COMMAND__ = "npx --silent docusaurus";
