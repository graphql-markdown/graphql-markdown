#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as process from "node:process";

// Parse arguments manually (simple approach without citty dependency)
const args = process.argv.slice(2);
const flags = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const key = args[i].substring(2);
    if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      flags[key] = args[i + 1];
      i++;
    } else {
      flags[key] = true;
    }
  }
}

// Normalize --yes to --force for compatibility
if (flags.yes) {
  flags.force = true;
}

// Import swizzle manifest
let swizzleManifest = [];

// Import manifest data at the top level
const manifestModule = await import("../swizzle.manifest.mjs");
swizzleManifest = manifestModule.swizzleManifest;

// Resolve the @graphql-markdown/nuxt-theme package from the script's location
function resolvePackagePath() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const packagePath = dirname(scriptDir);

  if (!existsSync(join(packagePath, "package.json"))) {
    throw new Error(
      `Could not find @graphql-markdown/nuxt-theme's package.json at ${packagePath} — this script's own location (bin/swizzle.mjs) should always be one level inside the package root. Is the package installation corrupted?`
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

  if (lines[0] && lines[0].includes("swizzled from @graphql-markdown/nuxt-theme@")) {
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
    const match = content.match(
      /(?:<!--\s*)?swizzled from @graphql-markdown\/nuxt-theme@([^\s]+)(?:\s*-->)?/
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Main CLI logic
async function main() {
  try {
    // Handle --list flag
    if (flags.list) {
      console.log(JSON.stringify(swizzleManifest, null, 2));
      process.exit(0);
    }

    // Handle --check flag
    if (flags.check) {
      const consumerCwd = process.cwd();
      const currentVersion = getPackageVersion();

      for (const entry of swizzleManifest) {
        const targetPath = join(consumerCwd, entry.targetPath);
        if (existsSync(targetPath)) {
          const stampedVersion = parseSwizzleStamp(targetPath);
          if (stampedVersion && stampedVersion !== currentVersion) {
            console.warn(
              `${entry.id} was swizzled from ${stampedVersion}, currently installed: ${currentVersion} — review upstream changes.`
            );
          }
        }
      }

      process.exit(0);
    }

    const packagePath = resolvePackagePath();
    const packageVersion = getPackageVersion();
    const consumerCwd = process.cwd();

    let selectedEntry = null;

    // Handle --component flag
    if (flags.component) {
      selectedEntry = swizzleManifest.find((e) => e.id === flags.component);
      if (!selectedEntry) {
        console.error(`Unknown component: ${flags.component}`);
        process.exit(1);
      }
    } else {
      // Interactive mode (requires @clack/prompts)
      try {
        const { select, isCancel } = await import("@clack/prompts");

        const choice = await select({
          message: "Which component would you like to swizzle?",
          options: swizzleManifest.map((entry) => ({
            value: entry.id,
            label: `${entry.id} — ${entry.description}`,
          })),
        });

        if (isCancel(choice)) {
          process.exit(0);
        }

        selectedEntry = swizzleManifest.find((e) => e.id === choice);
      } catch {
        console.error(
          "Interactive mode requires @clack/prompts to be installed"
        );
        process.exit(1);
      }
    }

    const sourcePath = join(packagePath, selectedEntry.sourcePath);
    const targetPath = join(consumerCwd, selectedEntry.targetPath);

    // Check if target exists
    if (existsSync(targetPath) && !flags.force && !flags.yes) {
      try {
        const { confirm, isCancel } = await import("@clack/prompts");
        const shouldOverwrite = await confirm({
          message: `${selectedEntry.id} already exists. Overwrite?`,
        });

        if (isCancel(shouldOverwrite) || !shouldOverwrite) {
          process.exit(0);
        }
      } catch {
        console.error("Unable to confirm overwrite");
        process.exit(1);
      }
    }

    // Copy the file
    copyFileWithStamp(sourcePath, targetPath, packageVersion);
    console.log(`✓ Swizzled ${selectedEntry.id} to ${targetPath}`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
