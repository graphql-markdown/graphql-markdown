// Publishes publishable workspace packages to npm.
//
// Packs each package with `bun pm pack` before publishing the tarball via
// npm, because these packages' `dependencies`/`peerDependencies` use bun's
// `workspace:` specifiers, which plain `npm publish` from a package
// directory does not resolve to real semver ranges — publishing from source
// directly would ship a broken package.
//
// Replaces the former publish-package.sh + publish-release.sh pair: a single
// script covers both a single package and the full dependency-ordered
// release, and drops the interactive confirmation when run non-interactively
// (CI, or with --yes) so it can run unattended in GitHub Actions.
//
// Usage: node publish-release.mts [--dry-run|-n] [--yes|-y] [<package-name>]
//
// With no package name, publishes every publishable package in dependency
// order (types -> utils/logger/graphql -> ... -> docusaurus), skipping any
// package whose current version is already live on npm. Publishing stops at
// the first failure, since later packages in that order may depend on the
// one that just failed.
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

type PublishPlanEntry = {
  pkg: string;
  name: string;
  version: string;
  alreadyPublished: boolean;
};

const USAGE =
  "Usage: node publish-release.mts [--dry-run|-n] [--yes|-y] [<package-name>]";
const KNOWN_FLAGS = new Set(["--dry-run", "-n", "--yes", "-y", "--help", "-h"]);

const args = process.argv.slice(2);
const unknownFlag = args.find((arg) => {
  return arg.startsWith("-") && !KNOWN_FLAGS.has(arg);
});
if (unknownFlag) {
  console.error(`Error: unknown option "${unknownFlag}"\n${USAGE}`);
  process.exit(1);
}

const positional = args.filter((arg) => {
  return !arg.startsWith("-");
});
if (positional.length > 1) {
  console.error(`Error: too many arguments\n${USAGE}`);
  process.exit(1);
}

const dryRun = args.includes("--dry-run") || args.includes("-n");
const skipConfirm = args.includes("--yes") || args.includes("-y");
const shouldPrompt = !dryRun && !skipConfirm && process.stdin.isTTY;

if (args.includes("--help") || args.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../../");

// Resolve paths before importing build-packages: its transitive
// dependencies-utils import chdir()s the process as a side effect. Every
// spawnSync/spawn call below passes an explicit `cwd` for the same reason.
const { getBuildSequence } = await import("./build-packages.mjs");

const buildSequence: string[] = getBuildSequence();
const packageArg = positional[0];

if (packageArg && !buildSequence.includes(packageArg)) {
  console.error(
    `Error: unknown or non-publishable package "${packageArg}". Available: ${buildSequence.join(", ")}`,
  );
  process.exit(1);
}

const packages = packageArg ? [packageArg] : buildSequence;

const confirm = async (message: string): Promise<boolean> => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(message);
  rl.close();
  return /^y$/i.test(answer.trim());
};

const hasUncommittedChanges = (): boolean => {
  const status = spawnSync("git", ["status", "--porcelain"], {
    cwd: repoRoot,
    encoding: "utf-8",
  });
  return status.stdout.trim().length > 0;
};

const isPublished = (name: string, version: string): Promise<boolean> => {
  return new Promise((resolvePromise) => {
    const child = spawn("npm", ["view", `${name}@${version}`, "version"], {
      cwd: repoRoot,
    });
    let stdout = "";
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.on("error", () => {
      resolvePromise(false);
    });
    child.on("close", (code) => {
      // A non-zero exit (E404: package or version never published) is the
      // expected "not published yet" case; treat any other npm view failure
      // the same way and let the publish attempt itself surface the error.
      resolvePromise(code === 0 && stdout.trim() === version);
    });
  });
};

const packTarball = (packageDir: string, tarballPath: string): boolean => {
  const pack = spawnSync(
    "bun",
    ["pm", "pack", "--quiet", "--filename", tarballPath],
    { cwd: packageDir, stdio: "inherit" },
  );
  return !pack.error && pack.status === 0;
};

