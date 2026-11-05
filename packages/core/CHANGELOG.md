# Changelog

Versions of `@graphql-markdown/core`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

This file is generated from the root `CHANGELOG.md` by `.github/scripts/package-changelogs.mts`. Do not edit it by hand.

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
