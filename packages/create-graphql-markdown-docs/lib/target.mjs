import fs from "node:fs";
import path from "node:path";

import { WIRE_FRAMEWORKS } from "./frameworks/index.mjs";
import { isRemoteSchemaSource } from "./schema.mjs";

/** Entries that do not make a folder a "project". */
const IGNORED_ENTRIES = [".git", ".DS_Store", "Thumbs.db"];

/** Flags that only make sense when creating a new project. */
const SCAFFOLD_ONLY_FLAGS = ["example", "title", "color", "no-git"];

/** Flags that only make sense when adding to an existing project. */
const WIRE_ONLY_FLAGS = [
  "formatter",
  "output",
  "link-root",
  "site-base",
  "script",
  "dry-run",
];

/**
 * Whether a folder is missing or holds nothing but ignorable entries.
 * @param {string} dir
 * @returns {boolean}
 */
export function isEffectivelyEmpty(dir) {
  if (!fs.existsSync(dir)) return true;
  return fs.readdirSync(dir).every((entry) => IGNORED_ENTRIES.includes(entry));
}

/**
 * Mode implied by the target folder.
 * @param {string} dir
 * @returns {"scaffold" | "wire"}
 */
export function modeFor(dir) {
  return isEffectivelyEmpty(dir) ? "scaffold" : "wire";
}

/**
 * Error message for a flag that does not apply to the resolved mode.
 * @param {object} args Parsed CLI arguments.
 * @param {"scaffold" | "wire"} mode
 * @param {string} dir
 * @returns {string | undefined}
 */
export function flagModeError(args, mode, dir) {
  if (mode === "wire") {
    const flag = SCAFFOLD_ONLY_FLAGS.find((name) => args[name] !== undefined);
    if (flag) {
      return `--${flag} only applies when creating a new project, but ${dir} is an existing project.`;
    }
    return undefined;
  }
  const flag = WIRE_ONLY_FLAGS.find((name) => args[name] !== undefined);
  if (flag) {
    return `--${flag} only applies when adding GraphQL-Markdown to an existing project, but ${dir} is empty.`;
  }
  return undefined;
}

/**
 * Ids of the wire frameworks whose dependencies appear in a package.json.
 * @param {object | null} packageJson
 * @returns {string[]}
 */
export function detectFrameworks(packageJson) {
  if (!packageJson) return [];
  const deps = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);
  return Object.entries(WIRE_FRAMEWORKS)
    .filter(([, fw]) => (fw.detect ?? []).some((name) => deps.has(name)))
    .map(([id]) => id);
}

/**
 * Schema reference as written in .graphqlrc: remote sources unchanged, local
 * paths made relative to the project directory.
 * @param {string} source
 * @param {string} projectDir
 * @param {string} [cwd]
 * @returns {string}
 */
export function toSchemaRef(source, projectDir, cwd = process.cwd()) {
  if (isRemoteSchemaSource(source)) return source;
  const relative = path
    .relative(projectDir, path.resolve(cwd, source))
    .split(path.sep)
    .join("/");
  return relative.startsWith("../") ? relative : `./${relative}`;
}
