// @ts-check

// Packs every publishable workspace package into a .tgz (via `bun pm pack` from
// within each package dir), mirroring the old Earthfile `build-package` target.
// Replaces pack-packages.sh: consumes the workspace build order directly instead
// of word-splitting `node build-packages.mjs` stdout in the shell.
//
// Usage: node pack-packages.mjs <out-dir>

import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const outDirArg = process.argv[2];
if (!outDirArg) {
  console.error("usage: pack-packages.mjs <out-dir>");
  process.exit(1);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../");
// Resolve paths before importing build-packages: its transitive
// dependencies-utils import chdir()s the process as a side effect.
const outDir = resolve(process.cwd(), outDirArg);
mkdirSync(outDir, { recursive: true });

const { getBuildSequence } = await import(
  "../../packages/tooling-config/scripts/build-packages.mjs"
);

for (const pkg of getBuildSequence()) {
  const result = spawnSync(
    "bun",
    [
      "pm",
      "pack",
      "--quiet",
      "--filename",
      resolve(outDir, `graphql-markdown-${pkg}.tgz`),
    ],
    { cwd: resolve(repoRoot, "packages", pkg), stdio: "inherit" },
  );
  if (result.error) {
    console.error(`failed to pack ${pkg}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
