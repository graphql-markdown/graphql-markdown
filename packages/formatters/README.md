# @graphql-markdown/formatters

Framework formatter presets for GraphQL-Markdown.

This package provides ready-to-use `mdxParser` modules for popular documentation frameworks, with each formatter in its own package subpath.

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

Use any formatter in your GraphQL-Markdown configuration:

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/docusaurus"
```

Or programmatically:

```ts
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/docusaurus",
});
```

## Supported Formatters

Each formatter has its own setup guide:

| Framework | Package Path | Documentation |
|-----------|--------------|---|
| Docusaurus | `@graphql-markdown/formatters/docusaurus` | [Guide](src/docusaurus/README.md) |
| Astro Starlight | `@graphql-markdown/formatters/starlight` | [Guide](src/starlight/README.md) |
| Next.js + Fumadocs | `@graphql-markdown/formatters/fumadocs` | [Guide](src/fumadocs/README.md) |
| Vocs | `@graphql-markdown/formatters/vocs` | [Guide](src/vocs/README.md) |
| HonKit | `@graphql-markdown/formatters/honkit` | [Guide](src/honkit/README.md) |
| Hugo | `@graphql-markdown/formatters/hugo` | [Guide](src/hugo/README.md) |
| MkDocs | `@graphql-markdown/formatters/mkdocs` | [Guide](src/mkdocs/README.md) |
| DocFX | `@graphql-markdown/formatters/docfx` | [Guide](src/docfx/README.md) |
| mdBook | `@graphql-markdown/formatters/mdbook` | [Guide](src/mdbook/README.md) |

## Custom Formatter

For frameworks not listed above, create a custom MDX module. See the main [Integration Guide](/docs/advanced/integration-with-frameworks.md#custom-mdx-formatter) for details on the formatter contract and examples.

## Contributing

### Add a New Formatter

1. Create the formatter module at `src/<name>/index.ts`.
2. Create documentation at `src/<name>/README.md`.
3. Export the formatter from `src/index.ts`.
4. Add a package subpath export for `./<name>` in `package.json` under `exports`.
5. Add unit tests in `tests/unit/<name>/index.test.ts`.

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
