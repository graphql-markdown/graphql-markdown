# Changelog

Versions of `@graphql-markdown/core`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.28.0

### Minor Changes

- [#3683](https://github.com/graphql-markdown/graphql-markdown/pull/3683) [`44025b2`](https://github.com/graphql-markdown/graphql-markdown/commit/44025b22cf6e58244df2a5f05c3d25e6501b7055) - **⚠️ Breaking change:** report an error for unsupported settings in the configuration, including the removed `customDirective` and `mdxParser`, instead of silently ignoring them.

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

### Patch Changes

- [#3685](https://github.com/graphql-markdown/graphql-markdown/pull/3685) [`ae10ee0`](https://github.com/graphql-markdown/graphql-markdown/commit/ae10ee08c6a2df34995b4624401e16b4484fec7d) - Refer to the `formatter` setting, not the removed `mdxParser`, in the error reported when a formatter package fails to load.

- [#3684](https://github.com/graphql-markdown/graphql-markdown/pull/3684) [`ed44989`](https://github.com/graphql-markdown/graphql-markdown/commit/ed449895aeb3a041e20f62395a611627745be31c) - Generate the category index files of nested operation namespaces parent folder first, so custom output adapters and event handlers receive them in order.

- [#3695](https://github.com/graphql-markdown/graphql-markdown/pull/3695) [`bb05fe5`](https://github.com/graphql-markdown/graphql-markdown/commit/bb05fe587c05564de84e8c6bd1e140a3c6bb79d6) - List every unsupported setting in one error, instead of stopping at the first one, and suggest the closest supported setting for likely typos (for example `fromatter` → `formatter`).

- [#3636](https://github.com/graphql-markdown/graphql-markdown/pull/3636) [`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145) - Point documentation links at the reorganized graphql-markdown.dev pages (`/docs/customize/…`, `/docs/guides/…`, `/docs/reference/…`), so the CLI telemetry notice, the custom directive error message and the API reference no longer go through redirects.

- [#3664](https://github.com/graphql-markdown/graphql-markdown/pull/3664) [`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8) - Formatter functions exported next to a spread preset (`{ ...preset, formatMDXBadge }`) now override the ones built by the preset's `createMDXFormatter`. `formatMDXPermalink` now receives the generator `meta`, so spread Docusaurus presets keep version-aware permalinks.

- [#3668](https://github.com/graphql-markdown/graphql-markdown/pull/3668) [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c) - Add docsify formatter preset (`@graphql-markdown/formatters/docsify`) and accept `docsify` as a formatter value in CLI telemetry. The scaffolder can wire Docsify projects.

- [#3667](https://github.com/graphql-markdown/graphql-markdown/pull/3667) [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998) - Add zola formatter preset. The scaffolder can wire Zola projects.
- Updated dependencies [[`3ce5fef`](https://github.com/graphql-markdown/graphql-markdown/commit/3ce5fefd46bea700cb694e15b3e783963d979dd9), [`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145), [`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c), [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/graphql@1.4.0
  - @graphql-markdown/printer-legacy@1.21.0
  - @graphql-markdown/helpers@1.2.7
  - @graphql-markdown/telemetry@0.2.2
  - @graphql-markdown/types@1.19.0
  - @graphql-markdown/diff@1.1.26
  - @graphql-markdown/logger@1.1.6
  - @graphql-markdown/utils@1.14.4

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
