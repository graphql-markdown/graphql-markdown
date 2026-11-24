# Changelog

Versions of `@graphql-markdown/utils`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.14.5

### Patch Changes

- [#3711](https://github.com/graphql-markdown/graphql-markdown/pull/3711) [`1f860eb`](https://github.com/graphql-markdown/graphql-markdown/commit/1f860eb10a3e522f5ccc9718c05efea95df4dc53) - Generated pages now separate blocks with exactly one blank line and no longer leave trailing spaces on headings and quote lines. Rendered output is unchanged.

- [#3717](https://github.com/graphql-markdown/graphql-markdown/pull/3717) [`074bd7c`](https://github.com/graphql-markdown/graphql-markdown/commit/074bd7c388f687c2efb8d928ba9c62732bf581a2) - Relative module paths in the configuration are now resolved from the current working directory, like `rootPath` and `homepage`. This applies to `formatter` (for example `formatter: "./lib/custom-mdx.cjs"`), `loaders` and a custom diff module. They used to be resolved from the installed package folder, so the module failed to load: the default formatter was used, the loader failed, or the diff check was skipped.
  
  `runtimeModuleSpecifier()` in `@graphql-markdown/utils` now returns a relative path as a `file:` URL resolved from `process.cwd()`.

## 1.14.4

### Patch Changes

- Updated dependencies [[`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/types@1.19.0

## 1.14.3

### Patch Changes

- [`96c28b8`](https://github.com/graphql-markdown/graphql-markdown/commit/96c28b8add8c3ef38f5e884baec3b7d02134733c) - Security fix (GHSA-x2g8-7ch4-h792): MDX special characters in schema descriptions are now always escaped outside real code. Before, a single unmatched backtick turned escaping off for the text before it, letting a schema author inject raw HTML or MDX into the generated pages. Code is now left unescaped only where Markdown is certain to parse it as code: inline code on a single line, and fenced code blocks starting at column 0 after the first line. Anything ambiguous is escaped, so its special characters show as HTML entities: inline code that wraps onto a second line, sits on a line with `|` or a link, or follows an unmatched backtick, and fenced code blocks that are indented, use `~~~`, or open the description.
- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c)]:
  - @graphql-markdown/types@1.18.0

## 1.14.2 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

1.42.0 sends less telemetry, fixes a slow-regex issue in `@graphql-markdown/utils`, and fixes generated pages for DocFX and Vocs.

- 🔒 **`@graphql-markdown/utils`**: `stringCaseBuilder` (behind `kebabCase` and `startCase`, used for page slugs and titles) could take polynomial time on long runs of letters and digits (ReDoS). Word splitting now runs in linear time with the same output ([#3547](https://github.com/graphql-markdown/graphql-markdown/pull/3547)).

## 1.14.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.14.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.13.3 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.13.2 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.13.1 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.13.0 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.12.2 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.12.1 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.12.0 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.11.0 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).

- Event base classes (`CancellableEvent`, `DataEvent`, `DataOutputEvent`) moved from `@graphql-markdown/core` -> `@graphql-markdown/utils`, making them available to downstream consumers.
