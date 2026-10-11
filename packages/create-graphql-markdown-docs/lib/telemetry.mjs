import fs from "node:fs";
import path from "node:path";

import { note } from "@clack/prompts";
import { track } from "@graphql-markdown/telemetry";

import { packageRoot } from "./project.mjs";
import { EXAMPLE_SCHEMA_REF } from "./schema.mjs";

const PKG_NAME = "create-graphql-markdown-docs";

/** The prompt answers worth reporting; the telemetry package masks custom values. */
function configFor(ctx) {
  if (ctx.mode === "wire") {
    return { schema: ctx.schemaRef, linkRoot: ctx.linkRoot };
  }
  return { schema: ctx.schemaPath ?? EXAMPLE_SCHEMA_REF };
}

/**
 * Reports one anonymous create event (`create_scaffold` or `create_wire`).
 * Never throws: telemetry must not affect a run. The full notice is shown
 * as a clack note instead of raw stderr output. Nothing is sent on `--dry-run`.
 */
export async function reportTelemetry(ctx) {
  if (ctx.args?.["dry-run"]) return;
  try {
    const { version } = JSON.parse(
      fs.readFileSync(path.join(packageRoot, "package.json"), "utf-8"),
    );
    await track({
      event: ctx.mode === "wire" ? "create_wire" : "create_scaffold",
      trigger: "create",
      pkg: PKG_NAME,
      pkgVersion: version,
      target: ctx.framework,
      mode: ctx.mode,
      config: configFor(ctx),
      option: ctx.args["no-telemetry"] ? false : undefined,
      onFullNotice: (notice) => note(notice, "Telemetry"),
    });
  } catch {
    // telemetry must never affect a run
  }
}