const isTarballSafe = (
  tarballPath: string,
  name: string,
  version: string,
): boolean => {
  const packedPackageJson = spawnSync(
    "tar",
    ["-xzf", tarballPath, "-O", "package/package.json"],
    { cwd: repoRoot, encoding: "utf-8" },
  );
  if (packedPackageJson.error || packedPackageJson.status !== 0) {
    console.error(
      `failed to inspect tarball for ${name}@${version}: could not read its package.json`,
    );
    return false;
  }
  if (packedPackageJson.stdout.includes('"workspace:')) {
    console.error(
      `refusing to publish ${name}@${version}: tarball still contains "workspace:" references`,
    );
    return false;
  }
  return true;
};

const publishTarball = (tarballPath: string): boolean => {
  const publishArgs = [
    "publish",
    tarballPath,
    "--access",
    "public",
    "--workspaces=false",
  ];
  if (dryRun) {
    publishArgs.push("--dry-run");
  }
  const publish = spawnSync("npm", publishArgs, {
    cwd: repoRoot,
    stdio: "inherit",
  });
  return !publish.error && publish.status === 0;
};

const packAndPublish = (
  pkg: string,
  name: string,
  version: string,
): boolean => {
  const packageDir = resolve(repoRoot, "packages", pkg);
  const packDir = mkdtempSync(resolve(tmpdir(), "graphql-markdown-publish-"));
  const tarballName = `${name.replace(/^@/, "").replace("/", "-")}-${version}.tgz`;
  const tarballPath = resolve(packDir, tarballName);

  try {
    if (!packTarball(packageDir, tarballPath)) {
      console.error(`failed to pack ${name}@${version}`);
      return false;
    }
    if (!isTarballSafe(tarballPath, name, version)) {
      return false;
    }
    if (!publishTarball(tarballPath)) {
      console.error(`failed to publish ${name}@${version}`);
      return false;
    }
    return true;
  } finally {
    rmSync(packDir, { recursive: true, force: true });
  }
};

if (hasUncommittedChanges()) {
  console.warn(
    "Warning: the working tree has uncommitted changes. `bun pm pack` packs the tree as-is, not HEAD.",
  );
  if (shouldPrompt && !(await confirm("Continue anyway? (y/N) "))) {
    console.log("Aborted.");
    process.exit(0);
  }
}

const plan: PublishPlanEntry[] = await Promise.all(
  packages.map(async (pkg) => {
    const { name, version } = JSON.parse(
      readFileSync(resolve(repoRoot, "packages", pkg, "package.json"), "utf-8"),
    );
    return {
      pkg,
      name,
      version,
      alreadyPublished: await isPublished(name, version),
    };
  }),
);

console.log(`Publish plan${dryRun ? " (dry run)" : ""}:`);
for (const { name, version, alreadyPublished } of plan) {
  console.log(
    `  ${alreadyPublished ? "skip (already published)" : "publish"} ${name}@${version}`,
  );
}

const toPublish = plan.filter((entry) => {
  return !entry.alreadyPublished;
});

if (toPublish.length === 0) {
  console.log("Nothing to publish.");
  process.exit(0);
}

if (shouldPrompt && !(await confirm("Proceed with publishing? (y/N) "))) {
  console.log("Aborted.");
  process.exit(0);
}

let published = 0;
let failed = 0;

for (const { pkg, name, version } of toPublish) {
  console.log(`\n${dryRun ? "Dry-run publishing" : "Publishing"} ${name}@${version}`);
  if (packAndPublish(pkg, name, version)) {
    published++;
    continue;
  }
  failed++;
  console.error(
    `\nStopping: ${name}@${version} failed, and later packages in dependency order may depend on it.`,
  );
  break;
}

console.log(
  `\nSummary: ${published} published, ${plan.length - toPublish.length} skipped, ${failed > 0 ? failed : 0} failed`,
);

if (failed > 0) {
  process.exit(1);
}
