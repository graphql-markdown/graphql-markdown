#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import os from "node:os";
import { parseArgs } from "node:util";

import * as prompts from "@clack/prompts";
import { detect as detectPackageManager } from "package-manager-detector";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const templateDir = path.resolve(packageRoot, "template");

/**
 * Maps each package manager to its install command and arguments.
 * Each entry is [command, args] to be passed to spawn().
 */
const INSTALL_COMMANDS = {
  npm: ["npm", ["install"]],
  pnpm: ["pnpm", ["install"]],
  yarn: ["yarn", []],
  bun: ["bun", ["install"]],
};

/**
 * The official graphql-tools loaders (github.com/ardatan/graphql-tools/tree/
 * master/packages/loaders) that make sense as a schema *source* for
 * graphql-markdown — excludes loaders for things that aren't ever a whole
 * schema's source (e.g. `@graphql-tools/apollo-engine-loader` targets a
 * managed-federation registry, out of scope here).
 *
 * `version: 'latest'` deliberately, not a pinned range: a scaffolded project
 * runs `npm install` (or equivalent) immediately, once, right after this
 * file is written — there's no ongoing lockfile for this CLI to keep in sync
 * with graphql-tools' own release cadence, so pinning a version here would
 * just silently go stale the day graphql-tools cuts a release. Same
 * rationale most `create-*` scaffolding CLIs use for freshly-installed deps.
 *
 * `match` runs against the raw schema source string the user provided (a
 * path or a URL) to pick the loader graphql-markdown needs to actually read
 * it; order matters, first match wins.
 */
const LOADERS = [
  {
    id: "url",
    match: (source) => /^https?:\/\//i.test(source),
    className: "UrlLoader",
    package: "@graphql-tools/url-loader",
    version: "latest",
  },
  {
    id: "github",
    match: (source) => /^github:/i.test(source),
    className: "GithubLoader",
    package: "@graphql-tools/github-loader",
    version: "latest",
  },
  {
    id: "git",
    match: (source) => /^git:/i.test(source),
    className: "GitLoader",
    package: "@graphql-tools/git-loader",
    version: "latest",
  },
  {
    id: "json",
    match: (source) => /\.json$/i.test(source),
    className: "JsonFileLoader",
    package: "@graphql-tools/json-file-loader",
    version: "latest",
  },
  {
    id: "code",
    match: (source) => /\.(js|mjs|cjs|ts|mts|cts)$/i.test(source),
    className: "CodeFileLoader",
    package: "@graphql-tools/code-file-loader",
    version: "latest",
  },
  {
    // Default: a local .graphql/.gql SDL file. This is the loader
    // `createGenerateDocs` already defaults to internally, so scaffolds that
    // land here emit no explicit `loaders` option at all — one less thing
    // for the common case to carry, and no version to track either.
    id: "file",
    match: (source) => /\.(graphql|gql)$/i.test(source),
    className: "GraphQLFileLoader",
    package: "@graphql-tools/graphql-file-loader",
    isDefault: true,
  },
];

/** Picks the loader for a schema source string, falling back to the local-file loader. */
function detectLoader(schemaSource) {
  return (
    LOADERS.find((loader) => loader.match(schemaSource)) ??
    LOADERS.find((l) => l.isDefault)
  );
}

/** A schema "path" that's actually a remote/VCS reference, not a local file to copy. */
function isRemoteSchemaSource(source) {
  return /^(https?|git|github):/i.test(source);
}

/**
 * Copy a directory recursively, excluding certain patterns.
 */
function copyDirRecursive(src, dst, excludePatterns = []) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true });
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    // Skip excluded patterns
    if (excludePatterns.some((pattern) => file.match(pattern))) {
      continue;
    }

    const srcPath = path.join(src, file);
    const dstPath = path.join(dst, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, dstPath, excludePatterns);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

/**
 * Validate a GraphQL schema file by attempting to parse it with buildSchema.
 */
async function validateGraphQLSchema(schemaPath) {
  try {
    const fs = await import("node:fs/promises");
    const schemaText = await fs.readFile(schemaPath, "utf-8");

    // Use graphql's buildSchema to validate
    const { buildSchema } = await import("graphql");
    buildSchema(schemaText);
    return true;
  } catch {
    return false;
  }
}

