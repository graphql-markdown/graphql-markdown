# @graphql-markdown/telemetry

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/telemetry?style=flat)](https://www.npmjs.com/package/@graphql-markdown/telemetry)
[![JSR](https://jsr.io/badges/@graphql-markdown/telemetry)](https://jsr.io/@graphql-markdown/telemetry)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dtelemetry)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=telemetry)

Anonymous, opt-out usage telemetry for [GraphQL-Markdown](https://graphql-markdown.dev). Internal package: it is used by the CLI, the Docusaurus plugin, the Nuxt theme and the `create-graphql-markdown-docs` scaffolder, not meant to be called directly.

- No runtime dependencies.
- Sends one event per distinct configuration; values are masked (URLs, paths and custom strings never leave the machine) and schema content is never read.
- No identifier of any kind is stored or sent.
- Opt out with `DO_NOT_TRACK=1`, `GRAPHQL_MARKDOWN_TELEMETRY_DISABLED=1`, `telemetry: false` or `--no-telemetry`.
- Disabled automatically in test runners (`VITEST`, `JEST_WORKER_ID`, `NODE_TEST_CONTEXT`, `NODE_ENV=test`).
- Events are sent to the Cloudflare Worker ingest (`gqlmd-telemetry.graphql-markdown.workers.dev`, see [graphql-markdown/telemetry](https://github.com/graphql-markdown/telemetry)); set `GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT` to override it.
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

## Payload example

Your configuration is never sent as-is. Each value is replaced by a mask token. The example below was generated from the real payload builder with the configuration shown.

Your config:

```json
{
  "schema": "https://api.acme.internal/graphql",
  "rootPath": "./docs",
  "baseURL": "/api",
  "linkRoot": "/docs",
  "homepage": "./intro.md",
  "formatter": "@graphql-markdown/docusaurus",
  "skipDocDirective": ["@internal"],
  "groupByDirective": {
    "directive": "doc",
    "field": "category",
    "fallback": "Common"
  },
  "printTypeOptions": { "deprecated": "group", "typeBadges": true },
  "metatags": [{ "name": "robots", "content": "noindex" }],
  "loaders": { "UrlLoader": "@graphql-tools/url-loader" }
}
```

What is sent (CLI options `{ "force": true }`, trigger `cli`, GraphQL 16):

```json
{
  "v": 1,
  "event": "config",
  "pkg": "@graphql-markdown/cli",
  "pkgVersion": "0.1",
  "nodeMajor": 24,
  "graphqlMajor": 16,
  "os": "darwin",
  "ci": false,
  "pm": "unknown",
  "firstRun": false,
  "trigger": "cli",
  "container": false,
  "wsl": false,
  "config": {
    "schema": "<url>",
    "rootPath": "<path>",
    "baseURL": "<url>",
    "linkRoot": "<path>",
    "homepage": "<path>",
    "formatter": "@graphql-markdown/docusaurus",
    "skipDocDirective": ["<string>"],
    "groupByDirective": {
      "directive": "<string>",
      "field": "<string>",
      "fallback": "<string>"
    },
    "printTypeOptions": {
      "deprecated": "group",
      "typeBadges": true
    },
    "metatags": [
      {
        "<key:0>": "<string>",
        "<key:1>": "<string>"
      }
    ],
    "loaders": {
      "UrlLoader": "@graphql-tools/url-loader"
    }
  },
  "loader": "url",
  "cli": {
    "force": true
  }
}
```

Masking rules:

- `<url>`, `<git>`, `<github>`: the kind of a schema pointer, or a URL value (for example `baseURL`). The host, path and any headers are never sent.
- `<file:sdl>`, `<file:json>`, `<file:code>`, `<glob>`, `<inline-sdl>`, `<unknown>`: the kind of a schema pointer (for example `schema`). The pointer itself is never sent.
- `<custom-formatter>`: a third-party or local `formatter` or `mdxParser`. Only presets and `@graphql-markdown/*` packages are kept as-is.
- `<path>`: a filesystem path (for example `rootPath`, `linkRoot`, `homepage`).
- `<string>`: a custom string (for example directive names, field names, fallback labels, metatag values).
- `<key:n>`: a custom object key, replaced by its position (for example metatag names). Only present when a custom key is used.

No identifier, IP address, schema content or path is ever included. Names from the allowlist (such as the formatter and loader names, or boolean and enum options) are kept as-is.

To print your own payload instead of sending it, set `GRAPHQL_MARKDOWN_TELEMETRY_DEBUG=1`. The exact payload is written to stderr.

## Documentation

- [Telemetry](https://graphql-markdown.dev/docs/telemetry)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
