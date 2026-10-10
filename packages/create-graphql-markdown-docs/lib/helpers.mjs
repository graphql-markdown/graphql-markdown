import fs from "node:fs";

import * as prompts from "@clack/prompts";
import {
  detect as detectPackageManager,
  getUserAgent,
} from "package-manager-detector";

import { isRemoteSchemaSource } from "./schema.mjs";
import { INSTALL_COMMANDS } from "./tasks.mjs";

export const DOCS_URL = "https://graphql-markdown.dev";

/** Thrown to abort the run with an exit code; the message was already logged. */
export class CliExit extends Error {
  constructor(code = 1) {
    super("cli-exit");
    this.code = code;
  }
}

/** Abort the run when a prompt was cancelled; otherwise return its value. */
export function unlessCancelled(value) {
  if (prompts.isCancel(value)) {
    prompts.cancel("Setup cancelled.");
    throw new CliExit(1);
  }
  return value;
}

/** Lists failed steps ahead of the next steps; empty when nothing failed. */
export function failureNote(outcomes) {
  const failures = outcomes
    .filter(({ status }) => status === "failed")
    .map(({ step, error }) => `  - ${step.title}: ${error.message}`);
  return failures.length > 0
    ? `Some steps did not complete:\n${failures.join("\n")}\n\n`
    : "";
}

/** Log an error and abort the run. */
export function fail(message) {
  prompts.log.error(message);
  throw new CliExit(1);
}

/** Prompt validator for a schema source (path, URL or git ref). */
export function validateSchemaSource(value) {
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

/** Package manager from --pm, the launching agent, or the lockfiles in `cwd`. */
export async function resolvePackageManager(args, cwd = process.cwd()) {
  if (args.pm) return args.pm;
  // Set when launched via `<pm> create`, so it reflects what the user ran.
  const agent = getUserAgent()?.split("/")[0];
  if (agent && Object.hasOwn(INSTALL_COMMANDS, agent)) return agent;
  const detected = await detectPackageManager({ cwd });
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
