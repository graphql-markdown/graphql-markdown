import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parseArgs } from "node:util";

import * as prompts from "@clack/prompts";

import {
  DEFAULT_FRAMEWORK,
  FRAMEWORKS,
  WIRE_FRAMEWORKS,
} from "./frameworks/index.mjs";
import {
  CliExit,
  DOCS_URL,
  fail,
  failureNote,
  resolvePackageManager,
  unlessCancelled,
  validateSchemaSource,
} from "./helpers.mjs";
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
import { WIRE_STEPS, printWireOutro } from "./wire/steps.mjs";
import { flagModeError, isEffectivelyEmpty, modeFor } from "./target.mjs";
import {
  INSTALL_COMMANDS,
  initGitRepo,
  installDependencies,
  isGitAvailable,
} from "./tasks.mjs";

/** Names of the frameworks that support a primary color. */
const colorFrameworkNames = Object.values(FRAMEWORKS)
  .filter((fw) => fw.scaffold.supportsColor)
  .map((fw) => fw.name);

const HELP_TEXT = `Usage: create-graphql-markdown-docs [dir] [options]

An empty or missing folder creates a new project (scaffold); a folder with
files adds GraphQL-Markdown to the existing project (wire).

Shared:
  [dir], -d, --dir <path>  Target folder (default: ask, or the current folder with --existing)
  --new | --existing       Force scaffold or wire mode (default: picked from the folder)
  --framework <name>       Scaffold: ${Object.keys(FRAMEWORKS).join(" | ")} (default: ${DEFAULT_FRAMEWORK})
                           Wire: ${Object.keys(WIRE_FRAMEWORKS).join(" | ")}
  --schema <source>        Schema source: <path|url|git:|github:>
  --pm <name>              Package manager: npm | pnpm | yarn | bun
  --install / --no-install Install dependencies (or skip it)
  -y, --yes                Accept defaults and skip all prompts
  -h, --help               Show this help
  -v, --version            Show the version

Scaffold only:
  --example                Use the bundled example schema
  --title <text>           Site title
  --color <name>           Primary color (${colorFrameworkNames.join(" / ")} only)
  --no-git                 Skip git repository initialization

Wire only:
  --formatter <name>       Formatter module or path (default: the framework's)
  --output <folder>        Folder for the generated docs, relative to the project
  --link-root <route>      Route prefix used in generated links
  --site-base <route>      Base path the site is served from
  --script <name>          package.json script to add (default: docs:api)
  --dry-run                Show what would be written without writing it
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
      new: { type: "boolean" },
      existing: { type: "boolean" },
      install: { type: "boolean" },
      "no-install": { type: "boolean" },
      formatter: { type: "string" },
      output: { type: "string" },
      "link-root": { type: "string" },
      "site-base": { type: "string" },
      script: { type: "string" },
      "dry-run": { type: "boolean" },
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
    if (
      !Object.hasOwn(FRAMEWORKS, args.framework) &&
      Object.hasOwn(WIRE_FRAMEWORKS, args.framework)
    ) {
      const { label, createCommand } = WIRE_FRAMEWORKS[args.framework];
      fail(
        createCommand
          ? `No template for ${label} — create the site first (${createCommand}), then run this command inside it.`
          : `No template for ${label} — create your site first, then run this command inside it.`,
      );
    }
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
    if (!isEffectivelyEmpty(target)) {
      return `${target} is not empty — pick another directory.`;
    }
  }
  return undefined;
}

/** Prompts for the folder of a new project and refuses a non-empty one. */
async function askNewProjectDir() {
  const answer = unlessCancelled(
    await prompts.text({
      message: "Where should we create your project?",
      placeholder: DEFAULT_PROJECT_DIR,
      defaultValue: DEFAULT_PROJECT_DIR,
      validate: validateProjectDir,
    }),
  );
  return path.resolve(answer.trim() || DEFAULT_PROJECT_DIR);
}

/** Picks the target folder when no dir was given; returns { dir, confirmed? }. */
async function chooseTargetDir(args) {
  const cwd = process.cwd();
  if (args.existing) return { dir: cwd };
  if (args.yes) return { dir: path.resolve(DEFAULT_PROJECT_DIR) };
  if (isEffectivelyEmpty(cwd)) return { dir: await askNewProjectDir() };
  const choice = unlessCancelled(
    await prompts.select({
      message: "This folder is not empty. What would you like to do?",
      options: [
        {
          value: "wire",
          label: "Add GraphQL-Markdown to this project",
        },
        {
          value: "scaffold",
          label: "Create a new project in a subfolder",
        },
      ],
    }),
  );
  return choice === "wire"
    ? { dir: cwd, confirmed: true }
    : { dir: await askNewProjectDir() };
}

/** Resolves an explicit dir argument; a file is refused. */
function resolveGivenDir(arg) {
  const dir = path.resolve(arg);
  if (fs.existsSync(dir) && !fs.statSync(dir).isDirectory()) {
    fail(`${dir} is a file — pick another directory.`);
  }
  return dir;
}

/** Fails when --new / --existing contradict the mode the folder implies. */
function checkModeOverrides(args, dir, mode) {
  if (args.new && mode === "wire") {
    fail(
      `${dir} is not empty — --new never writes into an existing project. Pick an empty or new folder.`,
    );
  }
  if (args.existing && mode === "scaffold") {
    fail(
      `${dir} is empty — there is no project to add GraphQL-Markdown to. Drop --existing to create one.`,
    );
  }
  const flagError = flagModeError(args, mode, dir);
  if (flagError) fail(flagError);
}

/** Announces wire mode and asks to continue unless already confirmed. */
async function confirmWire(args, dir, confirmed) {
  prompts.log.info(
    `Existing project detected — adding GraphQL-Markdown to ${dir}`,
  );
  if (confirmed || args.yes) return;
  const answer = await prompts.confirm({
    message: "Continue?",
    initialValue: true,
  });
  if (answer === false || prompts.isCancel(answer)) {
    prompts.cancel("Setup cancelled.");
    throw new CliExit(1);
  }
}

/** Resolves the target folder and the mode (scaffold or wire) into ctx. */
async function resolveTarget(ctx) {
  const { args } = ctx;
  if (args.new && args.existing) {
    fail("--new and --existing cannot be used together.");
  }
  const chosen = args.dir
    ? { dir: resolveGivenDir(args.dir) }
    : await chooseTargetDir(args);
  const mode = modeFor(chosen.dir);
  checkModeOverrides(args, chosen.dir, mode);
  if (mode === "wire") {
    await confirmWire(args, chosen.dir, Boolean(chosen.confirmed));
  }
  ctx.projectDir = chosen.dir;
  ctx.mode = mode;
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
      initialValue: fw.scaffold.defaultColor,
      options: [
        {
          value: fw.scaffold.defaultColor,
          label: fw.scaffold.defaultColor,
          hint: "default",
        },
        ...fw.scaffold.colors.map((value) => ({ value, label: value })),
      ],
    }),
  );
  return color === fw.scaffold.defaultColor ? "" : color;
}

/** Warns when --color is passed to a framework that ignores it. */
function initialColor(args, fw) {
  const color = args.color ?? "";
  if (!fw.scaffold.supportsColor && color) {
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
      message: fw.scaffold.supportsColor
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
  if (fw.scaffold.supportsColor && !color) {
    color = await askColor(fw);
  }
  return { title, color };
}

/**
 * Ordered scaffold steps. Each step is a plain object:
 * - `id`, `title`: identifier and human-readable name (used in failure notes).
 * - `run(ctx)`: does the work, reading from and writing to the shared `ctx`.
 *   Optional steps may return `{ skipped: true, catchUp: false }` to be
 *   recorded as skipped with nothing left to do; any other result is `done`.
 * - `when?(ctx)`: resolves to `false` to skip the step.
 * - `confirm?`: prompt shown in interactive mode; `--yes` runs without asking,
 *   declining skips the step.
 * - `optional?`: errors are logged and recorded as `failed` instead of aborting.
 * - `catchUp?(ctx)`: manual commands that finish the step when it did not
 *   complete (skipped or failed).
 */
const SCAFFOLD_STEPS = [
  {
    id: "framework",
    title: "Choose framework",
    async run(ctx) {
      ctx.framework = await resolveFramework(ctx.args);
      ctx.fw = FRAMEWORKS[ctx.framework];
    },
  },
  {
    id: "schema",
    title: "Choose schema",
    async run(ctx) {
      ctx.schemaPath = await resolveSchemaPath(ctx.args);
    },
  },
  {
    id: "loader",
    title: "Detect schema loader",
    async run(ctx) {
      ctx.loader = await resolveLoader(ctx.schemaPath);
    },
  },
  {
    id: "packageManager",
    title: "Choose package manager",
    async run(ctx) {
      ctx.packageManager = await resolvePackageManager(ctx.args);
    },
  },
  {
    id: "customization",
    title: "Customize site",
    async run(ctx) {
      const { title, color } = await promptCustomization(ctx.args, ctx.fw);
      ctx.title = title;
      ctx.color = color;
    },
  },
  {
    id: "createProject",
    title: "Create project",
    run(ctx) {
      applyTemplate(ctx.tempDir, ctx);
      moveIntoPlace(ctx.tempDir, ctx.projectDir);
      prompts.log.success("Project created successfully!");
    },
  },
  {
    id: "install",
    title: "Install dependencies",
    optional: true,
    confirm: "Install dependencies now?",
    when: (ctx) => !ctx.args["no-install"],
    run: (ctx) => installDependencies(ctx.packageManager, ctx.projectDir),
    catchUp: (ctx) => [`${ctx.packageManager} install`],
  },
  {
    id: "git",
    title: "Initialize git repository",
    optional: true,
    confirm: "Initialize a git repository?",
    async when(ctx) {
      if (ctx.args["no-git"]) return false;
      if (await isGitAvailable()) return true;
      ctx.gitMissing = true;
      prompts.log.info("git not found — skipping repository initialization.");
      return false;
    },
    async run(ctx) {
      // Inside an existing repo there is nothing to do, and nothing to catch up.
      if (!(await initGitRepo(ctx.projectDir))) {
        return { skipped: true, catchUp: false };
      }
    },
    // Without git (or when opted out with --no-git) there is nothing to suggest.
    catchUp: (ctx) =>
      ctx.args["no-git"] || ctx.gitMissing
        ? []
        : ["git init", "git add -A", 'git commit -m "Initial commit"'],
  },
];

/**
 * Whether a step should run: `when` can skip it and, without --yes, a
 * `confirm` prompt can decline it (a cancel aborts the run).
 */
async function shouldRun(step, ctx) {
  if (step.when && (await step.when(ctx)) === false) return false;
  if (!step.confirm || ctx.args.yes) return true;
  return Boolean(
    unlessCancelled(
      await prompts.confirm({ message: step.confirm, initialValue: true }),
    ),
  );
}

/**
 * Runs one step and returns its outcome. Errors in required steps propagate;
 * errors in optional steps are logged and recorded so the flow can continue.
 */
async function runStep(step, ctx) {
  if (!(await shouldRun(step, ctx))) {
    return { step, status: "skipped", catchUp: true };
  }
  try {
    const result = await step.run(ctx);
    return result?.skipped
      ? { step, status: "skipped", catchUp: result.catchUp !== false }
      : { step, status: "done" };
  } catch (error) {
    if (!step.optional) throw error;
    prompts.log.error(`${step.title} failed: ${error.message}`);
    return { step, status: "failed", catchUp: true, error };
  }
}

/** Runs the steps in order, recording a `done`/`skipped`/`failed` outcome for each. */
async function runSteps(steps, ctx) {
  const outcomes = [];
  for (const step of steps) {
    // Sequential on purpose: steps prompt the user and read what earlier
    // steps put on ctx, so they cannot run in parallel.
    outcomes.push(await runStep(step, ctx)); // NOSONAR: S9382
  }
  return outcomes;
}

/** Commands to finish what did not complete, then the framework's run scripts. */
function nextSteps(ctx, outcomes) {
  const { projectDir, packageManager, fw } = ctx;
  const steps = [];

  // Relative path reads better than an absolute one; omitted when already there.
  const rel = path.relative(process.cwd(), projectDir);
  if (rel !== "") {
    steps.push(`cd ${rel.includes(" ") ? JSON.stringify(rel) : rel}`);
  }
  for (const { step, status, catchUp } of outcomes) {
    if (status !== "done" && catchUp && step.catchUp) {
      steps.push(...step.catchUp(ctx));
    }
  }
  steps.push(
    ...fw.scaffold.runScripts.map(
      (script) => `${packageManager} run ${script}`,
    ),
  );
  return steps;
}

/** Prints the closing summary: failures, catch-up commands and next steps. */
function printOutro(ctx, outcomes) {
  const { tokenEnvVar } = ctx.loader;
  const githubHint = tokenEnvVar
    ? `\nNote: set the ${tokenEnvVar} environment variable so the GitHub schema can be loaded.\n`
    : "";
  const list = nextSteps(ctx, outcomes)
    .map((step, i) => `  ${i + 1}. ${step}`)
    .join("\n");
  prompts.outro(`
${failureNote(outcomes)}Next steps:
${list}
${githubHint}
Documentation: ${DOCS_URL}
    `);
}

async function scaffold(ctx) {
  const outcomes = await runSteps(SCAFFOLD_STEPS, ctx);
  printOutro(ctx, outcomes);
}

async function wire(ctx) {
  const outcomes = await runSteps(WIRE_STEPS, ctx);
  printWireOutro(ctx, outcomes);
}

async function runMode(args, tempDir) {
  validatePackageManager(args);
  const ctx = { args, tempDir };
  await resolveTarget(ctx);
  await (ctx.mode === "wire" ? wire(ctx) : scaffold(ctx));
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
    await runMode(args, tempDir);
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
