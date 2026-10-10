import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import * as prompts from "@clack/prompts";

import { WIRE_FRAMEWORKS } from "../frameworks/index.mjs";
import { normalizeOutput, suggestLinkRoot } from "../frameworks/links.mjs";
import {
  DOCS_URL,
  fail,
  resolvePackageManager,
  unlessCancelled,
  validateSchemaSource,
} from "../helpers.mjs";
import { detectLoader } from "../schema.mjs";
import { detectFrameworks, toSchemaRef } from "../target.mjs";
import {
  applyWirePlan,
  formatWirePlan,
  inspectProject,
  planWire,
  validateOutput,
} from "./plan.mjs";

const labelOf = (id) => WIRE_FRAMEWORKS[id].label;

/** Frameworks found in package.json plus the --framework value (empty counts as absent). */
function requestedFramework(args) {
  return args.framework || undefined;
}

/** With --yes, everything that cannot be guessed must be passed as a flag. */
function preflight(ctx) {
  const { args } = ctx;
  if (!args.yes) return;
  const missing = [];
  if (!args.schema) missing.push("--schema");
  if (!args.output) missing.push("--output");
  if (!requestedFramework(args) && ctx.detected.length !== 1) {
    missing.push("--framework");
  }
  if (missing.length === 0) return;
  let message = `Missing required options to add GraphQL-Markdown without prompts: ${missing.join(", ")}.`;
  if (ctx.detected.length > 1) {
    message += ` Detected: ${ctx.detected.map(labelOf).join(", ")}.`;
  } else if (ctx.detected.length === 0) {
    message += " Use --framework generic for an unlisted framework.";
  }
  fail(message);
}

function frameworkOptions(ids) {
  return ids.map((id) => ({
    value: id,
    label: WIRE_FRAMEWORKS[id].label,
    hint: WIRE_FRAMEWORKS[id].hint,
  }));
}

async function resolveWireFramework(ctx) {
  const { args, detected } = ctx;
  const requested = requestedFramework(args);
  if (requested) {
    if (!Object.hasOwn(WIRE_FRAMEWORKS, requested)) {
      fail(
        `Invalid --framework "${requested}" — expected one of: ${Object.keys(WIRE_FRAMEWORKS).join(", ")}.`,
      );
    }
    return requested;
  }
  if (detected.length === 1 && args.yes) {
    prompts.log.info(`Detected ${labelOf(detected[0])}`);
    return detected[0];
  }
  const all = Object.keys(WIRE_FRAMEWORKS);
  const select = (options, initialValue) =>
    prompts.select({
      message: "Which framework does this project use?",
      options,
      initialValue,
    });
  if (detected.length === 1) {
    return unlessCancelled(await select(frameworkOptions(all), detected[0]));
  }
  if (detected.length > 1) {
    return unlessCancelled(await select(frameworkOptions(detected)));
  }
  return unlessCancelled(await select(frameworkOptions(all), "generic"));
}

async function resolveWireSchema(ctx) {
  const { args, projectDir } = ctx;
  let source = args.schema?.trim();
  if (source) {
    const problem = validateSchemaSource(source);
    if (problem) fail(problem);
  } else {
    source = unlessCancelled(
      await prompts.text({
        message: "Schema source (path, glob or URL)",
        validate: validateSchemaSource,
      }),
    ).trim();
  }
  ctx.schemaRef = toSchemaRef(source, projectDir);
  ctx.loader = detectLoader(source);
}

async function resolveWireOutput(ctx) {
  const { args, projectDir, descriptor } = ctx;
  let output = args.output;
  if (output === undefined) {
    const hint = descriptor.outputHint ? ` (${descriptor.outputHint})` : "";
    output = unlessCancelled(
      await prompts.text({
        message: `Output folder for the generated docs${hint}`,
        validate: (value) => validateOutput(projectDir, value).error,
      }),
    );
  }
  const { error, warning } = validateOutput(projectDir, output);
  if (error) fail(error);
  if (warning) prompts.log.warn(warning);
  ctx.output = output.trim();
}

async function resolveSiteBase(ctx) {
  const { args } = ctx;
  if (args["site-base"] !== undefined) return args["site-base"];
  if (args.yes) return "/";
  const answer = unlessCancelled(
    await prompts.text({
      message: "Base path the site is served from",
      placeholder: "/",
      defaultValue: "/",
    }),
  );
  return answer.trim() || "/";
}

