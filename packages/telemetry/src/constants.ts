/** Current consent notice version; bump when a new category of data is added. */
export const NOTICE_VERSION = 1;

/**
 * Telemetry endpoint: the Cloudflare Worker ingest (workers.dev, see
 * github.com/graphql-markdown/telemetry). Overridable with
 * `GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT`.
 */
export const DEFAULT_ENDPOINT =
  "https://gqlmd-telemetry.graphql-markdown.workers.dev/v1/event";

/** Number of config fingerprints kept in `telemetry.json`. */
export const MAX_SENT_CONFIGS = 20;

/** Body size (bytes) above which the request is gzipped. */
export const GZIP_THRESHOLD = 1024;

/** Request timeout in milliseconds. */
export const TIMEOUT_MS = 1000;
