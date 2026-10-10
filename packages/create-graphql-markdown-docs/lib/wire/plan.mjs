import fs from "node:fs";
import path from "node:path";

import {
  normalizeOutput,
  splitOutput,
  suggestLinkRoot,
} from "../frameworks/links.mjs";
import { toYaml } from "./yaml.mjs";

/** GraphQL config file names that may already hold a project's configuration. */
const GRAPHQL_CONFIG_FILES = [
  ".graphqlrc",
  ".graphqlrc.yml",
  ".graphqlrc.yaml",
  ".graphqlrc.json",
  ".graphqlrc.js",
  ".graphqlrc.ts",
  ".graphqlrc.cjs",
  ".graphqlrc.mjs",
  ".graphqlrc.cts",
  ".graphqlrc.mts",
  ".graphqlrc.toml",
  "graphql.config.yml",
  "graphql.config.yaml",
  "graphql.config.json",
  "graphql.config.js",
  "graphql.config.cjs",
  "graphql.config.mjs",
  "graphql.config.ts",
  "graphql.config.cts",
  "graphql.config.mts",
  "graphql.config.toml",
];

/**
 * Inspect a project directory for package.json and an existing GraphQL config.
 * @param {string} projectDir
 * @returns {{ packageJson: object | null, packageJsonIndent: string | number, existingConfig: string | null }}
 */
export function inspectProject(projectDir) {
  let packageJson = null;
  let packageJsonIndent = 2;
  const pkgPath = path.join(projectDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const raw = fs.readFileSync(pkgPath, "utf8");
    packageJson = JSON.parse(raw);
    const match = /^([ \t]+)\S/m.exec(raw);
    if (match) {
      packageJsonIndent = match[1];
    }
  }
  let existingConfig = GRAPHQL_CONFIG_FILES.find((name) =>
    fs.existsSync(path.join(projectDir, name)),
  );
  if (!existingConfig && packageJson && "graphql" in packageJson) {
    existingConfig = "package.json#graphql";
  }
  return {
    packageJson,
    packageJsonIndent,
    existingConfig: existingConfig ?? null,
  };
}

/**
 * Validate the output folder against the project directory.
 * @param {string} projectDir
 * @param {string} output
 * @returns {{ error?: string, warning?: string }}
 */
export function validateOutput(projectDir, output) {
  if (!output?.trim()) {
    return { error: "Output folder is required." };
  }
  if (path.isAbsolute(output)) {
    return { error: "Output folder must be relative to the project root." };
  }
  const normalized = path.posix.normalize(
    normalizeOutput(output.trim()) || ".",
  );
  if (normalized === ".") {
    return { error: "Output folder must be a subfolder of the project." };
  }
  if (normalized === ".." || normalized.startsWith("../")) {
    return { error: "Output folder must be inside the project." };
  }
  const target = path.join(projectDir, normalized);
  if (fs.existsSync(target)) {
    if (!fs.statSync(target).isDirectory()) {
      return { error: `${output} already exists and is not a directory.` };
    }
    if (fs.readdirSync(target).length > 0) {
      return {
        warning: `${output} already exists and is not empty — generated files may overwrite pages in it.`,
      };
    }
  }
  return {};
}

/**
 * Build the .graphqlrc content as a plain object.
 * @param {object} inputs
 * @param {object} inputs.descriptor
 * @param {string} inputs.schema
 * @param {object} inputs.loader
 * @param {string} inputs.output
 * @param {string | null} [inputs.linkRoot] `null` omits linkRoot from the config.
 * @param {string} [inputs.siteBase]
 * @param {string} [inputs.formatter]
 * @returns {object}
 */