async function resolveLinkRoot(ctx) {
  const { args } = ctx;
  if (args["link-root"] !== undefined) {
    return args["link-root"].trim() || undefined;
  }
  const suggestion = suggestLinkRoot(ctx.descriptor, ctx.output, {
    siteBase: ctx.siteBase,
  });
  if (args.yes) return suggestion;
  const answer = unlessCancelled(
    await prompts.text({
      message: "Link root (route of the generated docs, blank for none)",
      initialValue: suggestion,
    }),
  );
  return answer.trim() || undefined;
}

async function resolveWireLinks(ctx) {
  const { links } = ctx.descriptor;
  if (links === "relative") return;
  if (links === "absolute") ctx.siteBase = await resolveSiteBase(ctx);
  ctx.linkRoot = await resolveLinkRoot(ctx);
}

/** Warns when the requested formatter cannot be found yet. */
function checkFormatter(ctx) {
  const name = ctx.args.formatter;
  if (!name) return;
  if (name.startsWith(".") || name.startsWith("/")) {
    if (!fs.existsSync(path.resolve(ctx.projectDir, name))) {
      prompts.log.warn(`${name} does not exist.`);
    }
    return;
  }
  try {
    createRequire(path.join(ctx.projectDir, "package.json")).resolve(name);
  } catch {
    prompts.log.warn(`${name} is not installed in the project yet.`);
  }
}

function writePlan(ctx) {
  const { args, projectDir, project, descriptor } = ctx;
  const plan = planWire(
    {
      descriptor,
      schema: ctx.schemaRef,
      loader: ctx.loader,
      output: ctx.output,
      linkRoot: ctx.linkRoot,
      siteBase: ctx.siteBase,
      formatter: args.formatter,
    },
    project,
    { scriptName: ctx.scriptName },
  );
  ctx.plan = plan;
  checkFormatter(ctx);
  if (args["dry-run"]) {
    prompts.note(formatWirePlan(plan), "Dry run — nothing written");
    return;
  }
  for (const file of applyWirePlan(projectDir, plan, project)) {
    prompts.log.success(`Wrote ${file}`);
  }
  for (const warning of plan.warnings) prompts.log.warn(warning);
  if (plan.mergeBlock) {
    prompts.note(plan.mergeBlock, "Merge into your existing GraphQL config");
  }
}

/** Ordered steps that add GraphQL-Markdown to an existing project. */
export const WIRE_STEPS = [
  {
    id: "inspect",
    title: "Inspect project",
    run(ctx) {
      ctx.project = inspectProject(ctx.projectDir);
      ctx.detected = detectFrameworks(ctx.project.packageJson);
      ctx.scriptName = ctx.args.script || "docs:api";
      preflight(ctx);
    },
  },
  {
    id: "framework",
    title: "Choose framework",
    async run(ctx) {
      ctx.framework = await resolveWireFramework(ctx);
      ctx.descriptor = WIRE_FRAMEWORKS[ctx.framework];
    },
  },
  { id: "schema", title: "Choose schema", run: resolveWireSchema },
  { id: "output", title: "Choose output folder", run: resolveWireOutput },
  { id: "links", title: "Configure links", run: resolveWireLinks },
  { id: "write", title: "Write configuration", run: writePlan },
  {
    id: "packageManager",
    title: "Choose package manager",
    when: (ctx) => Boolean(ctx.project.packageJson) && !ctx.args["dry-run"],
    async run(ctx) {
      ctx.packageManager = await resolvePackageManager(
        ctx.args,
        ctx.projectDir,
      );
    },
  },
];

/** Prints the closing summary for wire mode. */
export function printWireOutro(ctx) {
  if (ctx.args["dry-run"]) {
    prompts.outro("Dry run complete — nothing was written.");
    return;
  }
  const { plan, scriptName, descriptor } = ctx;
  const hasScript = plan.script.name || plan.script.skipped?.includes("exists");
  const generate = hasScript
    ? `${ctx.packageManager} run ${scriptName}`
    : "npx -p @graphql-markdown/cli gqlmd graphql-to-doc";
  const steps = [
    generate,
    descriptor.nextSteps({
      outputDir: normalizeOutput(ctx.output),
      route: ctx.linkRoot,
    }),
  ];
  const { tokenEnvVar } = ctx.loader;
  const tokenHint = tokenEnvVar
    ? `\nNote: set the ${tokenEnvVar} environment variable so the GitHub schema can be loaded.\n`
    : "";
  const list = steps.map((step, i) => `  ${i + 1}. ${step}`).join("\n");
  prompts.outro(`
Next steps:
${list}
${tokenHint}
Documentation: ${DOCS_URL}
    `);
}
