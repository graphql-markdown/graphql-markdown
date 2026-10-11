---
sidebar_position: 60
description: What anonymous usage data GraphQL-Markdown collects, how custom values are masked, and how to opt out.
keywords:
  - GraphQL-Markdown telemetry
  - anonymous usage data
  - opt out
  - DO_NOT_TRACK
  - GDPR
---

# Telemetry

GraphQL-Markdown collects **anonymous** usage data to learn which loaders, formatters and settings are used, so the project can focus on what matters. It is opt-out and easy to disable.

One event describes **which configuration is used to generate**, nothing more. There are no timings, no error reports and no data from your schema.

## What is collected

One event is sent for each distinct configuration, at most once per process. The same configuration run again on the same machine is not sent twice.

```json
{
  "v": 1,
  "event": "config",
  "pkg": "@graphql-markdown/core",
  "pkgVersion": "0.1.0",
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
    "skipDocDirective": [
      "<string>"
    ],
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

| Field                       | Meaning                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------- |
| `v`                         | Payload schema version.                                                                                 |
| `event`                     | `config`, `create_scaffold` or `create_wire`.                                                           |
| `pkg`, `pkgVersion`         | Package that reported the event and its version.                                                        |
| `nodeMajor`, `graphqlMajor` | Major versions only.                                                                                    |
| `os`, `pm`                  | Platform (`darwin`, `linux`, `win32`) and package manager (`npm`, `pnpm`, `yarn`, `bun`).               |
| `ci`, `ciProvider`          | Whether a CI environment was detected, and which one (see [CI behaviour](#ci-behaviour)).               |
| `firstRun`                  | `true` only when no telemetry preference file existed before the run. Never `true` in CI.               |
| `trigger`                   | Entry point: `cli`, `docusaurus-build`, `docusaurus-dev`, `nuxt` or `programmatic`.                     |
| `container`, `wsl`          | Running in a container or in WSL.                                                                       |
| `loader`                    | Kind of schema pointer: `url`, `git`, `github`, `file-sdl`, `file-json`, `code-file` (`.ts`, `.tsx`, `.js`, `.vue`, `.svelte`, `.astro`…), `glob`, `inline-sdl` or `unknown`. |
| `config`, `cli`             | The settings used, from the config sources and from CLI flags, with custom values masked.               |

## Masking

Settings are sent with their values, but every custom string, URL and path is replaced by a mask token. The rules are allowlist-first: anything not covered is masked.

| Value kind                                                                                                                                                                         | Sent as                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| boolean, number, `null`                                                                                                                                                            | as-is                                            |
| string in a known enum (`diffMethod`, `printTypeOptions.deprecated`, `hierarchy`, `docOptions.*` enums, `formatter` presets and `@graphql-markdown/*` packages, `homepage: false`) | as-is                                            |
| URL-like string (`baseURL`, schema URL, any `scheme://`)                                                                                                                           | `"<url>"`                                        |
| schema pointer (`schema`): a URL, git ref, GitHub repo, file, glob, code file or inline SDL. Local paths, git refs, URLs and request headers are never sent                       | `"<url>"`, `"<git>"`, `"<github>"`, `"<file:sdl>"`, `"<file:json>"`, `"<file:code>"`, `"<glob>"`, `"<inline-sdl>"` or `"<unknown>"` |
| path-like string (`rootPath`, `linkRoot`, `tmpDir`, `homepage`, a custom formatter path, anything containing `/`, `\` or a leading `.`)                                            | `"<path>"`                                       |
| `formatter` or `mdxParser` outside the `@graphql-markdown` ecosystem (a third-party package, a local path or a URL)                                                              | `"<custom-formatter>"`                           |
| schema loaders outside `@graphql-tools` (`loaders`)                                                                                                                                | `"<custom-loader>"`                              |
| any other string (directive names, `id`, `metatags`, `fallback`, front matter values)                                                                                              | `"<string>"`                                     |
| array                                                                                                                                                                              | array of sanitized items (length preserved)      |
| object with user-defined keys (`customDirective`, `decorators`, `metatags`, `frontMatter`, loader options)                                                                         | keys replaced with `"<key:n>"`, values sanitized |
| function or class instance (`outputAdapter`, hooks, decorator predicates)                                                                                                          | `"<function>"` or `"<object>"`                   |
| top-level key that is not a known setting                                                                                                                                          | dropped (only a count is kept, `unknownKeys`)    |

## What is never sent

- schema content: type, field or directive names, descriptions, counts
- raw paths, URLs or host names
- git remotes, project names or package names of your project
- error messages or stack traces
- environment variable values (only the presence of a CI vendor variable is checked)
- any identifier: no install ID, session ID, machine ID, user ID or hash of any of them

## Privacy and GDPR

The data is designed to be anonymous: nothing can be linked to a person, a device or an installation.

- No identifiers are collected, and no IP address is read, logged, hashed or stored by the collection endpoint. Cloudflare, as network provider, sees the IP address in transit only, which is transient transport processing and not collection.
- Values are coarse (enums, booleans, major versions or mask tokens). Timestamps are stored to the hour.
- Raw events are kept for about 3 months and then deleted automatically. After that, only aggregate daily counts remain.
- The only thing stored on your machine is `telemetry.json` in the OS config directory, with your preference, the version of the notice you saw and fingerprints of already-masked configurations used for de-duplication. It is never sent.
- As nothing is linkable to a person, there is nothing to access or erase. For questions, [open an issue](https://github.com/graphql-markdown/graphql-markdown/issues).

## Opting out

Telemetry is disabled by any of the following. They are checked in this order, and the first match wins; **user-level and environment signals always beat project configuration**.

1. `DO_NOT_TRACK=1` or `GRAPHQL_MARKDOWN_TELEMETRY_DISABLED=1` environment variable.
2. `gqlmd telemetry disable` (writes `telemetry.json`; undo with `gqlmd telemetry enable`).
3. Automatically in test runners: `VITEST`, `JEST_WORKER_ID`, `NODE_TEST_CONTEXT` or `NODE_ENV=test`.
4. [`telemetry: false`](/docs/settings#telemetry) in the GraphQL Config extension, the Docusaurus or Nuxt plugin options, or the programmatic options.
5. The `--no-telemetry` CLI flag.

`telemetry: true` only enables telemetry for programmatic use of `@graphql-markdown/core`; it never overrides any opt-out above.

Check the current state with:

```shell
gqlmd telemetry status
```

It prints, on stderr, whether telemetry is enabled, which source disabled it, the detected CI provider and the config directory.

### GitHub Actions

```yaml
env:
  GRAPHQL_MARKDOWN_TELEMETRY_DISABLED: "1"
```

## CI behaviour

Telemetry is enabled in CI by default, and reported separately so CI and local usage can be told apart (including docs builds on Vercel, Netlify and Cloudflare Pages).

- `ci: true` is sent together with `ciProvider` (`github-actions`, `gitlab`, `circleci`, `azure-pipelines`, `jenkins`, `bitbucket`, `buildkite`, `travis`, `vercel`, `netlify`, `cloudflare-pages`, `aws-codebuild`, `teamcity`, `appveyor`, `drone`, `render` or `other` for a generic `CI`). Only the presence of each vendor's variable is checked, never its value. `CI=false` or `CI=0` means not CI.
- Home directories are ephemeral in CI, so the notice is printed on every run, and at most one event per provider and configuration is sent per process.
- The opt-outs above work the same way.

## Notice

The first time telemetry runs (and when the notice version changes), this is printed to stderr, bypassing any custom logger:

```text
ℹ GraphQL-Markdown collects anonymous usage data to help improve the tool.
  Sent: package/Node versions, OS, schema loader type, and the settings you use.
  Custom strings, URLs and paths are masked; schema content is never sent.
  Details: https://graphql-markdown.dev/telemetry
  Opt out: `gqlmd telemetry disable` or DO_NOT_TRACK=1
```

Later runs print one line, `ℹ Anonymous telemetry enabled. Opt out: gqlmd telemetry disable`. Nothing is printed when telemetry is disabled. All telemetry output goes to stderr, never stdout.

## Debug

Set `GRAPHQL_MARKDOWN_TELEMETRY_DEBUG=1` to print the exact payload to stderr **instead of sending it**:

```shell
GRAPHQL_MARKDOWN_TELEMETRY_DEBUG=1 gqlmd graphql-to-doc
```

`GRAPHQL_MARKDOWN_TELEMETRY_ENDPOINT` overrides the endpoint URL. It is meant for maintainers (staging, local testing).

Telemetry never slows down or breaks a run: it runs in parallel with generation, with a 1 second timeout, and every error is swallowed.

## Telemetry changelog

| Payload `v` | Notice version | Changes                                                                                                                                                                    |
| ----------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1`         | `1`            | Initial payload: package, Node and GraphQL major versions, OS, package manager, CI flag and provider, trigger, container and WSL flags, loader kind (including `git` and `github`), masked configuration. |

The notice version is bumped, and the notice shown again, whenever a new category of data is added to the payload. Nothing carrying the new fields is sent before the new notice has been shown.
