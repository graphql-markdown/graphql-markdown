import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FRAMEWORKS } from "./frameworks/index.mjs";
import {
  EXAMPLE_SCHEMA_REF,
  detectLoader,
  isRemoteSchemaSource,
} from "./schema.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const packageRoot = path.resolve(__dirname, "..");
const templatesRoot = path.resolve(packageRoot, "templates");

/** Directory name used when the user gives none (empty prompt or --yes). */
export const DEFAULT_PROJECT_DIR = "my-graphql-docs";

/**
 * Copy a directory recursively, excluding entries whose name matches any pattern.
 */
export function copyDirRecursive(src, dst, excludePatterns = []) {
  fs.cpSync(src, dst, {
    recursive: true,
    filter: (source) => {
      // The root itself is always copied; patterns apply to entry names.
      if (source === src) return true;
      const name = path.basename(source);
      return !excludePatterns.some((pattern) => pattern.test(name));
    },
  });
}

/**
 * Derive a valid npm package name from a directory path (lowercase, no
 * spaces or special characters, no leading dot/underscore/dash).
 */
export function toPackageName(dir) {
  let name = path
    .basename(dir)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^[._-]+/, "");
  let end = name.length;
  while (end > 0 && name[end - 1] === "-") end--;
  name = name.slice(0, end);
  return name || DEFAULT_PROJECT_DIR;
}

/**
 * Rewrite package.json to set the project name and add non-default loaders as dependencies.
 */
export function writePackageJson(tempDir, projectDir, loader) {
  const pkgJsonPath = path.join(tempDir, "package.json");
  let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  pkgJson.name = toPackageName(projectDir);
  if (!loader.isDefault) {
    pkgJson.dependencies[loader.package] = loader.version;
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
}

/**
 * Copies a local SDL/JSON schema into the scaffold. Remote sources and local
 * code-first schemas are referenced in place (code files may import siblings,
 * so they must not be copied). Drops the bundled example in both cases.
 */
export function placeSchema(tempDir, projectDir, schemaPath) {
  const templateExamplePath = path.join(tempDir, EXAMPLE_SCHEMA_REF);
  if (!schemaPath) return EXAMPLE_SCHEMA_REF;

  const isCodeSchema = detectLoader(schemaPath).id === "code";
  if (isRemoteSchemaSource(schemaPath) || isCodeSchema) {
    // Nothing to copy — the bundled example is unused, drop it so it
    // doesn't sit there implying it's still what gets generated.
    fs.rmSync(templateExamplePath, { force: true });
    if (isRemoteSchemaSource(schemaPath)) {
      return schemaPath;
    }
    const relative = path.relative(projectDir, path.resolve(schemaPath));
    // Another drive on Windows yields an absolute path: use it as-is.
    if (path.isAbsolute(relative)) return relative.split(path.sep).join("/");
    const relativePath = relative.split(path.sep).join("/");
    return relativePath.startsWith("../") ? relativePath : `./${relativePath}`;
  }

  const destName = `schema${path.extname(schemaPath) || ".graphql"}`;
  const destSchema = path.join(tempDir, "schema", destName);
  if (destSchema !== templateExamplePath) {
    fs.rmSync(templateExamplePath, { force: true });
  }
  fs.copyFileSync(schemaPath, destSchema);
  return `./schema/${destName}`;
}

/** Phase 3: copy the template and apply all rewrites. */
export function applyTemplate(tempDir, ctx) {
  const { framework, projectDir, schemaPath, loader, title, color } = ctx;
  const fw = FRAMEWORKS[framework];

  copyDirRecursive(path.join(templatesRoot, framework), tempDir, [
    /^node_modules$/,
    ...fw.copyExcludes,
  ]);

  // npm strips `.gitignore` from published tarballs, so templates ship it as
  // `gitignore` and it is renamed back here.
  const gitignore = path.join(tempDir, "gitignore");
  if (fs.existsSync(gitignore)) {
    fs.renameSync(gitignore, path.join(tempDir, ".gitignore"));
  }

  const schemaRef = placeSchema(tempDir, projectDir, schemaPath);

  fw.apply(tempDir, { schemaRef, schemaPath, loader, title, color });

  writePackageJson(tempDir, projectDir, loader);
}

export function moveIntoPlace(tempDir, projectDir) {
  if (fs.existsSync(projectDir)) {
    // Existing (empty) target, possibly the cwd: copy into it rather than
    // replacing it, so the directory itself (and its inode) is preserved.
    fs.cpSync(tempDir, projectDir, { recursive: true });
    fs.rmSync(tempDir, { recursive: true, force: true });
    return;
  }
  try {
    fs.renameSync(tempDir, projectDir);
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    // temp dir is on another filesystem; the caller removes it afterwards
    fs.cpSync(tempDir, projectDir, { recursive: true });
  }
}
