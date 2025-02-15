import type { ConfigOptions, ExperimentalConfigOptions } from "./core";

export type GraphQLMarkdownCliOptions = ConfigOptions &
  Partial<ExperimentalConfigOptions>;
