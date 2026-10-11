/** Current consent notice version; bump when a new category of data is added. */
export const NOTICE_VERSION = 1;

/**
 * Telemetry endpoint. Empty until the Worker is live: an empty endpoint keeps
 * telemetry disabled unless `GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT` is set.
 */
export const DEFAULT_ENDPOINT = "";

/** Number of config fingerprints kept in `telemetry.json`. */
export const MAX_SENT_CONFIGS = 20;

/** Body size (bytes) above which the request is gzipped. */
export const GZIP_THRESHOLD = 1024;

/** Request timeout in milliseconds. */
export const TIMEOUT_MS = 1000;
