# Changelog

Versions of `@graphql-markdown/graphql`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.4.1

### Patch Changes

- [#3717](https://github.com/graphql-markdown/graphql-markdown/pull/3717) [`074bd7c`](https://github.com/graphql-markdown/graphql-markdown/commit/074bd7c388f687c2efb8d928ba9c62732bf581a2) - Relative module paths in the configuration are now resolved from the current working directory, like `rootPath` and `homepage`. This applies to `formatter` (for example `formatter: "./lib/custom-mdx.cjs"`), `loaders` and a custom diff module. They used to be resolved from the installed package folder, so the module failed to load: the default formatter was used, the loader failed, or the diff check was skipped.
  
  `runtimeModuleSpecifier()` in `@graphql-markdown/utils` now returns a relative path as a `file:` URL resolved from `process.cwd()`.
- Updated dependencies [[`1f860eb`](https://github.com/graphql-markdown/graphql-markdown/commit/1f860eb10a3e522f5ccc9718c05efea95df4dc53), [`074bd7c`](https://github.com/graphql-markdown/graphql-markdown/commit/074bd7c388f687c2efb8d928ba9c62732bf581a2)]:
  - @graphql-markdown/utils@1.14.5

## 1.4.0

### Minor Changes

- [#3663](https://github.com/graphql-markdown/graphql-markdown/pull/3663) [`3ce5fef`](https://github.com/graphql-markdown/graphql-markdown/commit/3ce5fefd46bea700cb694e15b3e783963d979dd9) - - `getSchemaEntity` no longer requires print options and unwraps `NonNull`/`List` types. `isEntity` decorator predicates and the decorator context `entity` now resolve wrapped (`List`/`NonNull`) types instead of returning undefined.
  - Export `toLink` from `@graphql-markdown/printer-legacy`, so custom formatters can build the same entity links as the printer.

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

- [#3636](https://github.com/graphql-markdown/graphql-markdown/pull/3636) [`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145) - Point documentation links at the reorganized graphql-markdown.dev pages (`/docs/customize/…`, `/docs/guides/…`, `/docs/reference/…`), so the CLI telemetry notice, the custom directive error message and the API reference no longer go through redirects.
- Updated dependencies [[`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/types@1.19.0
  - @graphql-markdown/utils@1.14.4

## 1.3.6

### Patch Changes

- [`d368bb7`](https://github.com/graphql-markdown/graphql-markdown/commit/d368bb793526bf4f0f408d288e3dbfbf62341c20) - Security fix (GHSA-8r4f-p963-7296): `getFormattedDefaultValue` now prints every string default as an escaped, single-line GraphQL string literal, the same as graphql-js `printSchema`. Before, a newline or a run of backticks in a `String` or `ID` default went into the generated code block unescaped, letting a schema author close the block and inject HTML or MDX. Defaults on non-null types (`String!`, `[String]!`) and string defaults of custom scalars, which were printed raw without quotes, are now quoted and escaped too, and list or object defaults of custom scalars are printed as escaped GraphQL list and object values instead of being joined raw or shown as `[object Object]`.
- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c), [`96c28b8`](https://github.com/graphql-markdown/graphql-markdown/commit/96c28b8add8c3ef38f5e884baec3b7d02134733c)]:
  - @graphql-markdown/types@1.18.0
  - @graphql-markdown/utils@1.14.3

## 1.3.5 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

- 🧩 **`@graphql-markdown/graphql`**: document loaders are all imported before any is registered, so a loader that fails to import no longer leaves the others half-configured ([#3575](https://github.com/graphql-markdown/graphql-markdown/pull/3575)).

## 1.3.4 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

- 🧩 **`@graphql-markdown/graphql`**: `graphql-config` is declared as an optional peer dependency. It was used without being declared ([#3486](https://github.com/graphql-markdown/graphql-markdown/pull/3486)).

## 1.3.3 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.3.2 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.3.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.3.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

const { getDirectiveFromSchema, getTypeDirectiveValuesList, hasDirectiveNamed } = require("@graphql-markdown/graphql");

`@graphql-markdown/graphql` exports the building blocks used above (`getDirectiveFromSchema`, `getTypeDirectiveValues`/`List`, `getTypeDirectiveArgValue`, and predicate helpers like `hasDirectiveNamed`, `and`, `or`, `not`, `isEntity`), and `@graphql-markdown/helpers` adds a ready-made `withDirective` decorator for the common case. Full reference and a step-by-step migration guide from `customDirective`: [docs/advanced/decorators](https://graphql-markdown.dev/docs/advanced/decorators) ([#3312](https://github.com/graphql-markdown/graphql-markdown/issues/3312)).

## 1.2.5 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.2.4 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.2.3 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.2.2 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.2.1 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).

- **Namespace detection regression** ([#2809](https://github.com/graphql-markdown/graphql-markdown/issues/2809)): fields whose return type is the root operation type (for example, a `Mutation` field returning `Mutation`) were incorrectly classified as namespace containers. This caused those fields to be omitted from operation lists and the root type to be stripped from the objects map. Fixed in `@graphql-markdown/graphql` (reported in [#2803](https://github.com/graphql-markdown/graphql-markdown/pull/2803) by [@artiom](https://github.com/artiom)).
