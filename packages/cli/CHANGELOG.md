# Changelog

Versions of `@graphql-markdown/cli`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.3.0

### Minor Changes

- [#3649](https://github.com/graphql-markdown/graphql-markdown/pull/3649) [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158) - **⚠️ Breaking change:** remove the configuration options `customDirective` (deprecated in [1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0)) and `mdxParser` (deprecated in [1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0)). Configurations that still set them now fail with an unsupported setting error. Use `decorators` and `formatter` instead, as shown in [Upgrade to 1.44](https://graphql-markdown.dev/docs/guides/upgrade-1-44).
  
  - **`customDirective`**:
    - Removed deprecated `customDirective` setting from configuration and CLI options; use `decorators` instead.
    - Removed custom directive type definitions (`CustomDirective`, `CustomDirectiveMap`, `CustomDirectiveMapItem`, `CustomDirectiveOptions`, `CustomDirectiveFunction`, `CustomDirectiveResolver`) from `@graphql-markdown/types`.
    - Removed custom directive helpers (`isCustomDirective`, `getCustomDirectiveOptions`, `getCustomDirectives`, `getConstDirectiveMap`, `WILDCARD_DIRECTIVE`) from `@graphql-markdown/graphql`.
    - Removed `buildCustomDirectiveDecorators` from `@graphql-markdown/printer-legacy`.
    - Removed `PageSections.customDirectives` from `@graphql-markdown/types`, and the reserved section names `customDirectives`, `customDirective:description` and `customDirective:tags` from `@graphql-markdown/printer-legacy`.
    - Removed `customDirective` telemetry sanitization rules from `@graphql-markdown/telemetry`.
    - Updated doc comments in `@graphql-markdown/helpers` to drop `customDirective` references.
  - **`mdxParser`**:
    - Removed deprecated `mdxParser` option and `--mdxParser` CLI flag; use `formatter` instead.
    - Removed `mdxParser` from `ConfigOptions` and `CliOptions` in `@graphql-markdown/types`.
    - Removed `mdxParser` telemetry sanitization rules from `@graphql-markdown/telemetry`.
    - Updated doc comments in `@graphql-markdown/formatters` to reference `formatter` instead of `mdxParser`.

### Patch Changes

- [#3668](https://github.com/graphql-markdown/graphql-markdown/pull/3668) [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c) - Add docsify formatter preset (`@graphql-markdown/formatters/docsify`) and accept `docsify` as a formatter value in CLI telemetry. The scaffolder can wire Docsify projects.

- [#3667](https://github.com/graphql-markdown/graphql-markdown/pull/3667) [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998) - Add zola formatter preset. The scaffolder can wire Zola projects.
- Updated dependencies [[`ae10ee0`](https://github.com/graphql-markdown/graphql-markdown/commit/ae10ee08c6a2df34995b4624401e16b4484fec7d), [`ed44989`](https://github.com/graphql-markdown/graphql-markdown/commit/ed449895aeb3a041e20f62395a611627745be31c), [`bb05fe5`](https://github.com/graphql-markdown/graphql-markdown/commit/bb05fe587c05564de84e8c6bd1e140a3c6bb79d6), [`44025b2`](https://github.com/graphql-markdown/graphql-markdown/commit/44025b22cf6e58244df2a5f05c3d25e6501b7055), [`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145), [`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c), [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/core@1.28.0
  - @graphql-markdown/telemetry@0.2.2
  - @graphql-markdown/types@1.19.0
  - @graphql-markdown/logger@1.1.6

## 1.2.3

### Patch Changes

- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c)]:
  - @graphql-markdown/types@1.18.0
  - @graphql-markdown/core@1.27.0
  - @graphql-markdown/logger@1.1.5
  - @graphql-markdown/telemetry@0.2.1

## 1.2.2 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 1.2.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.2.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

- **Scaffolder**: the command printed as the next step after wiring an existing site is now `npx -p @graphql-markdown/cli@latest gqlmd graphql-to-doc`. Before, `npx` could reuse an old cached CLI that had no `graphql-config`, so `.graphqlrc` was ignored ([#3426](https://github.com/graphql-markdown/graphql-markdown/pull/3426)).

## 1.1.2 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.1.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.1.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.0.3 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.0.2 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.0.1 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.0.0 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 0.7.1 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).
