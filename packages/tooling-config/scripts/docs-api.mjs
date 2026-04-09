// @ts-check

/**
 * Generate API markdown docs and post-process the output for Docusaurus.
 *
 * Pipeline:
 * 1) Run TypeDoc with the repository API options.
 * 2) Remove generated files that are not needed in nested sections.
 * 3) Normalize the root markdown entry to api/index.md.
 * 4) Add generated-index category metadata for nested folders.
 * 5) Flatten the @graphql-markdown workspace folder into api/.
 */

import { access, readdir, rename, rm, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { once } from "node:events";

const API_DIR = "./api";
const WORKSPACE = "@graphql-markdown";

const TYPEDOC_OPTIONS_PATH = fileURLToPath(
  import.meta.resolve("../typedoc/api.mjs"),
);

const GENERATED_FILES_DEPTH = 2;
const GENERATED_FILES_TO_REMOVE = ["generated.md", "modules.md"];

/** @typedef {{ type: "exit"; exitCode: number | null; signal: NodeJS.Signals | null }} SpawnExit */
/** @typedef {{ type: "error"; err: unknown }} SpawnError */
/** @typedef {SpawnExit | SpawnError} SpawnResult */

function asError(/** @type {unknown} */ err) {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
}

async function runStep(
  /** @type {string} */ name,
  /** @type {() => Promise<void>} */ action,
) {
  try {
    await action();
  } catch (err) {
    throw new Error(`${name} failed: ${asError(err).message}`);
  }
}

/** Run TypeDoc through Bun using the shared API configuration. */
async function generateTypeDoc() {
  const typedocArgs = [
    "x",
    "typedoc",
    "--options",
    TYPEDOC_OPTIONS_PATH,
    "--skipErrorChecking",
    "--logLevel",
    "Error",
    "--out",
    API_DIR,
  ];
  const typedoc = spawn("bun", typedocArgs, { stdio: "inherit" });

  /** @type {SpawnResult} */
  const result = await Promise.race([
    once(typedoc, "exit").then(
      ([exitCode, signal]) =>
        /** @type {SpawnExit} */ ({ type: "exit", exitCode, signal }),
    ),
    once(typedoc, "error").then(
      ([err]) => /** @type {SpawnError} */ ({ type: "error", err }),
    ),
  ]);

  if (result.type === "error") {
    throw new Error(
      `unable to spawn bun typedoc process: ${asError(result.err).message}`,
    );
  }

  if (result.exitCode !== 0 || result.signal !== null) {
    throw new Error(
      `bun x typedoc exited with code ${String(result.exitCode)}${result.signal ? ` and signal ${String(result.signal)}` : ""}`,
    );
  }
}

/**
 * Ensure the root markdown entry is api/index.md.
 * TypeDoc output may already produce index.md depending on plugin behavior.
 */
async function ensureRootIndexFile() {
  const generated = `${API_DIR}/generated.md`;
  const index = `${API_DIR}/index.md`;

  try {
    await access(generated);
    await rename(generated, index);
    return;
  } catch {
    // If generated.md does not exist, index.md may already be the root file.
  }

  await access(index).catch(() => {
    throw new Error("TypeDoc output missing both generated.md and index.md");
  });
}

/**
 * Delete generated helper pages from nested folders only.
 * Equivalent of: find api -mindepth 2 -type f \( -name generated.md -o -name modules.md \) -delete
 */
async function removeGeneratedFiles(
  /** @type {string} */ dir = API_DIR,
  /** @type {number} */ depth = 0,
) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeGeneratedFiles(fullPath, depth + 1);
      continue;
    }
    if (
      depth >= GENERATED_FILES_DEPTH &&
      GENERATED_FILES_TO_REMOVE.includes(entry.name)
    ) {
      await rm(fullPath, { force: true });
    }
  }
}

/** Create _category_.json files recursively up to maxDepth for generated indexes. */
async function createCategoryFiles(
  /** @type {string} */ dir,
  /** @type {number} */ depth,
  /** @type {number} */ maxDepth,
) {
  if (depth > maxDepth) return;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const fullPath = join(dir, entry.name);
    const prefix = depth === 1 ? `${WORKSPACE}/` : "";
    await writeFile(
      join(fullPath, "_category_.json"),
      JSON.stringify({
        label: `${prefix}${basename(fullPath)}`,
        link: { type: "generated-index" },
      }),
    );
    await createCategoryFiles(fullPath, depth + 1, maxDepth);
  }
}

async function writeAllCategoryFiles() {
  for (const entry of await readdir(API_DIR, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      await createCategoryFiles(join(API_DIR, entry.name), 1, 3);
    }
  }
}

async function flattenWorkspaceDirectory() {
  const workspaceDir = join(API_DIR, WORKSPACE);
  // Move generated package docs from api/@graphql-markdown/* to api/*.
  for (const entry of await readdir(workspaceDir)) {
    await rename(join(workspaceDir, entry), join(API_DIR, entry));
  }
  await rm(workspaceDir, { recursive: true });
}

async function main() {
  await runStep("typedoc generation", generateTypeDoc);
  await runStep("cleanup generated files", removeGeneratedFiles);
  await runStep("remove packages.md", async () =>
    rm(`${API_DIR}/packages.md`, { force: true }),
  );
  await runStep("normalize root index", ensureRootIndexFile);
  await runStep("create category files", writeAllCategoryFiles);
  await runStep("flatten workspace directory", flattenWorkspaceDirectory);
}

await main().catch((err) => {
  const message = asError(err).message;
  console.error(`[docs:api] ${message}`);
  process.exitCode = 1;
});
