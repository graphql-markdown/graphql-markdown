// @ts-check

// Installs every non-CLI/non-Docusaurus package tgz into the current project,
// mirroring the old Earthfile `INSTALL_GQLMD` UDC. Replaces install-gqlmd.sh:
// consumes the workspace build order directly instead of word-splitting
// `node build-packages.mjs` stdout in the shell.
//
// Must be run from within the target project directory (the caller cd's into it).
//
// Usage: node install-gqlmd.mjs <package-tgz-dir>

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const pkgDirArg = process.argv[2];
if (!pkgDirArg) {
  console.error("usage: install-gqlmd.mjs <package-tgz-dir>");
  process.exit(1);
}

// Capture cwd and resolve paths before importing build-packages: its transitive
// dependencies-utils import chdir()s the process as a side effect, which would
// otherwise move us out of the target project directory.
const projectDir = process.cwd();
const pkgDir = resolve(projectDir, pkgDirArg);

const { getBuildSequence } = await import(
  "../../packages/tooling-config/scripts/build-packages.mjs"
);

const tarballs = getBuildSequence()
  .filter((pkg) => {
    return pkg !== "cli" && pkg !== "docusaurus";
  })
  .map((pkg) => {
    return resolve(pkgDir, `graphql-markdown-${pkg}.tgz`);
  });

const result = spawnSync("npm", ["install", "--save", ...tarballs], {
  cwd: projectDir,
  stdio: "inherit",
});
if (result.error) {
  console.error(`npm install failed: ${result.error.message}`);
  process.exit(1);
}
process.exit(result.status ?? 1);
