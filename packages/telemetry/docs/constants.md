# constants

## Variables

### DEFAULT\_ENDPOINT

```ts
const DEFAULT_ENDPOINT: "https://gqlmd-telemetry.graphql-markdown.workers.dev/v1/event" =
  "https://gqlmd-telemetry.graphql-markdown.workers.dev/v1/event";
```

Defined in: [constants.ts:9](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/constants.ts#L9)

Telemetry endpoint: the Cloudflare Worker ingest (workers.dev, see
github.com/graphql-markdown/telemetry). Overridable with
`GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT`.

---

### GZIP\_THRESHOLD

```ts
const GZIP_THRESHOLD: 1024 = 1024;
```

Defined in: [constants.ts:16](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/constants.ts#L16)

Body size (bytes) above which the request is gzipped.

---

### MAX\_SENT\_CONFIGS

```ts
const MAX_SENT_CONFIGS: 20 = 20;
```

Defined in: [constants.ts:13](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/constants.ts#L13)

Number of config fingerprints kept in `telemetry.json`.

---

### NOTICE\_VERSION

```ts
const NOTICE_VERSION: 1 = 1;
```

Defined in: [constants.ts:2](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/constants.ts#L2)

Current consent notice version; bump when a new category of data is added.

---

### TIMEOUT\_MS

```ts
const TIMEOUT_MS: 1000 = 1000;
```

Defined in: [constants.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/constants.ts#L19)

Request timeout in milliseconds.
