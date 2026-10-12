/**
 * `telemetry <enable|disable|status>` command.
 * All output goes to stderr so piped stdout stays clean.
 *
 * @module telemetry-command
 */

// @ts-expect-error TS1378
import { Command } from "commander";
import {
  detectCi,
  getStatePath,
  readState,
  resolveConfigDir,
  writeState,
} from "@graphql-markdown/telemetry";

const isSet = (value: string | undefined): boolean => {
  return (
    value !== undefined && value !== "" && value !== "0" && value !== "false"
  );
};

/**
 * Tells which source disables telemetry, if any.
 */
const getDisabledSource = (
  env: NodeJS.ProcessEnv,
  state: ReturnType<typeof readState>,
): string | undefined => {
  if (isSet(env.DO_NOT_TRACK)) {
    return "env (DO_NOT_TRACK)";
  }
  if (isSet(env.GRAPHQL_MARKDOWN_TELEMETRY_DISABLED)) {
    return "env (GRAPHQL_MARKDOWN_TELEMETRY_DISABLED)";
  }
  if (state === null) {
    return "file (unreadable telemetry.json)";
  }
  if (state?.reason === "sunset") {
    return "file (sunset)";
  }
  if (state && !state.enabled) {
    return "file (gqlmd telemetry disable)";
  }
  return undefined;
};

/**
 * Builds the `telemetry` command.
 *
 * @param env - Environment, injectable for tests.
 */
export const getTelemetryCommand = (
  env: NodeJS.ProcessEnv = process.env,
): Command => {
  const write = (message: string): void => {
    process.stderr.write(`${message}\n`);
  };

  return new Command("telemetry")
    .description("Manage anonymous usage telemetry")
    .argument("<action>", "enable, disable or status")
    .action((action: string) => {
      switch (action) {
        case "enable":
          writeState({ enabled: true, reason: undefined });
          write("Telemetry enabled.");
          break;
        case "disable":
          writeState({ enabled: false, reason: "user" });
          write("Telemetry disabled.");
          break;
        case "status": {
          const state = readState();
          const source = getDisabledSource(env, state);
          const { ci, ciProvider } = detectCi(env);
          write(`Telemetry: ${source ? "disabled" : "enabled"}`);
          write(`Disabled by: ${source ?? "-"}`);
          write(`CI provider: ${ci ? (ciProvider ?? "other") : "none"}`);
          write(`Config dir: ${resolveConfigDir()}`);
          write(`State file: ${getStatePath()}`);
          break;
        }
        default:
          write(`Unknown action "${action}". Use enable, disable or status.`);
          process.exitCode = 1;
      }
    });
};
