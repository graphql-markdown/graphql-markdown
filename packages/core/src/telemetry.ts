/**
 * Anonymous usage telemetry hook for `buildConfig`.
 *
 * Fire and forget: nothing here can throw, reject or delay the caller.
 *
 * @module telemetry
 */
import { createRequire } from "node:module";

import type {
  CliOptions,
  ConfigOptions,
  Maybe,
  TelemetryTrigger,
} from "@graphql-markdown/types";

/** Internal context passed by our own entry points. */
export interface BuildConfigContext {
  trigger?: TelemetryTrigger;
}

export interface TelemetryReport {
  configFileOpts: Maybe<ConfigOptions>;
  extension: Maybe<ConfigOptions>;
  cliOpts: Maybe<CliOptions>;
  id?: Maybe<string>;
  trigger?: TelemetryTrigger;
}

/** Telemetry decision made once by `buildConfig`, reused at generation time. */
export interface TelemetryContext {
  trigger?: TelemetryTrigger;
  option?: boolean;
}

/** Outcome of a documentation generation run. */
export interface GenerationReport {
  telemetry?: TelemetryContext;
  pages: number;
  durationMs: number;
  /** Error thrown by the run, if any. */
  error?: unknown;
  /** Explicit error type, takes precedence over `error`. */
  errorType?: string;
  /** The run failed without throwing because the schema could not be loaded. */
  noSchema?: boolean;
  /** First post-processing error, when the run completed incompletely. */
  postError?: unknown;
}

/** In-flight config event, awaited before the generate event is sent. */
let pending: Promise<void> = Promise.resolve();

/** Fingerprints already reported by this process. */
const reported = new Set<string>();

const isSet = (value: string | undefined): boolean => {
  return (
    value !== undefined && value !== "" && value !== "0" && value !== "false"
  );
};

/**
 * Cheap opt-out checks, run before the telemetry package is even imported.
 * The package repeats and completes them (state file, endpoint, ...).
 */
const isEnabled = (
  option: boolean | undefined,
  trigger: TelemetryTrigger | undefined,
  env: NodeJS.ProcessEnv,
): boolean => {
  if (
    isSet(env.DO_NOT_TRACK) ||
    isSet(env.GRAPHQL_MARKDOWN_TELEMETRY_DISABLED) ||
    env.VITEST !== undefined ||
    env.JEST_WORKER_ID !== undefined ||
    env.NODE_TEST_CONTEXT !== undefined ||
    env.NODE_ENV === "test"
  ) {
    return false;
  }
  if (option === false) {
    return false;
  }
  return trigger !== undefined || option === true;
};

const resolveOption = (
  ...values: Maybe<boolean | undefined>[]
): boolean | undefined => {
  if (values.includes(false)) {
    return false;
  }
  return values.includes(true) ? true : undefined;
};

/**
 * Resolves the telemetry opt-in and trigger from the configuration sources.
 */
export const resolveTelemetryContext = (
  report: Pick<
    TelemetryReport,
    "cliOpts" | "configFileOpts" | "extension" | "trigger"
  >,
): TelemetryContext => {
  return {
    trigger: report.trigger,
    option: resolveOption(
      report.cliOpts?.telemetry,
      report.configFileOpts?.telemetry,
      report.extension?.telemetry,
    ),
  };
};

const fingerprintOf = (report: TelemetryReport): string => {
  return JSON.stringify(
    [
      report.configFileOpts,
      report.extension,
      report.cliOpts,
      report.id,
      report.trigger,
    ],
    (_key, value: unknown): unknown => {
      return typeof value === "function" ? "<function>" : value;
    },
  );
};

const readVersion = (): string => {
  try {
    const pkg = createRequire(__filename)("../package.json") as {
      version?: string;
    };
    return pkg.version ?? "unknown";
  } catch {
    return "unknown";
  }
};

const readGraphqlMajor = async (): Promise<unknown> => {
  try {
    const { versionInfo } = await import("graphql");
    return versionInfo.major;
  } catch {
    return undefined;
  }
};

/**
 * Reports the resolved configuration once per distinct config and process.
 * Never throws and never rejects.
 */
export const reportTelemetry = async (
  report: TelemetryReport,
): Promise<void> => {
  try {
    const option = resolveOption(
      report.cliOpts?.telemetry,
      report.configFileOpts?.telemetry,
      report.extension?.telemetry,
    );
    if (!isEnabled(option, report.trigger, process.env)) {
      return;
    }
    const fingerprint = fingerprintOf(report);
    if (reported.has(fingerprint)) {
      return;
    }
    reported.add(fingerprint);

    const { track } = await import("@graphql-markdown/telemetry");
    pending = (async (): Promise<void> => {
      try {
        await track({
          trigger: report.trigger ?? "programmatic",
          option,
          pkg: "@graphql-markdown/core",
          pkgVersion: readVersion(),
          graphqlMajor: await readGraphqlMajor(),
          config: { ...report.extension, ...report.configFileOpts },
          cli: report.cliOpts ?? undefined,
        });
      } catch {
        // telemetry must never affect a run
      }
    })();
    await pending;
  } catch {
    // telemetry must never affect a run
  }
};

/**
 * Reports the outcome of a generation run.
 * Never throws and never rejects.
 */
export const reportGeneration = async (
  report: GenerationReport,
): Promise<void> => {
  try {
    const { trigger, option } = report.telemetry ?? {};
    if (!isEnabled(option, trigger, process.env)) {
      return;
    }
    // avoids racing the config event on the state file
    await pending;

    const { track, errorTypeOf, NO_SCHEMA_ERROR, POST_ERROR_PREFIX } =
      await import("@graphql-markdown/telemetry");

    let errorType = report.errorType;
    if (errorType === undefined) {
      if (report.error !== undefined) {
        errorType = errorTypeOf(report.error);
      } else if (report.noSchema) {
        errorType = NO_SCHEMA_ERROR;
      } else if (report.postError !== undefined) {
        errorType = `${POST_ERROR_PREFIX}${errorTypeOf(report.postError)}`;
      }
    }

    await track({
      event: "generate",
      trigger: trigger ?? "programmatic",
      option,
      pkg: "@graphql-markdown/core",
      pkgVersion: readVersion(),
      graphqlMajor: await readGraphqlMajor(),
      pages: report.pages,
      durationMs: report.durationMs,
      errorType,
    });
  } catch {
    // telemetry must never affect a run
  }
};
