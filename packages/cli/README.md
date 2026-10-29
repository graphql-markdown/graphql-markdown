# @graphql-markdown/cli

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/cli?style=flat)](https://www.npmjs.com/package/@graphql-markdown/cli)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_cli&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_cli)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_cli&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_cli)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dcli)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=cli)

Command-line interface for generating **Markdown documentation** from **GraphQL schemas**. Part of the [GraphQL-Markdown](https://graphql-markdown.dev) toolset.

## Installation

```shell
npm install -g @graphql-markdown/cli
```

## Quick start

Create a [GraphQL-Config file](https://graphql-markdown.dev/docs/configuration#graphql-config) and run:

```shell
npx gqlmd graphql-to-doc
```

## Swizzle a formatter

Generate a custom formatter module seeded from a `@graphql-markdown/formatters` preset, then edit it freely:

```bash
gqlmd swizzle <preset> [--output <file>] [--force]
```

- `<preset>`: one of `docusaurus`, `docfx`, `fumadocs`, `honkit`, `hugo`, `mdbook`, `mdx`, `mkdocs`, `starlight`, `vocs`.
- `-o, --output <file>`: output file (default `./graphql-markdown.formatter.mjs`).
- `-f, --force`: overwrite the output file if it exists.

Example:

```bash
gqlmd swizzle hugo
```

Then set `formatter: "./graphql-markdown.formatter.mjs"` in the `extensions.graphql-markdown` section of your `.graphqlrc`.

## Documentation

- [Configuration Options](https://graphql-markdown.dev/docs/settings)
- [CLI Flags](https://graphql-markdown.dev/docs/configuration-cheatsheet#cli-flags)
- [Troubleshooting](https://graphql-markdown.dev/docs/troubleshooting)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
