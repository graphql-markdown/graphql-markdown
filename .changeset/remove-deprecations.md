---
"@graphql-markdown/cli": major
"@graphql-markdown/core": major
"@graphql-markdown/graphql": major
"@graphql-markdown/printer-legacy": major
"@graphql-markdown/types": major
"@graphql-markdown/formatters": patch
"@graphql-markdown/helpers": patch
"@graphql-markdown/telemetry": patch
---

Remove deprecated configuration options `customDirective` and `mdxParser`.

- **`customDirective`**:
  - Removed deprecated `customDirective` setting from configuration and CLI options; use `decorators` instead.
  - Removed custom directive type definitions (`CustomDirective`, `CustomDirectiveMap`, `CustomDirectiveMapItem`, `CustomDirectiveOptions`, `CustomDirectiveFunction`, `CustomDirectiveResolver`) from `@graphql-markdown/types`.
  - Removed custom directive helpers (`isCustomDirective`, `getCustomDirectiveOptions`, `getCustomDirectives`, `getConstDirectiveMap`, `WILDCARD_DIRECTIVE`) from `@graphql-markdown/graphql`.
  - Removed `buildCustomDirectiveDecorators` from `@graphql-markdown/printer-legacy`.
  - Removed `customDirective` and `customDirectives` sections and telemetry sanitization rules.
  - Updated directive helpers in `@graphql-markdown/helpers` to reference `decorators`.
- **`mdxParser`**:
  - Removed deprecated `mdxParser` option and `--mdx-parser` CLI flag; use `formatter` instead.
  - Removed `mdxParser` references in `@graphql-markdown/formatters` and telemetry sanitization rules.
- **Renderer Refactoring**:
  - Refactored `renderer.ts` by extracting helper constants and functions into `rendererHelpers.ts`.
