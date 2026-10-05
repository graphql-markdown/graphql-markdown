#!/usr/bin/env node

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  realpathSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";
import { swizzleManifest } from "../swizzle.manifest.mjs";

// Parse arguments manually (simple approach without citty dependency)
export function parseArgs(argv) {
  const flags = {};

  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) {
      continue;
    }
    const key = argv[i].substring(2);
    if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
      flags[key] = argv[i + 1];
      i++;
    } else {
      flags[key] = true;
    }
  }

  // Normalize --yes to --force for compatibility
  if (flags.yes) {
    flags.force = true;
  }

  return flags;
}

// Resolve the @graphql-markdown/nuxt-theme package from the script's location
function resolvePackagePath() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const packagePath = dirname(scriptDir);

  if (!existsSync(join(packagePath, "package.json"))) {
    throw new Error(
      `Could not find @graphql-markdown/nuxt-theme's package.json at ${packagePath} — this script's own location (bin/swizzle.mjs) should always be one level inside the package root. Is the package installation corrupted?`,
    );
  }

  return packagePath;
}

// Get version from package.json
function getPackageVersion() {
  try {
    const packageJsonPath = join(resolvePackagePath(), "package.json");
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    return pkg.version;
  } catch {
    return "unknown";
  }
}

// Get comment syntax for file type
function getCommentSyntax(filepath) {
  if (filepath.endsWith(".vue")) {
    return "<!-- ";
  }
  if (filepath.endsWith(".ts") || filepath.endsWith(".js")) {
    return "// ";
  }
  return "// ";
}

// Get comment close for file type
function getCommentClose(filepath) {
  if (filepath.endsWith(".vue")) {
    return " -->";
  }
  return "";
}

// Get version stamp comment
function getVersionStamp(filepath, version) {
  const start = getCommentSyntax(filepath);
  const close = getCommentClose(filepath);
  return `${start}swizzled from @graphql-markdown/nuxt-theme@${version}${close}`;
}

// Copy file with version stamp
function copyFileWithStamp(sourcePath, targetPath, version) {
  const sourceContent = readFileSync(sourcePath, "utf-8");
  const versionStamp = getVersionStamp(targetPath, version);

  // Check if file already starts with a swizzle stamp
  const lines = sourceContent.split("\n");
  let contentToWrite;

  if (lines[0]?.includes("swizzled from @graphql-markdown/nuxt-theme@")) {
    // Replace existing stamp
    contentToWrite = [versionStamp, ...lines.slice(1)].join("\n");
  } else {
    // Add new stamp
    contentToWrite = `${versionStamp}\n${sourceContent}`;
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, contentToWrite, "utf-8");
}

// Parse swizzle stamp from file
function parseSwizzleStamp(filepath) {
  try {
    const content = readFileSync(filepath, "utf-8");
    const match =
      /(?:<!--\s*)?swizzled from @graphql-markdown\/nuxt-theme@([^\s]+)(?:\s*-->)?/.exec(
        content,
      );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Warn about swizzled files whose stamp differs from the installed version
export function checkSwizzled(
  consumerCwd,
  currentVersion,
  manifest = swizzleManifest,
) {
  for (const entry of manifest) {
    const targetPath = join(consumerCwd, entry.targetPath);
    if (!existsSync(targetPath)) {
      continue;
    }
    const stampedVersion = parseSwizzleStamp(targetPath);
    if (stampedVersion && stampedVersion !== currentVersion) {
      console.warn(
        `${entry.id} was swizzled from ${stampedVersion}, currently installed: ${currentVersion} — review upstream changes.`,
      );
    }
  }
}

// Pick the manifest entry from --component. Returns an exit code on failure.
export function findComponent(id, manifest = swizzleManifest) {
  const entry = manifest.find((e) => e.id === id);
  if (!entry) {
    console.error(`Unknown component: ${id}`);
    return { exitCode: 1 };
  }
  return { entry };
}

// Pick the manifest entry interactively (requires @clack/prompts).
export async function promptComponent(manifest = swizzleManifest) {
  try {
    const { select, isCancel } = await import("@clack/prompts");

    const choice = await select({
      message: "Which component would you like to swizzle?",
      options: manifest.map((entry) => ({
        value: entry.id,
        label: `${entry.id} — ${entry.description}`,
      })),
    });

    if (isCancel(choice)) {
      return { exitCode: 0 };
    }

    return { entry: manifest.find((e) => e.id === choice) };
  } catch {
    console.error("Interactive mode requires @clack/prompts to be installed");
    return { exitCode: 1 };
  }
}

// Ask before overwriting an existing target. Returns an exit code to stop.
export async function confirmOverwrite(entry) {
  try {
    const { confirm, isCancel } = await import("@clack/prompts");
    const shouldOverwrite = await confirm({
      message: `${entry.id} already exists. Overwrite?`,
    });

    return isCancel(shouldOverwrite) || !shouldOverwrite ? 0 : undefined;
  } catch {
    console.error("Unable to confirm overwrite");
    return 1;
  }
}

// Run the CLI for the given flags. Returns the process exit code.
export async function run(flags, consumerCwd = process.cwd()) {
  if (flags.list) {
    console.log(JSON.stringify(swizzleManifest, null, 2));
    return 0;
  }

  if (flags.check) {
    checkSwizzled(consumerCwd, getPackageVersion());
    return 0;
  }

  const selection = flags.component
    ? findComponent(flags.component)
    : await promptComponent();
  if (!selection.entry) {
    return selection.exitCode;
  }
  const { entry } = selection;

  const targetPath = join(consumerCwd, entry.targetPath);

  if (existsSync(targetPath) && !flags.force) {
    const stop = await confirmOverwrite(entry);
    if (stop !== undefined) {
      return stop;
    }
  }

  copyFileWithStamp(
    join(resolvePackagePath(), entry.sourcePath),
    targetPath,
    getPackageVersion(),
  );
  console.log(`✓ Swizzled ${entry.id} to ${targetPath}`);
  return 0;
}

// Main CLI logic
export async function main(argv = process.argv.slice(2)) {
  try {
    process.exit(await run(parseArgs(argv)));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

// Only auto-run when executed directly (also through a bin symlink), not when imported
const isDirectRun =
  process.argv[1] &&
  realpathSync(process.argv[1]) ===
    realpathSync(fileURLToPath(import.meta.url));

if (isDirectRun) {
  try {
    await main();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}
