---
sidebar_position: 10
pagination_next: try-it
hide_table_of_contents: true
description: Generate human-friendly Markdown and MDX documentation from GraphQL schemas for Docusaurus and supported formatter-based documentation ecosystems.
keywords:
  - GraphQL
  - documentation generator
  - MDX
  - Docusaurus
  - API documentation
  - schema documentation
---

# Introduction

GraphQL-Markdown generates Markdown and MDX documentation from a GraphQL schema. You can use the official Docusaurus integration for Docusaurus sites, or use the CLI with formatter presets for other supported documentation ecosystems such as Hugo, MkDocs, DocFX, and mdBook.

## Why GraphQL Markdown?

Managing API documentation can be time-consuming and prone to becoming outdated. This package solves these challenges by:

- Automatically generating documentation from your schema
- Keeping documentation in sync with your API
- Providing a consistent documentation structure
- Integrating with Docusaurus and supported formatter-based documentation ecosystems

## Features

- Easy set up and customizable output
- Full cross-linking between types with visual relationship hierarchy
- MDX output fully customizable using your own components
- Extensible lifecycle hooks and events system
- Any schema loader compatible with `@graphql-tools/load` — SDL files, remote endpoints, or code-first TS/JS schemas
- Group types into categories using directives
- Namespaced operations (nested query/mutation/subscription objects)
- GraphQL config support

## Quick Install

For **Docusaurus** projects:

```bash
npm install @graphql-markdown/docusaurus graphql
```

For **formatter-based setups** (Hugo, MkDocs, DocFX, mdBook, Astro, Next.js, etc.):

```bash
npm install @graphql-markdown/cli @graphql-markdown/formatters graphql
```

For the full list of supported formatter presets, see [Integration with Frameworks](/docs/advanced/integration-with-frameworks).
