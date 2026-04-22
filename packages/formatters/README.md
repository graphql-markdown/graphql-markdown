# @graphql-markdown/formatters

Formatter presets for GraphQL-Markdown.

This package provides ready-to-use `mdxParser` modules for common documentation frameworks.

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Available Presets

Use one of these values in GraphQL-Markdown `mdxParser` configuration:

| Framework       | `mdxParser` value                         |
| --------------- | ----------------------------------------- |
| Docusaurus      | `@graphql-markdown/formatters/docusaurus` |
| Astro Starlight | `@graphql-markdown/formatters/starlight`  |
| Fumadocs        | `@graphql-markdown/formatters/fumadocs`   |
| Vocs            | `@graphql-markdown/formatters/vocs`       |
| HonKit          | `@graphql-markdown/formatters/honkit`     |
| Hugo            | `@graphql-markdown/formatters/hugo`       |
| MkDocs          | `@graphql-markdown/formatters/mkdocs`     |
| DocFX           | `@graphql-markdown/formatters/docfx`      |
| mdBook          | `@graphql-markdown/formatters/mdbook`     |

## Usage

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/mkdocs"
```

### Programmatic API

```ts
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/docfx",
});
```

## Contributing

### Add a New Formatter

1. Create the formatter module at `src/<name>/index.ts`.
2. Export the formatter from `src/index.ts`.
3. Add a package subpath export for `./<name>` in `package.json` under `exports`.
4. Add unit tests in `tests/unit/<name>/index.test.ts`.

### Formatter Contract

A formatter module should export `createMDXFormatter` and may also export individual formatter helpers:

- `formatMDXBadge`
- `formatMDXAdmonition`
- `formatMDXBullet`
- `formatMDXDetails`
- `formatMDXFrontmatter`
- `formatMDXLink`
- `formatMDXNameEntity`
- `formatMDXSpecifiedByLink`

Optional exports:

- `mdxDeclaration`
- `mdxExtension`
- lifecycle hooks (for advanced customization)

For `formatMDXDetails`, keep a single standalone `\r` delimiter in the returned string to split open and close content correctly.

### Testing Checklist

Add tests that verify:

1. Each formatter function output for representative inputs.
2. `createMDXFormatter` returns all required formatter methods.
3. Framework-specific behavior and edge cases (for example link extension mapping, frontmatter behavior, empty title fallback).

Run targeted tests while developing:

```bash
cd packages/formatters
bun run test:unit -- tests/unit/<name>/index.test.ts
```

Run package checks before opening a PR:

```bash
cd packages/formatters
bun run lint
bun run prettier
bun run test:unit
```

For repository-wide validation:

```bash
cd /path/to/graphql-markdown
bun run test
```
