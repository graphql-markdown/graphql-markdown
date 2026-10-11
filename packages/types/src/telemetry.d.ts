/** Entry point that triggered the telemetry event. */
export type TelemetryTrigger = "cli" | "docusaurus" | "nuxt" | "programmatic";

/** Kind of telemetry event. */
export type TelemetryEvent = "config" | "create_scaffold" | "create_wire";

/** Detected CI provider (`other` for a generic `CI` variable). */
export type CiProvider =
  | "github-actions"
  | "gitlab"
  | "circleci"
  | "azure-pipelines"
  | "jenkins"
  | "bitbucket"
  | "buildkite"
  | "travis"
  | "vercel"
  | "netlify"
  | "cloudflare-pages"
  | "aws-codebuild"
  | "teamcity"
  | "appveyor"
  | "drone"
  | "render"
  | "other";

/** Anonymous telemetry payload, version 1. Contains no identifier. */
export interface TelemetryPayload {
  /** Payload schema version. */
  v: 1;
  event: TelemetryEvent;
  pkg: string;
  pkgVersion: string;
  nodeMajor: number;
  /** GraphQL major version, or `"unknown"`. */
  graphqlMajor: number | "unknown";
  os: string;
  ci: boolean;
  ciProvider?: CiProvider;
  pm: "npm" | "pnpm" | "yarn" | "bun" | "unknown";
  firstRun: boolean;
  trigger: TelemetryTrigger;
  container: boolean;
  wsl: boolean;
  /** Loader kinds of the schema pointer(s). */
  loader?: string | string[];
  /** Sanitized config sources. */
  config?: Record<string, unknown>;
  cli?: Record<string, unknown>;
  /** Count of dropped unknown top-level keys. */
  unknownKeys?: number;
  /** Create target preset (create events). */
  target?: string;
  /** Create mode (create events). */
  mode?: "scaffold" | "wire";
}
