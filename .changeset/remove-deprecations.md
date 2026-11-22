---
"@graphql-markdown/cli": minor
"@graphql-markdown/core": minor
"@graphql-markdown/graphql": minor
"@graphql-markdown/printer-legacy": minor
"@graphql-markdown/types": minor
"@graphql-markdown/formatters": patch
"@graphql-markdown/helpers": patch
"@graphql-markdown/telemetry": patch
---

**⚠️ Breaking change:** remove the deprecated configuration options `customDirective` and `mdxParser`. Configurations that still set them now fail with an unsupported setting error. Use `decorators` and `formatter` instead.

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