/**
 * Run a command in a shell.
 */
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    proc.on("error", reject);
  });
}

/**
 * Install dependencies for a project using the specified package manager.
 * Logs info, runs the install command, logs success, and catches+logs errors.
 */
async function installDependencies(packageManager, projectDir) {
  prompts.log.info(`Installing dependencies with ${packageManager}...`);
  try {
    const [command, args] =
      INSTALL_COMMANDS[packageManager] ?? INSTALL_COMMANDS.npm;
    await runCommand(command, args, { cwd: projectDir });
    prompts.success("Dependencies installed!");
  } catch (error) {
    prompts.log.error(`Failed to install dependencies: ${error.message}`);
  }
}

/**
 * Initialize a git repository in the project directory.
 * Runs git init, git add, and git commit with an initial commit message.
 * Logs success and catches+logs errors.
 */
async function initGitRepo(projectDir) {
  try {
    await runCommand("git", ["init"], { cwd: projectDir });
    await runCommand("git", ["add", "."], { cwd: projectDir });
    await runCommand("git", ["commit", "-m", "Initial commit"], {
      cwd: projectDir,
    });
    prompts.success("Git repository initialized!");
  } catch (error) {
    prompts.log.warn(`Could not initialize git: ${error.message}`);
  }
}

/**
 * Rewrite app.config.ts with custom title and/or color overrides.
 */