export function buildGraphqlrc({
  descriptor,
  schema,
  loader,
  output,
  linkRoot,
  siteBase,
  formatter,
}) {
  const { rootPath, baseURL } = splitOutput(descriptor, output);
  const resolvedLinkRoot =
    descriptor.links === "relative" || linkRoot === null
      ? undefined
      : (linkRoot ?? suggestLinkRoot(descriptor, output, { siteBase }));
  const resolvedFormatter = formatter ?? descriptor.formatter;

  const { options, tokenEnvVar } = loader;
  const loaders =
    !options && !tokenEnvVar
      ? { [loader.className]: loader.package }
      : {
          [loader.className]: {
            module: loader.package,
            options: {
              ...options,
              ...(tokenEnvVar && { token: "${" + tokenEnvVar + "}" }),
            },
          },
        };

  return {
    schema,
    extensions: {
      "graphql-markdown": {
        rootPath: rootPath === "." ? "." : `./${rootPath}`,
        baseURL,
        ...(resolvedLinkRoot !== undefined && { linkRoot: resolvedLinkRoot }),
        ...(resolvedFormatter && { formatter: resolvedFormatter }),
        loaders,
      },
    },
  };
}

/**
 * Plan the files and package.json changes needed to wire a project.
 * @param {object} inputs Arguments for buildGraphqlrc.
 * @param {ReturnType<typeof inspectProject>} project
 * @param {{ scriptName?: string }} [options]
 * @returns {{ files: { path: string, content: string }[], mergeBlock?: string, script: object, warnings: string[] }}
 */
export function planWire(inputs, project, { scriptName = "docs:api" } = {}) {
  const config = buildGraphqlrc(inputs);
  const warnings = [];
  let files = [];
  let mergeBlock;
  if (project.existingConfig) {
    mergeBlock = toYaml({ extensions: config.extensions });
    warnings.push(
      `Found ${project.existingConfig} — not writing .graphqlrc. Merge the block below into it (schema: ${inputs.schema}).`,
    );
  } else {
    files = [{ path: ".graphqlrc", content: toYaml(config) }];
  }

  let script;
  if (!project.packageJson) {
    script = { skipped: "no package.json" };
  } else if (project.packageJson.scripts?.[scriptName]) {
    script = { skipped: `script "${scriptName}" already exists` };
  } else {
    script = { name: scriptName, command: "gqlmd graphql-to-doc" };
  }
  return { files, mergeBlock, script, warnings };
}

/**
 * Apply a wire plan to disk. Never overwrites existing files.
 * @param {string} projectDir
 * @param {ReturnType<typeof planWire>} plan
 * @param {ReturnType<typeof inspectProject>} project
 * @returns {string[]} Written paths (relative to projectDir).
 */
export function applyWirePlan(projectDir, plan, project) {
  const written = [];
  for (const file of plan.files) {
    fs.writeFileSync(path.join(projectDir, file.path), file.content, {
      flag: "wx",
    });
    written.push(file.path);
  }
  if (plan.script.name) {
    const pkg = project.packageJson;
    pkg.scripts = { ...pkg.scripts, [plan.script.name]: plan.script.command };
    fs.writeFileSync(
      path.join(projectDir, "package.json"),
      JSON.stringify(pkg, null, project.packageJsonIndent) + "\n",
    );
    written.push("package.json");
  }
  return written;
}

/**
 * Render a wire plan as human-readable text (for --dry-run).
 * @param {ReturnType<typeof planWire>} plan
 * @returns {string}
 */
export function formatWirePlan(plan) {
  const lines = [];
  for (const file of plan.files) {
    lines.push(`Write ${file.path}:`, file.content);
  }
  if (plan.script.name) {
    lines.push(
      `Add script to package.json: "${plan.script.name}": "${plan.script.command}"`,
    );
  } else {
    lines.push(`Skip package.json script: ${plan.script.skipped}`);
  }
  if (plan.mergeBlock) {
    lines.push("", "Merge block:", plan.mergeBlock);
  }
  for (const warning of plan.warnings) {
    lines.push(`Warning: ${warning}`);
  }
  return lines.join("\n");
}
