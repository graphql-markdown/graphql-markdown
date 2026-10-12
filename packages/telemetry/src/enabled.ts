import type { TelemetryTrigger } from "@graphql-markdown/types";

import { DEFAULT_ENDPOINT } from "./constants";
import type { TelemetryState } from "./state";

export interface EnabledContext {
  /** Entry point; without it only `telemetry: true` enables (programmatic). */
  trigger?: TelemetryTrigger;
  /** Value of the `telemetry` option (config, programmatic or CLI). */
  option?: boolean;
  /** State file content; `null` means corrupt, `undefined` means absent. */
  state?: TelemetryState | null;
  env?: NodeJS.ProcessEnv;
}

export const getEndpoint = (env: NodeJS.ProcessEnv = process.env): string => {
  return env.GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT ?? DEFAULT_ENDPOINT;
};

const isSet = (value: string | undefined): boolean => {
  return (
    value !== undefined && value !== "" && value !== "0" && value !== "false"
  );
};

/**
 * Resolves whether telemetry is enabled and with which trigger.
 * User-level and environment signals always beat project config.
 */
export const isEnabled = (
  ctx: EnabledContext = {},
): { enabled: false } | { enabled: true; trigger: TelemetryTrigger } => {
  const env = ctx.env ?? process.env;
  if (
    isSet(env.DO_NOT_TRACK) ||
    isSet(env.GRAPHQL_MARKDOWN_TELEMETRY_DISABLED)
  ) {
    return { enabled: false };
  }
  if (ctx.state === null) {
    return { enabled: false };
  }
  if (ctx.state && (!ctx.state.enabled || ctx.state.reason === "sunset")) {
    return { enabled: false };
  }
  if (
    env.VITEST !== undefined ||
    env.JEST_WORKER_ID !== undefined ||
    env.NODE_TEST_CONTEXT !== undefined ||
    env.NODE_ENV === "test"
  ) {
    return { enabled: false };
  }
  if (ctx.option === false) {
    return { enabled: false };
  }
  if (!getEndpoint(env) && !isSet(env.GRAPHQL_MARKDOWN_TELEMETRY_DEBUG)) {
    return { enabled: false };
  }
  if (ctx.trigger) {
    return { enabled: true, trigger: ctx.trigger };
  }
  if (ctx.option === true) {
    return { enabled: true, trigger: "programmatic" };
  }
  return { enabled: false };
};
