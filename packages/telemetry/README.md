# @graphql-markdown/telemetry

Anonymous, opt-out usage telemetry for GraphQL-Markdown. Internal package: it is used by the CLI, the Docusaurus plugin and the Nuxt theme, not meant to be called directly.

- No runtime dependencies.
- Sends one event per distinct configuration; values are masked (URLs, paths and custom strings never leave the machine) and schema content is never read.
- No identifier of any kind is stored or sent.
- Opt out with `DO_NOT_TRACK=1`, `GRAPHQL_MARKDOWN_TELEMETRY_DISABLED=1`, `telemetry: false` or `--no-telemetry`.
- Disabled automatically in test runners (`VITEST`, `JEST_WORKER_ID`, `NODE_TEST_CONTEXT`, `NODE_ENV=test`).
- The endpoint is empty until the collector is live, so nothing is sent unless `GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT` is set.
- `GRAPHQL_MARKDOWN_TELEMETRY_DEBUG=1` prints the exact payload to stderr instead of sending it.

## Usage

```ts
import { track } from "@graphql-markdown/telemetry";

// never throws, never blocks on failure
void track({
  trigger: "cli",
  pkg: "@graphql-markdown/cli",
  pkgVersion,
  graphqlMajor,
  config,
  cli,
});
```

State (consent notice version and fingerprints of already-sent configs) is kept in `telemetry.json` in the OS config directory.

The `@graphql-markdown/telemetry/schema` subpath exports the payload allowlist (enums and mask tokens) as plain data.
