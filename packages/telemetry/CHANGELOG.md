# Changelog

Versions of `@graphql-markdown/telemetry`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 0.2.2

### Patch Changes

- [#3636](https://github.com/graphql-markdown/graphql-markdown/pull/3636) [`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145) - Point documentation links at the reorganized graphql-markdown.dev pages (`/docs/customize/…`, `/docs/guides/…`, `/docs/reference/…`), so the CLI telemetry notice, the custom directive error message and the API reference no longer go through redirects.

- [#3668](https://github.com/graphql-markdown/graphql-markdown/pull/3668) [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c) - Add docsify formatter preset (`@graphql-markdown/formatters/docsify`) and accept `docsify` as a formatter value in CLI telemetry. The scaffolder can wire Docsify projects.

- [#3667](https://github.com/graphql-markdown/graphql-markdown/pull/3667) [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998) - Add zola formatter preset. The scaffolder can wire Zola projects.

- [#3649](https://github.com/graphql-markdown/graphql-markdown/pull/3649) [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158) - **⚠️ Breaking change:** remove the deprecated configuration options `customDirective` and `mdxParser`. Configurations that still set them now fail with an unsupported setting error. Use `decorators` and `formatter` instead.
  
  - **`customDirective`**:
    - Removed deprecated `customDirective` setting from configuration and CLI options; use `decorators` instead.
    - Removed custom directive type definitions (`CustomDirective`, `CustomDirectiveMap`, `CustomDirectiveMapItem`, `CustomDirectiveOptions`, `CustomDirectiveFunction`, `CustomDirectiveResolver`) from `@graphql-markdown/types`.
    - Removed custom directive helpers (`isCustomDirective`, `getCustomDirectiveOptions`, `getCustomDirectives`, `getConstDirectiveMap`, `WILDCARD_DIRECTIVE`) from `@graphql-markdown/graphql`.
    - Removed `buildCustomDirectiveDecorators` from `@graphql-markdown/printer-legacy`.
    - Removed `PageSections.customDirectives` from `@graphql-markdown/types`, and the reserved section names `customDirectives`, `customDirective:description` and `customDirective:tags` from `@graphql-markdown/printer-legacy`.
    - Removed `customDirective` telemetry sanitization rules from `@graphql-markdown/telemetry`.
    - Updated doc comments in `@graphql-markdown/helpers` to drop `customDirective` references.
  - **`mdxParser`**:
    - Removed deprecated `mdxParser` option and `--mdx-parser` CLI flag; use `formatter` instead.
    - Removed `mdxParser` from `ConfigOptions` and `CliOptions` in `@graphql-markdown/types`.
    - Removed `mdxParser` telemetry sanitization rules from `@graphql-markdown/telemetry`.
    - Updated doc comments in `@graphql-markdown/formatters` to reference `formatter` instead of `mdxParser`.
- Updated dependencies [[`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/types@1.19.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c)]:
  - @graphql-markdown/types@1.18.0

## 0.2.0 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

> **`@graphql-markdown/telemetry` 0.2.0.** Telemetry now reports the package version as `major.minor` only (for example `1.42`), and no longer sends how many schema pointers or metatags a configuration has ([#3533](https://github.com/graphql-markdown/graphql-markdown/pull/3533), [#3543](https://github.com/graphql-markdown/graphql-markdown/pull/3543)). See [Telemetry](https://graphql-markdown.dev/docs/telemetry) for what is collected and how to opt out.

## 0.1.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 0.1.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).
