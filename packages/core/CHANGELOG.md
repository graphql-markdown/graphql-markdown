# Changelog

Versions of `@graphql-markdown/core`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.27.0

### Minor Changes

- [#3601](https://github.com/graphql-markdown/graphql-markdown/pull/3601) [`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c) - Add the optional `formatMDXTitle` formatter function to print a visible page title after the front matter, for frameworks that do not render the front matter `title`. The DocFX preset uses it to print a `# Title` heading, so generated DocFX pages are no longer missing their title. The title is printed in a new `title` page section, after the front matter whatever the `frontMatter` option, so `print:beforeComposePageType` handlers can change or remove it. `title` is therefore a reserved section id: a decorator with the id `title` is now rejected like the other built-in section ids.

### Patch Changes

- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c), [`96c28b8`](https://github.com/graphql-markdown/graphql-markdown/commit/96c28b8add8c3ef38f5e884baec3b7d02134733c), [`d368bb7`](https://github.com/graphql-markdown/graphql-markdown/commit/d368bb793526bf4f0f408d288e3dbfbf62341c20), [`d368bb7`](https://github.com/graphql-markdown/graphql-markdown/commit/d368bb793526bf4f0f408d288e3dbfbf62341c20), [`510487d`](https://github.com/graphql-markdown/graphql-markdown/commit/510487d9ca9cd7fb206feca9fd45f1f3bbee4d5f), [`9383078`](https://github.com/graphql-markdown/graphql-markdown/commit/93830782bb090c7cfe82004ce09e0a5702868d44), [`f4da8ad`](https://github.com/graphql-markdown/graphql-markdown/commit/f4da8ad30fce5c9e001d082f0580a15968b6fd70)]:
  - @graphql-markdown/types@1.18.0
  - @graphql-markdown/printer-legacy@1.20.0
  - @graphql-markdown/utils@1.14.3
  - @graphql-markdown/graphql@1.3.6
  - @graphql-markdown/diff@1.1.25
  - @graphql-markdown/helpers@1.2.6
  - @graphql-markdown/logger@1.1.5
  - @graphql-markdown/telemetry@0.2.1

## 1.26.1 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 1.26.0 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

> **`@graphql-markdown/core` 1.26.0: `ASSET_HOMEPAGE_LOCATION` is now a symbol.** It used to be the path of the default homepage template. It is now a `unique symbol` that means "use the built-in homepage template", and `Options.homepageLocation` is typed `string | symbol`. If your code reads `ASSET_HOMEPAGE_LOCATION` or `homepageLocation` as a file path (for example with `fs.readFile`), check for the symbol first. A string path still loads your own template, and the generated file name is unchanged. The CLI, the Docusaurus plugin and the Nuxt theme need no change ([#3486](https://github.com/graphql-markdown/graphql-markdown/pull/3486)).

deno add jsr:@graphql-markdown/core   # Deno

npx jsr add @graphql-markdown/core    # Node.js

bunx jsr add @graphql-markdown/core   # Bun

## 1.25.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.24.1 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.24.0 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.23.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.22.0 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.21.2 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.21.1 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.21.0 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.20.0 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).

- Event base classes (`CancellableEvent`, `DataEvent`, `DataOutputEvent`) moved from `@graphql-markdown/core` -> `@graphql-markdown/utils`, making them available to downstream consumers.
