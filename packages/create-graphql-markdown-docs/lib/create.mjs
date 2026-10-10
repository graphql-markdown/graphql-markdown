import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parseArgs } from "node:util";

import * as prompts from "@clack/prompts";
import {
  detect as detectPackageManager,
  getUserAgent,
} from "package-manager-detector";

import { DEFAULT_FRAMEWORK, FRAMEWORKS } from "./frameworks/index.mjs";
import {
  DEFAULT_PROJECT_DIR,
  applyTemplate,
  moveIntoPlace,
  packageRoot,
} from "./project.mjs";
import {
  EXAMPLE_SCHEMA_REF,
  detectLoader,
  isRemoteSchemaSource,
  validateGraphQLSchema,
} from "./schema.mjs";
import {
  INSTALL_COMMANDS,
  initGitRepo,
  installDependencies,
  isGitAvailable,
} from "./tasks.mjs";

const DOCS_URL = "https://graphql-markdown.dev";

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

/** Names of the frameworks that support a primary color. */
const colorFrameworkNames = Object.values(FRAMEWORKS)
  .filter((fw) => fw.supportsColor)
  .map((fw) => fw.name);

const HELP_TEXT = `Usage: create-graphql-markdown-docs [dir] [options]

Options:
  --framework <name>   Site framework: ${Object.keys(FRAMEWORKS).join(" | ")} (default: ${DEFAULT_FRAMEWORK})
  -d, --dir <path>     Directory to create the project in (or pass it as [dir])
  --schema <source>    Schema source: <path|url|git:|github:> (default: bundled example)
  --example            Use the bundled example schema
  --pm <name>          Package manager: npm | pnpm | yarn | bun
  --title <text>       Site title
  --color <name>       Primary color (${colorFrameworkNames.join(" / ")} only)
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
  // The first positional is the directory only when --dir was not given;
  // anything else is an unexpected argument.
  const extraPositionals =
    values.dir === undefined ? positionals.slice(1) : positionals;
  return {
    ...values,
    dir: values.dir ?? positionals[0],
    positionals,
    extraPositionals,
  };
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
    if (!Object.hasOwn(FRAMEWORKS, args.framework)) {
      fail(
        `Invalid --framework "${args.framework}" — expected one of: ${Object.keys(FRAMEWORKS).join(", ")}.`,
      );
    }
    return args.framework;
  }
  if (args.yes) return DEFAULT_FRAMEWORK;
  return unlessCancelled(
    await prompts.select({
      message: "Which framework would you like to use?",
      options: Object.entries(FRAMEWORKS).map(([value, fw]) => ({
        value,
        label: fw.label,
        hint: fw.hint,
      })),
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
  const problem = validateProjectDir(projectDir);
  if (problem) fail(problem);
  return projectDir;
}

function validateSchemaSource(value) {
  const source = value?.trim();
  if (!source) return "Schema source is required";
  if (isRemoteSchemaSource(source)) return undefined;
  if (!fs.existsSync(source)) {
    return `Schema file not found: ${source}`;
  }
  if (fs.statSync(source).isDirectory()) {
    return `${source} is a directory — provide a schema file, URL or git ref.`;
  }
  return undefined;
}

/** Resolves the custom schema source, or undefined to use the bundled example. */
async function resolveSchemaPath(args) {
  if (args.schema) {
    const source = args.schema.trim();
    const problem = validateSchemaSource(source);
    if (problem) fail(problem);
    return source;
  }
  if (args.example || args.yes) return undefined;

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
  // Every schema source needs the matching graphql-tools loader — detect it
  // from the source and report the choice.
  const loader = detectLoader(schemaPath ?? EXAMPLE_SCHEMA_REF);

  // Only an SDL file can be checked with buildSchema — introspection JSON and
  // code files need their own loader, and remote sources aren't fetched just
  // to lint them (`nuxi generate` surfaces a real error if one is invalid).
  if (schemaPath && loader.isDefault && !isRemoteSchemaSource(schemaPath)) {
    const isValid = await validateGraphQLSchema(schemaPath);
    if (!isValid) {
      prompts.log.warn(
        `${schemaPath} did not parse as a valid GraphQL schema — continuing anyway, but double-check it.`,
      );
    }
  }

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

/** Asks for the primary color; the default color is the layer default, so it means no override. */
async function askColor(fw) {
  const color = unlessCancelled(
    await prompts.select({
      message: "Primary color:",
      initialValue: fw.defaultColor,
      options: [
        { value: fw.defaultColor, label: fw.defaultColor, hint: "default" },
        ...fw.colors.map((value) => ({ value, label: value })),
      ],
    }),
  );
  return color === fw.defaultColor ? "" : color;
}

/** Warns when --color is passed to a framework that ignores it. */
function initialColor(args, fw) {
  const color = args.color ?? "";
  if (!fw.supportsColor && color) {
    prompts.log.warn(
      `--color only applies to the ${colorFrameworkNames.join(" / ")} template — ignoring it for ${fw.name}.`,
    );
    return "";
  }
  return color;
}

/** Whether the user wants to customize title/color interactively. */
async function wantsCustomization(fw) {
  const answer = unlessCancelled(
    await prompts.confirm({
      message: fw.supportsColor
        ? "Customize the site title and primary color?"
        : "Customize the site title?",
      initialValue: false,
    }),
  );
  return Boolean(answer);
}

/** Optional title and color customization. */
async function promptCustomization(args, fw) {
  let title = args.title ?? "";
  let color = initialColor(args, fw);
  if (args.yes || !(await wantsCustomization(fw))) {
    return { title, color };
  }

  if (!args.title) {
    title = await askOptional(
      { message: "Site title:", defaultValue: "My API" },
      title,
    );
  }
  if (fw.supportsColor && !color) {
    color = await askColor(fw);
  }
  return { title, color };
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
  const { projectDir, packageManager, framework, loader } = ctx;
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
  steps.push(
    ...FRAMEWORKS[framework].runScripts.map(
      (script) => `${packageManager} run ${script}`,
    ),
  );
  const githubHint = loader.tokenEnvVar
    ? `\nNote: set the ${loader.tokenEnvVar} environment variable so the GitHub schema can be loaded.\n`
    : "";
  const list = steps.map((step, i) => `  ${i + 1}. ${step}`).join("\n");
  prompts.outro(`
Next steps:
${list}
${githubHint}
Documentation: ${DOCS_URL}
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
    FRAMEWORKS[framework],
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

  await finalize(args, { projectDir, packageManager, framework, loader });
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
  if (args.extraPositionals.length > 0) {
    prompts.log.error(
      `Unexpected arguments: ${args.extraPositionals.join(" ")}\nRun with --help to see available options.`,
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