function writeAppConfig(tempDir, titleOverride, colorOverride) {
  if (!titleOverride && !colorOverride) {
    return; // No changes needed
  }

  const appConfigPath = path.join(tempDir, "app", "app.config.ts");
  let appConfig = fs.readFileSync(appConfigPath, "utf-8");
  const originalContent = appConfig;

  if (titleOverride) {
    appConfig = appConfig.replace(
      /siteTitle: 'My API'/,
      `siteTitle: '${titleOverride}'`,
    );
    if (appConfig === originalContent) {
      throw new Error(
        `Expected to find and replace "siteTitle: 'My API'" in ${appConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  if (colorOverride) {
    // The template ships no `ui.colors` block at all (the layer's own
    // violet/zinc defaults apply via `extends` until overridden) — add
    // one rather than trying to replace a value that isn't there.
    const beforeColorOverride = appConfig;
    appConfig = appConfig.replace(
      "export default defineAppConfig({",
      `export default defineAppConfig({\n  ui: {\n    colors: {\n      primary: '${colorOverride}',\n    },\n  },`,
    );
    if (appConfig === beforeColorOverride) {
      throw new Error(
        `Expected to find and replace "export default defineAppConfig({" in ${appConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  fs.writeFileSync(appConfigPath, appConfig);
}

/**
 * Rewrite generate-docs.ts to use the resolved schema path and loader.
 */
function writeGenerateDocs(tempDir, schemaRef, loader) {
  const generateDocsPath = path.join(tempDir, "generate-docs.ts");
  const originalContent = fs.readFileSync(generateDocsPath, "utf-8");

  // The default (bundled example, GraphQLFileLoader) needs no `loaders` option
  // at all — createGenerateDocs already defaults to it — so only inject
  // one when the detected loader differs.
  const replacement = loader.isDefault
    ? `  schema: '${schemaRef}',`
    : `  schema: '${schemaRef}',\n  loaders: { ${loader.className}: '${loader.package}' },`;

  const updated = originalContent.replace(
    "  schema: './schema/example.graphql',",
    replacement,
  );

  // Only validate the replacement if we expected a change (i.e., the replacement differs from the original pattern).
  if (
    replacement !== "  schema: './schema/example.graphql'," &&
    updated === originalContent
  ) {
    throw new Error(
      `Expected to find and replace "  schema: './schema/example.graphql'," in ${generateDocsPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  fs.writeFileSync(generateDocsPath, updated);
}

/**
 * Rewrite nuxt.config.ts's `watch` entry and/or schema filename to match the resolved schema.
 */
function writeNuxtConfig(tempDir, schemaRef, isRemoteSource) {
  const nuxtConfigPath = path.join(tempDir, "nuxt.config.ts");
  const originalContent = fs.readFileSync(nuxtConfigPath, "utf-8");

  let updated = originalContent;

  if (isRemoteSource) {
    // A remote schema source (URL/git/github) has no local file to watch at all —
    // dev-server restarts on schema change simply aren't available for those,
    // so the entry is dropped rather than left pointing at a path that no longer
    // means anything.
    const beforeWatchRemoval = updated;
    updated = updated.replace(
      /\s*\/\/ The layer's gqlmd-generate module[\s\S]*?\n\s*watch: \[[^\]]*\],\n/,
      "\n",
    );

    if (updated === beforeWatchRemoval) {
      throw new Error(
        `Expected to find and replace the watch block in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }

    const beforeImportRemoval = updated;
    updated = updated.replace(
      'import { fileURLToPath } from "node:url";\n\n',
      "",
    );

    if (updated === beforeImportRemoval) {
      throw new Error(
        `Expected to find and replace the fileURLToPath import in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  } else {
    // Local schema: replace the example filename with the actual one.
    // Only validate if we expect a change (schemaRef differs from the default).
    const beforeSchemaReplace = updated;
    updated = updated.replace("./schema/example.graphql", schemaRef);

    if (
      schemaRef !== "./schema/example.graphql" &&
      updated === beforeSchemaReplace
    ) {
      throw new Error(
        `Expected to find and replace "./schema/example.graphql" in ${nuxtConfigPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  fs.writeFileSync(nuxtConfigPath, updated);
}

/**
 * Rewrite package.json to set the project name and add non-default loaders as dependencies.
 */
function writePackageJson(tempDir, projectDir, loader) {
  const pkgJsonPath = path.join(tempDir, "package.json");
  let pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
  const projectName = path.basename(projectDir);
  pkgJson.name = projectName;
  if (!loader.isDefault) {
    pkgJson.dependencies[loader.package] = loader.version;
  }
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2) + "\n");
}

/**
 * Rewrite README.md's schema section to document the actual schema source.
 */
function writeReadme(tempDir, schemaPath, schemaRef, loader) {
  if (!schemaPath) {
    return; // No custom schema, keep the template's instructions
  }

  const readmePath = path.join(tempDir, "README.md");
  const originalContent = fs.readFileSync(readmePath, "utf-8");
  const schemaSectionRe = /### Your GraphQL Schema\n\n[\s\S]*?(?=\n### |\n## )/;

  const isRemoteSource = /^(https?|git|github):/i.test(schemaRef);
  const replacement = isRemoteSource
    ? `### Your GraphQL Schema\n\nThis project reads its schema from \`${schemaRef}\` via ${loader.package} (${loader.className}) — configured in \`generate-docs.ts\`. There is no local schema file to edit; point \`generate-docs.ts\`'s \`schema\` option at a different source to change it.\n`
    : `### Your GraphQL Schema\n\nYour schema lives at \`${schemaRef}\`. To point at a different file, update both \`generate-docs.ts\`'s \`schema\` option and \`nuxt.config.ts\`'s \`watch\` entry.\n`;

  const updated = originalContent.replace(schemaSectionRe, replacement);

  if (updated === originalContent) {
    throw new Error(
      `Expected to find and replace the schema section in ${readmePath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  fs.writeFileSync(readmePath, updated);
}

async function main() {
  prompts.intro(`✨ Welcome to GraphQL Markdown Docs`);

  // ============================================================================
  // PHASE 1: Parse command-line arguments
  // ============================================================================
  const { values: args } = parseArgs({
    args: process.argv.slice(2),
    options: {
      dir: { type: "string", short: "d" },
      schema: { type: "string" },
      example: { type: "boolean" },
      pm: { type: "string" },
      title: { type: "string" },
      color: { type: "string" },
      "no-install": { type: "boolean" },
      "no-git": { type: "boolean" },
      yes: { type: "boolean" },
    },
    allowPositionals: false,
  });

  let projectDir = args.dir;
  let schemaPath = args.schema;
  const useExample = args.example || !schemaPath;
  let packageManager = args.pm;
  const siteTitle = args.title;
  const primaryColor = args.color;
  const noInstall = args["no-install"];
  const noGit = args["no-git"];
  const isYes = args.yes;

  // Create a temporary directory for scaffolding
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-"));

  try {
    // =========================================================================
    // PHASE 2: Gather decisions through prompts (project dir, schema, pm, title/color)
    // =========================================================================

    // Step 2.1: Project directory
    if (!projectDir) {
      if (isYes) {
        projectDir = "./my-graphql-docs";
      } else {
        projectDir = await prompts.text({
          message: "Where should we create your project?",
          defaultValue: "./my-graphql-docs",
          validate: (value) => {
            if (!value || value.trim() === "") {
              return "Project directory cannot be empty";
            }
            return;
          },
        });
      }
    }

    if (prompts.isCancel(projectDir)) {
      prompts.cancel("Setup cancelled.");
      process.exit(1);
    }

    projectDir = path.resolve(projectDir);

    // Refuse a non-empty target outright — never overwrite existing files,
    // in interactive mode or --yes. There is no confirm-to-overwrite path:
    // the scaffold later does an unconditional `rmSync(projectDir, {
    // recursive: true })` before writing, so "confirm then proceed" would
    // still mean deleting whatever was there first. If you want to scaffold
    // into that directory, empty or remove it yourself first.
    if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0) {
      prompts.log.error(
        `${projectDir} already exists and is not empty — refusing to overwrite it.`,
      );
      process.exit(1);
    }

    // Step 2.2: Schema choice and validation
    if (!useExample && !schemaPath) {
      if (isYes) {
        schemaPath = null;
      } else {
        const schemaChoice = await prompts.select({
          message: "How would you like to provide your GraphQL schema?",
          options: [
            {
              value: "example",
              label: "Use example schema (recommended for first-time)",
            },
            { value: "existing", label: "Use an existing schema file" },
          ],
        });

        if (prompts.isCancel(schemaChoice)) {
          prompts.cancel("Setup cancelled.");
          process.exit(1);
        }

        if (schemaChoice === "existing") {
          schemaPath = await prompts.text({
            message:
              "Path or URL to your GraphQL schema (local file, introspection endpoint, git:/github: ref):",
            validate: (value) => {
              if (!value) return "Schema source is required";
              if (!isRemoteSchemaSource(value) && !fs.existsSync(value)) {
                return "Schema file not found";
              }
              return;
            },
          });

          if (prompts.isCancel(schemaPath)) {
            prompts.cancel("Setup cancelled.");
            process.exit(1);
          }
        }
      }
    }

    // Validate a local schema file's syntax (skipped for remote sources —
    // fetching one just to lint it isn't worth the network round trip here;
    // `nuxi generate` will surface a real error if it's actually invalid).
    if (schemaPath && !isRemoteSchemaSource(schemaPath)) {
      const isValid = await validateGraphQLSchema(schemaPath);
      if (!isValid) {
        prompts.log.warn(
          `${schemaPath} did not parse as a valid GraphQL schema — continuing anyway, but double-check it.`,
        );
      }
    }

    // Every schema source needs the matching graphql-tools loader
    // (github.com/ardatan/graphql-tools/tree/master/packages/loaders) —
    // detect it from the source and report the choice; `--yes` and
    // interactive runs both get this, there's no meaningful "which loader"
    // question to ask separately, it's implied by the source itself.
    const loader = detectLoader(schemaPath ?? "schema/example.graphql");
    if (schemaPath && !loader.isDefault) {
      prompts.log.info(
        `Detected schema source needs ${loader.package} (${loader.className}) — adding it as a dependency.`,
      );
    }

    // Step 2.3: Package manager detection
    if (!packageManager) {
      const detected = await detectPackageManager({ cwd: process.cwd() });
      if (detected && detected.name) {
        packageManager = detected.name;
      } else {
        if (isYes) {
          packageManager = "npm";
        } else {
          packageManager = await prompts.select({
            message: "Which package manager would you like to use?",
            options: [
              { value: "npm", label: "npm" },
              { value: "pnpm", label: "pnpm" },
              { value: "yarn", label: "yarn" },
              { value: "bun", label: "bun" },
            ],
          });

          if (prompts.isCancel(packageManager)) {
            prompts.cancel("Setup cancelled.");
            process.exit(1);
          }
        }
      }
    }

    // Step 2.4: Optional title and color customization
    let titleOverride = "";
    let colorOverride = primaryColor ?? "";
    if (!isYes) {
      const customizeTheme = await prompts.confirm({
        message: "Would you like to customize the site title and appearance?",
        initialValue: false,
      });

      if (!prompts.isCancel(customizeTheme) && customizeTheme) {
        const customTitle = await prompts.text({
          message: "Site title:",
          defaultValue: "My API",
        });
        if (!prompts.isCancel(customTitle) && customTitle) {
          titleOverride = customTitle;
        }

        if (!colorOverride) {
          const customColor = await prompts.text({
            message:
              "Primary color (any Nuxt UI / Tailwind color name, e.g. violet, blue, emerald):",
          });
          if (!prompts.isCancel(customColor) && customColor) {
            colorOverride = customColor;
          }
        }
      }
    } else if (siteTitle) {
      titleOverride = siteTitle;
    }

    // =========================================================================
    // PHASE 3: Apply template transformations
    // =========================================================================

    // Copy template to temp directory
    copyDirRecursive(templateDir, tempDir, [
      /^node_modules$/,
      /^\.nuxt$/,
      /^\.output$/,
    ]);

    // Step 3.1: Rewrite app.config.ts with title/color overrides
    writeAppConfig(tempDir, titleOverride, colorOverride);

    // Step 3.2: Resolve the schema reference and copy local schema if needed
    let schemaRef = "./schema/example.graphql";
    const templateExamplePath = path.join(tempDir, "schema", "example.graphql");
    if (schemaPath && isRemoteSchemaSource(schemaPath)) {
      // Nothing to copy — the bundled example is unused, drop it so it
      // doesn't sit there implying it's still what gets generated.
      fs.rmSync(templateExamplePath, { force: true });
      schemaRef = schemaPath;
    } else if (schemaPath) {
      const destName = `schema${path.extname(schemaPath) || ".graphql"}`;
      const destSchema = path.join(tempDir, "schema", destName);
      if (destSchema !== templateExamplePath) {
        fs.rmSync(templateExamplePath, { force: true });
      }
      fs.copyFileSync(schemaPath, destSchema);
      schemaRef = `./schema/${destName}`;
    }

    // Step 3.3: Rewrite generate-docs.ts for the schema and loader
    writeGenerateDocs(tempDir, schemaRef, loader);

    // Step 3.4: Rewrite nuxt.config.ts for the schema
    writeNuxtConfig(tempDir, schemaRef, isRemoteSchemaSource(schemaRef));

    // Step 3.5: Rewrite package.json with project name and loader dependency
    writePackageJson(tempDir, projectDir, loader);

    // Step 3.6: Rewrite README.md's schema section
    writeReadme(tempDir, schemaPath, schemaRef, loader);

    // =========================================================================
    // PHASE 4: Move into place, install dependencies, init git, print summary
    // =========================================================================

    // Move from temp to target directory
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
    fs.renameSync(tempDir, projectDir);

    prompts.log.success("Project created successfully!");

    // Step 4.1: Install dependencies (unless --no-install)
    if (!noInstall) {
      if (!isYes) {
        const shouldInstall = await prompts.confirm({
          message: "Install dependencies now?",
          initialValue: true,
        });

        if (!prompts.isCancel(shouldInstall) && shouldInstall) {
          await installDependencies(packageManager, projectDir);
        }
      } else {
        await installDependencies(packageManager, projectDir);
      }
    }

    // Step 4.2: Initialize git repo (unless --no-git)
    if (!noGit) {
      if (!isYes) {
        const shouldGit = await prompts.confirm({
          message: "Initialize a git repository?",
          initialValue: true,
        });

        if (!prompts.isCancel(shouldGit) && shouldGit) {
          await initGitRepo(projectDir);
        }
      } else {
        await initGitRepo(projectDir);
      }
    }

    // Step 4.3: Final summary
    prompts.outro(`
Next steps:
  1. cd ${projectDir}
  2. ${packageManager} run dev

Documentation: https://graphql-markdown.dev
    `);
  } finally {
    // Clean up temp directory if it still exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

main().catch((error) => {
  prompts.log.error(error.message);
  process.exit(1);
});
