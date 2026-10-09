import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import os from "node:os";
import { parseArgs } from "node:util";

import * as prompts from "@clack/prompts";
import {
  detect as detectPackageManager,
  getUserAgent,
} from "package-manager-detector";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const templatesRoot = path.resolve(packageRoot, "templates");

/** Supported scaffold targets; each maps to `templates/<framework>`. */
const FRAMEWORKS = ["nuxt", "docusaurus"];

/** Directory name used when the user gives none (empty prompt or --yes). */
const DEFAULT_PROJECT_DIR = "my-graphql-docs";

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
export function detectLoader(schemaSource) {
  return (
    LOADERS.find((loader) => loader.match(schemaSource)) ??
    LOADERS.find((l) => l.isDefault)
  );
}

/** A schema "path" that's actually a remote/VCS reference, not a local file to copy. */
export function isRemoteSchemaSource(source) {
  return /^(https?|git|github):/i.test(source);
}

/**
 * Copy a directory recursively, excluding certain patterns.
 */
export function copyDirRecursive(src, dst, excludePatterns = []) {
  if (!fs.existsSync(dst)) {
    fs.mkdirSync(dst, { recursive: true });
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    // Skip excluded patterns
    if (excludePatterns.some((pattern) => pattern.exec(file))) {
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
export async function validateGraphQLSchema(schemaPath) {
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
export function runCommand(command, args, options = {}) {
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
    proc.on("error", (err) => {
      reject(
        err?.code === "ENOENT"
          ? new Error(`${command} is not installed or not on your PATH`)
          : err,
      );
    });
  });
}

/** Whether `git` is installed and runnable. */
export async function isGitAvailable() {
  return runCommand("git", ["--version"], { stdio: "ignore" }).then(
    () => true,
    () => false,
  );
}

/**
 * Install dependencies for a project using the specified package manager.
 * Logs info, runs the install command, logs success, and catches+logs errors.
 * Resolves to whether the install succeeded.
 */
export async function installDependencies(packageManager, projectDir) {
  prompts.log.info(`Installing dependencies with ${packageManager}...`);
  try {
    const [command, args] =
      INSTALL_COMMANDS[packageManager] ?? INSTALL_COMMANDS.npm;
    await runCommand(command, args, { cwd: projectDir });
    prompts.log.success("Dependencies installed!");
    return true;
  } catch (error) {
    prompts.log.error(`Failed to install dependencies: ${error.message}`);
    return false;
  }
}

/**
 * Initialize a git repository in the project directory.
 * Skips when already inside a git work tree (no nested repos); otherwise runs
 * git init, git add, and git commit with an initial commit message.
 * Logs success and catches+logs errors.
 */
export async function initGitRepo(projectDir) {
  // Git output is silenced (stdio "ignore") so it doesn't garble the prompt UI.
  const options = { cwd: projectDir, stdio: "ignore" };

  // A nested repo inside an existing one is almost never wanted.
  const insideRepo = await runCommand(
    "git",
    ["rev-parse", "--is-inside-work-tree"],
    options,
  ).then(
    () => true,
    () => false,
  );
  if (insideRepo) {
    prompts.log.info("Already inside a git repository — skipping git init.");
    return;
  }

  const spinner = prompts.spinner();
  spinner.start("Initializing git repository...");
  try {
    await runCommand("git", ["init"], options);
    await runCommand("git", ["add", "."], options);
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    prompts.log.warn(`Could not initialize git: ${error.message}`);
    return;
  }
  try {
    await runCommand("git", ["commit", "-m", "Initial commit"], options);
    spinner.stop("Git repository initialized!");
  } catch (error) {
    spinner.stop("Git initialization incomplete.");
    prompts.log.warn(
      `Could not initialize git: ${error.message} (the commit can fail when git user.name / user.email are not configured).`,
    );
  }
}

/**
 * Rewrite app.config.ts with custom title and/or color overrides.
 */
export function writeAppConfig(tempDir, titleOverride, colorOverride) {
  if (!titleOverride && !colorOverride) {
    return; // No changes needed
  }

  const appConfigPath = path.join(tempDir, "app", "app.config.ts");
  let appConfig = fs.readFileSync(appConfigPath, "utf-8");
  const originalContent = appConfig;

  if (titleOverride) {
    appConfig = appConfig.replace(
      /siteTitle: 'My API'/,
      () => `siteTitle: ${JSON.stringify(titleOverride)}`,
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
      () =>
        `export default defineAppConfig({\n  ui: {\n    colors: {\n      primary: ${JSON.stringify(colorOverride)},\n    },\n  },`,
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
export function writeGenerateDocs(tempDir, schemaRef, loader) {
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
 * Removes the layer's `watch: [...]` block (and its leading comment) using
 * linear string scanning, replacing it with a single newline. Returns the
 * input unchanged when the block isn't found.
 */
export function removeWatchBlock(content) {
  const marker = "// The layer's gqlmd-generate module";
  const markerIdx = content.indexOf(marker);
  if (markerIdx === -1) return content;
  const watchIdx = content.indexOf("watch: [", markerIdx);
  if (watchIdx === -1) return content;
  const lineStart = content.lastIndexOf("\n", watchIdx);
  if (lineStart < markerIdx || content.slice(lineStart + 1, watchIdx).trim()) {
    return content;
  }
  const closeIdx = content.indexOf("]", watchIdx);
  if (closeIdx === -1 || !content.startsWith(",\n", closeIdx + 1)) {
    return content;
  }
  let start = markerIdx;
  while (start > 0 && /\s/.test(content[start - 1])) start--;
  return `${content.slice(0, start)}\n${content.slice(closeIdx + 3)}`;
}

/**
 * Rewrite nuxt.config.ts's `watch` entry and/or schema filename to match the resolved schema.
 */
export function writeNuxtConfig(tempDir, schemaRef, isRemoteSource) {
  const nuxtConfigPath = path.join(tempDir, "nuxt.config.ts");
  const originalContent = fs.readFileSync(nuxtConfigPath, "utf-8");

  let updated = originalContent;

  if (isRemoteSource) {
    // A remote schema source (URL/git/github) has no local file to watch at all —
    // dev-server restarts on schema change simply aren't available for those,
    // so the entry is dropped rather than left pointing at a path that no longer
    // means anything.
    const beforeWatchRemoval = updated;
    updated = removeWatchBlock(updated);

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
 * Rewrite the Docusaurus template's .graphqlrc `schema` line and loader entry.
 */
export function writeGraphqlrc(tempDir, schemaRef, loader) {
  const graphqlrcPath = path.join(tempDir, ".graphqlrc");
  const originalContent = fs.readFileSync(graphqlrcPath, "utf-8");

  const defaultSchemaLine = "schema: './schema/example.graphql'";
  const defaultLoaderLine =
    "      GraphQLFileLoader: '@graphql-tools/graphql-file-loader'";

  let updated = originalContent.replace(
    defaultSchemaLine,
    () => `schema: '${schemaRef}'`,
  );

  if (schemaRef !== "./schema/example.graphql" && updated === originalContent) {
    throw new Error(
      `Expected to find and replace "${defaultSchemaLine}" in ${graphqlrcPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  if (!loader.isDefault) {
    // URL sources are introspected with POST, as in the original template.
    const loaderEntry =
      loader.id === "url"
        ? `      ${loader.className}:\n        module: '${loader.package}'\n        options:\n          method: 'POST'`
        : `      ${loader.className}: '${loader.package}'`;
    const beforeLoader = updated;
    updated = updated.replace(defaultLoaderLine, () => loaderEntry);

    if (updated === beforeLoader) {
      throw new Error(
        `Expected to find and replace "${defaultLoaderLine.trim()}" in ${graphqlrcPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }
  }

  fs.writeFileSync(graphqlrcPath, updated);
}

/**
 * Rewrite the Docusaurus template's docusaurus.config.js site title.
 */
export function writeDocusaurusConfig(tempDir, titleOverride) {
  if (!titleOverride) {
    return; // No changes needed
  }

  const configPath = path.join(tempDir, "docusaurus.config.js");
  const originalContent = fs.readFileSync(configPath, "utf-8");
  const searchString = 'title: "My API",';

  // A replacement identical to the original (e.g. the title is already
  // "My API") is fine; only a missing search string means template drift.
  if (!originalContent.includes(searchString)) {
    throw new Error(
      `Expected to find and replace 'title: "My API",' in ${configPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  const updated = originalContent.replace(
    searchString,
    () => `title: ${JSON.stringify(titleOverride)},`,
  );

  fs.writeFileSync(configPath, updated);
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
 * Rewrite README.md's schema section to document the actual schema source.
 */
export function writeReadme(tempDir, schemaPath, schemaRef, loader) {
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

/** Thrown to abort the scaffold with an exit code; the message was already logged. */
class CliExit extends Error {
  constructor(code = 1) {
    super("cli-exit");
    this.code = code;
  }
}

/** Abort the run when a prompt was cancelled; otherwise return its value. */
function unlessCancelled(value) {
  if (prompts.isCancel(value)) {
    prompts.cancel("Setup cancelled.");
    throw new CliExit(1);
  }
  return value;
}

/** Log an error and abort the run. */
function fail(message) {
  prompts.log.error(message);
  throw new CliExit(1);
}

const HELP_TEXT = `Usage: create-graphql-markdown-docs [dir] [options]

Options:
  --framework <name>   Site framework: nuxt | docusaurus (default: nuxt)
  -d, --dir <path>     Directory to create the project in (or pass it as [dir])
  --schema <source>    Schema source: <path|url|git:|github:> (default: bundled example)
  --example            Use the bundled example schema
  --pm <name>          Package manager: npm | pnpm | yarn | bun
  --title <text>       Site title
  --color <name>       Primary color (Nuxt only)
  --no-install         Skip installing dependencies
  --no-git             Skip git repository initialization
  -y, --yes            Accept defaults and skip all prompts
  -h, --help           Show this help
  -v, --version        Show the version
`;

/** Reads this package's version from its package.json. */
function readVersion() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageRoot, "package.json"), "utf-8"),
  );
  return pkg.version;
}

/** Phase 1: parse command-line arguments. */
export function parseCliArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      framework: { type: "string" },
      dir: { type: "string", short: "d" },
      schema: { type: "string" },
      example: { type: "boolean" },
      pm: { type: "string" },
      title: { type: "string" },
      color: { type: "string" },
      "no-install": { type: "boolean" },
      "no-git": { type: "boolean" },
      yes: { type: "boolean", short: "y" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
    },
    allowPositionals: true,
  });
  return { ...values, dir: values.dir ?? positionals[0], positionals };
}

/** Fails on an unsupported --pm value. */
function validatePackageManager(args) {
  if (args.pm && !Object.hasOwn(INSTALL_COMMANDS, args.pm)) {
    fail(
      `Invalid --pm "${args.pm}" — expected one of: ${Object.keys(INSTALL_COMMANDS).join(", ")}.`,
    );
  }
}

async function resolveFramework(args) {
  if (args.framework) {
    if (!FRAMEWORKS.includes(args.framework)) {
      fail(
        `Invalid --framework "${args.framework}" — expected one of: ${FRAMEWORKS.join(", ")}.`,
      );
    }
    return args.framework;
  }
  if (args.yes) return "nuxt";
  return unlessCancelled(
    await prompts.select({
      message: "Which framework would you like to use?",
      options: [
        {
          value: "nuxt",
          label: "Nuxt (@graphql-markdown/nuxt-theme)",
          hint: "Nuxt UI theme, live reload on schema changes",
        },
        {
          value: "docusaurus",
          label: "Docusaurus",
          hint: "React + MDX, classic docs site",
        },
      ],
    }),
  );
}

/** Prompt validator: empty input means the default; the target must be free. */
export function validateProjectDir(value) {
  const target = path.resolve(value?.trim() || DEFAULT_PROJECT_DIR);
  if (fs.existsSync(target)) {
    if (!fs.statSync(target).isDirectory()) {
      return `${target} is a file — pick another directory.`;
    }
    if (fs.readdirSync(target).length > 0) {
      return `${target} is not empty — pick another directory.`;
    }
  }
  return undefined;
}

async function resolveProjectDir(args) {
  let projectDir = args.dir;
  if (!projectDir) {
    projectDir = args.yes
      ? DEFAULT_PROJECT_DIR
      : unlessCancelled(
          await prompts.text({
            message: "Where should we create your project?",
            placeholder: DEFAULT_PROJECT_DIR,
            defaultValue: DEFAULT_PROJECT_DIR,
            validate: validateProjectDir,
          }),
        ).trim() || DEFAULT_PROJECT_DIR;
  }
  projectDir = path.resolve(unlessCancelled(projectDir));

  // Refuse a non-empty target outright — never overwrite existing files,
  // in interactive mode or --yes. There is no confirm-to-overwrite path:
  // "confirm then proceed" would still mean clobbering whatever was there.
  // If you want to scaffold into that directory, empty or remove it
  // yourself first.
  if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0) {
    fail(
      `${projectDir} already exists and is not empty — refusing to overwrite it. Pass a different --dir, or empty that directory first.`,
    );
  }
  return projectDir;
}

function validateSchemaSource(value) {
  const source = value?.trim();
  if (!source) return "Schema source is required";
  if (!isRemoteSchemaSource(source) && !fs.existsSync(source)) {
    return "Schema file not found";
  }
}

/** Resolves the custom schema source, or undefined to use the bundled example. */
async function resolveSchemaPath(args) {
  if (args.example || args.schema || args.yes) return args.schema?.trim();

  const schemaChoice = unlessCancelled(
    await prompts.select({
      message: "How would you like to provide your GraphQL schema?",
      options: [
        {
          value: "example",
          label: "Use example schema (recommended for first-time)",
        },
        {
          value: "existing",
          label: "Use my own schema (file, URL or git ref)",
        },
      ],
    }),
  );
  if (schemaChoice !== "existing") return undefined;

  const entered = unlessCancelled(
    await prompts.text({
      message:
        "Path or URL to your GraphQL schema (local file, introspection endpoint, git:/github: ref):",
      validate: validateSchemaSource,
    }),
  );
  return entered.trim();
}

/** Validates a local schema and detects the loader it needs. */
async function resolveLoader(schemaPath) {
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

  // Every schema source needs the matching graphql-tools loader — detect it
  // from the source and report the choice.
  const loader = detectLoader(schemaPath ?? "schema/example.graphql");
  if (schemaPath && !loader.isDefault) {
    prompts.log.info(
      `Detected schema source needs ${loader.package} (${loader.className}) — adding it as a dependency.`,
    );
  }
  return loader;
}

async function resolvePackageManager(args) {
  if (args.pm) return args.pm;
  // Set when launched via `<pm> create`, so it reflects what the user ran.
  const agent = getUserAgent()?.split("/")[0];
  if (agent && Object.hasOwn(INSTALL_COMMANDS, agent)) return agent;
  const detected = await detectPackageManager({ cwd: process.cwd() });
  if (detected?.name && Object.hasOwn(INSTALL_COMMANDS, detected.name)) {
    return detected.name;
  }
  if (args.yes) return "npm";
  return unlessCancelled(
    await prompts.select({
      message: "Which package manager would you like to use?",
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: "yarn" },
        { value: "bun", label: "bun" },
      ],
    }),
  );
}

/** Asks for a value; an empty answer yields `fallback`, a cancel aborts. */
async function askOptional(options, fallback) {
  const answer = unlessCancelled(await prompts.text(options));
  return answer || fallback;
}

/** Nuxt UI / Tailwind color names offered for the primary color. */
const COLORS = [
  "blue",
  "sky",
  "cyan",
  "teal",
  "emerald",
  "green",
  "lime",
  "amber",
  "orange",
  "red",
  "rose",
  "pink",
  "fuchsia",
  "purple",
  "indigo",
  "slate",
  "zinc",
  "neutral",
];

/** Asks for the primary color; violet is the layer default, so it means no override. */
async function askColor() {
  const color = unlessCancelled(
    await prompts.select({
      message: "Primary color:",
      initialValue: "violet",
      options: [
        { value: "violet", label: "violet", hint: "default" },
        ...COLORS.map((value) => ({ value, label: value })),
      ],
    }),
  );
  return color === "violet" ? "" : color;
}

/** Warns when --color is passed to a framework that ignores it. */
function initialColor(args, isDocusaurus) {
  const color = args.color ?? "";
  if (isDocusaurus && color) {
    prompts.log.warn(
      "--color only applies to the Nuxt template — ignoring it for Docusaurus.",
    );
    return "";
  }
  return color;
}

/** Whether the user wants to customize title/color interactively. */
async function wantsCustomization(isDocusaurus) {
  const answer = unlessCancelled(
    await prompts.confirm({
      message: isDocusaurus
        ? "Customize the site title?"
        : "Customize the site title and primary color?",
      initialValue: false,
    }),
  );
  return Boolean(answer);
}

/** Optional title and color customization. */
async function promptCustomization(args, isDocusaurus) {
  let title = args.title ?? "";
  let color = initialColor(args, isDocusaurus);
  if (args.yes || !(await wantsCustomization(isDocusaurus))) {
    return { title, color };
  }

  if (!args.title) {
    title = await askOptional(
      { message: "Site title:", defaultValue: "My API" },
      title,
    );
  }
  if (!isDocusaurus && !color) {
    color = await askColor();
  }
  return { title, color };
}

/** Copies a local schema into the scaffold (or drops the example for remote ones). */
function placeSchema(tempDir, schemaPath) {
  const templateExamplePath = path.join(tempDir, "schema", "example.graphql");
  if (!schemaPath) return "./schema/example.graphql";

  if (isRemoteSchemaSource(schemaPath)) {
    // Nothing to copy — the bundled example is unused, drop it so it
    // doesn't sit there implying it's still what gets generated.
    fs.rmSync(templateExamplePath, { force: true });
    return schemaPath;
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
function applyTemplate(tempDir, ctx) {
  const { framework, projectDir, schemaPath, loader, title, color } = ctx;
  const isDocusaurus = framework === "docusaurus";

  copyDirRecursive(path.join(templatesRoot, framework), tempDir, [
    /^node_modules$/,
    /^\.nuxt$/,
    /^\.output$/,
  ]);

  // npm strips `.gitignore` from published tarballs, so templates ship it as
  // `gitignore` and it is renamed back here.
  const gitignore = path.join(tempDir, "gitignore");
  if (fs.existsSync(gitignore)) {
    fs.renameSync(gitignore, path.join(tempDir, ".gitignore"));
  }

  const schemaRef = placeSchema(tempDir, schemaPath);

  if (isDocusaurus) {
    writeDocusaurusConfig(tempDir, title);
    writeGraphqlrc(tempDir, schemaRef, loader);
  } else {
    writeAppConfig(tempDir, title, color);
    writeGenerateDocs(tempDir, schemaRef, loader);
    writeNuxtConfig(tempDir, schemaRef, isRemoteSchemaSource(schemaRef));
  }

  writePackageJson(tempDir, projectDir, loader);

  // The Docusaurus README already documents editing .graphqlrc generically.
  if (!isDocusaurus) {
    writeReadme(tempDir, schemaPath, schemaRef, loader);
  }
}

function moveIntoPlace(tempDir, projectDir) {
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

/** Runs `action` immediately with --yes, otherwise only after a confirmed prompt. */
async function confirmThen(isYes, message, action) {
  if (isYes) return action();
  const confirmed = unlessCancelled(
    await prompts.confirm({ message, initialValue: true }),
  );
  if (confirmed) return action();
}

/** Phase 4: install dependencies, init git, print summary. */
async function finalize(args, ctx) {
  const { projectDir, packageManager, framework } = ctx;
  const isYes = Boolean(args.yes);

  let installed = false;
  if (!args["no-install"]) {
    installed = Boolean(
      await confirmThen(isYes, "Install dependencies now?", () =>
        installDependencies(packageManager, projectDir),
      ),
    );
  }
  if (!args["no-git"]) {
    if (await isGitAvailable()) {
      await confirmThen(isYes, "Initialize a git repository?", () =>
        initGitRepo(projectDir),
      );
    } else {
      prompts.log.info("git not found — skipping repository initialization.");
    }
  }

  // Relative path reads better than an absolute one; omitted when already there.
  const rel = path.relative(process.cwd(), projectDir);
  const steps = [];
  if (rel !== "") {
    steps.push(`cd ${rel.includes(" ") ? JSON.stringify(rel) : rel}`);
  }
  if (!installed) steps.push(`${packageManager} install`);
  if (framework === "docusaurus") {
    steps.push(`${packageManager} run doc`, `${packageManager} run start`);
  } else {
    steps.push(`${packageManager} run dev`);
  }
  const list = steps.map((step, i) => `  ${i + 1}. ${step}`).join("\n");
  prompts.outro(`
Next steps:
${list}

Documentation: https://graphql-markdown.dev
    `);
}

async function scaffold(args, tempDir) {
  validatePackageManager(args);
  const framework = await resolveFramework(args);
  const projectDir = await resolveProjectDir(args);
  const schemaPath = await resolveSchemaPath(args);
  const loader = await resolveLoader(schemaPath);
  const packageManager = await resolvePackageManager(args);
  const { title, color } = await promptCustomization(
    args,
    framework === "docusaurus",
  );

  applyTemplate(tempDir, {
    framework,
    projectDir,
    schemaPath,
    loader,
    title,
    color,
  });
  moveIntoPlace(tempDir, projectDir);
  prompts.log.success("Project created successfully!");

  await finalize(args, { projectDir, packageManager, framework });
}

/**
 * Run the scaffolder; resolves to the process exit code (never exits itself).
 */
export async function main(argv = process.argv.slice(2)) {
  let args;
  try {
    args = parseCliArgs(argv);
  } catch (error) {
    if (error?.code?.startsWith("ERR_PARSE_ARGS")) {
      console.error(
        `${error.message}\nRun with --help to see available options.`,
      );
      return 1;
    }
    throw error;
  }

  if (args.help) {
    console.log(HELP_TEXT);
    return 0;
  }
  if (args.version) {
    console.log(readVersion());
    return 0;
  }

  prompts.intro(`✨ Welcome to GraphQL Markdown Docs`);
  if (args.positionals.length > 1) {
    prompts.log.error(
      `Unexpected arguments: ${args.positionals.slice(1).join(" ")}\nRun with --help to see available options.`,
    );
    return 1;
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gqlmd-"));
  try {
    await scaffold(args, tempDir);
    return 0;
  } catch (error) {
    if (error instanceof CliExit) return error.code;
    throw error;
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

/** Run main(), converting unexpected errors into a logged exit code of 1. */
export async function run(argv = process.argv.slice(2)) {
  try {
    return await main(argv);
  } catch (error) {
    prompts.log.error(error.message);
    return 1;
  }
}
