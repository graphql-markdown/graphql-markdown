import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import type {
  CliOptions,
  ConfigOptions,
  TelemetryEvent,
  TelemetryPayload,
  TelemetryTrigger,
} from "@graphql-markdown/types";

import { detectCi } from "./ci";
import { classifyPointer } from "./loader";
import { CLI_RULES, CONFIG_RULES, sanitizeConfig } from "./sanitize";

export interface PayloadInput {
  event?: TelemetryEvent;
  trigger: TelemetryTrigger;
  pkg: string;
  pkgVersion: string;
  /** `versionInfo.major` of the loaded `graphql`. */
  graphqlMajor?: unknown;
  config?: ConfigOptions;
  cli?: CliOptions;
  /** Create events only. */
  target?: string;
  mode?: "scaffold" | "wire";
  /** True only when no state file existed before this run. */
  noStateBefore?: boolean;
  env?: NodeJS.ProcessEnv;
}

const detectPm = (env: NodeJS.ProcessEnv): TelemetryPayload["pm"] => {
  const name = /^(npm|pnpm|yarn|bun)\//.exec(env.npm_config_user_agent ?? "");
  return (name?.[1] as TelemetryPayload["pm"] | undefined) ?? "unknown";
};

const isWsl = (env: NodeJS.ProcessEnv): boolean => {
  if (env.WSL_DISTRO_NAME) {
    return true;
  }
  try {
    return readFileSync("/proc/version", "utf8")
      .toLowerCase()
      .includes("microsoft");
  } catch {
    return false;
  }
};

const isContainer = (env: NodeJS.ProcessEnv): boolean => {
  return (
    existsSync("/.dockerenv") ||
    env.CODESPACES !== undefined ||
    env.REMOTE_CONTAINERS !== undefined
  );
};

const applySanitizedSection = (
  payload: TelemetryPayload,
  section: "cli" | "config",
  source: CliOptions | ConfigOptions,
  rules: Parameters<typeof sanitizeConfig>[1],
): number => {
  const result = sanitizeConfig(source, rules);
  if (section === "config") {
    payload.config = result.value;
  } else {
    payload.cli = result.value;
  }
  if (payload.loader === undefined && source.schema !== undefined) {
    payload.loader = classifyPointer(source.schema);
  }
  return result.unknownKeys;
};

export const buildPayload = (input: PayloadInput): TelemetryPayload => {
  const env = input.env ?? process.env;
  const { ci, ciProvider } = detectCi(env);
  const major = input.graphqlMajor;
  const payload: TelemetryPayload = {
    v: 1,
    event: input.event ?? "config",
    pkg: input.pkg,
    pkgVersion: input.pkgVersion,
    nodeMajor: Number.parseInt(process.versions.node, 10),
    graphqlMajor:
      typeof major === "number" &&
      Number.isInteger(major) &&
      major >= 0 &&
      major < 100
        ? major
        : "unknown",
    os: process.platform,
    ci,
    pm: detectPm(env),
    firstRun: !ci && input.noStateBefore === true,
    trigger: input.trigger,
    container: isContainer(env),
    wsl: isWsl(env),
  };
  if (ciProvider) {
    payload.ciProvider = ciProvider;
  }
  let unknownKeys = 0;
  if (input.config) {
    unknownKeys += applySanitizedSection(
      payload,
      "config",
      input.config,
      CONFIG_RULES,
    );
  }
  if (input.cli) {
    unknownKeys += applySanitizedSection(payload, "cli", input.cli, CLI_RULES);
  }
  if (unknownKeys > 0) {
    payload.unknownKeys = unknownKeys;
  }
  if (input.target !== undefined) {
    payload.target = input.target;
  }
  if (input.mode !== undefined) {
    payload.mode = input.mode;
  }
  return payload;
};

const canonical = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(canonical);
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => {
          return [k, canonical((value as Record<string, unknown>)[k])];
        }),
    );
  }
  return value;
};

/** SHA-256 of the canonical sorted-key JSON, excluding `firstRun`. */
export const fingerprint = (payload: TelemetryPayload): string => {
  const rest: Partial<TelemetryPayload> = { ...payload };
  delete rest.firstRun;
  return createHash("sha256")
    .update(JSON.stringify(canonical(rest)))
    .digest("hex");
};
