---
sidebar_position: 10
pagination_next: try-it
hide_table_of_contents: true
description: Generate human-friendly Markdown/MDX documentation from GraphQL schemas. Easy setup, customizable output, and seamless Docusaurus integration.
keywords:
  - GraphQL
  - documentation generator
  - MDX
  - Docusaurus
  - API documentation
  - schema documentation
---

# Introduction

The `@graphql-markdown/cli` package adds a CLI with commands for generating MDX using a GraphQL schema as the source. It simplifies creating and maintaining GraphQL API documentation by automatically generating well-structured documentation from your schema.

## Why GraphQL Markdown?

Managing API documentation can be time-consuming and prone to becoming outdated. This package solves these challenges by:

- Automatically generating documentation from your schema
- Keeping documentation in sync with your API
- Providing a consistent documentation structure
- Integrating seamlessly with most of the MDX documentation frameworks

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

For **other MDX frameworks** (Astro, Next.js, etc.):

```bash
npm install @graphql-markdown/cli graphql
```
