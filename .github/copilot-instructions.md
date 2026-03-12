# GitHub Copilot Instructions for graphql-markdown

## Setup Steps
1. Clone and Install
2. Verify Setup
3. Build Packages

## Project Overview

GraphQL-Markdown is a flexible tool for generating Markdown documentation from GraphQL schemas, designed for static site generators like Docusaurus.
### Core Architecture & Data Flow

The documentation generation follows an event-driven architecture with three main stages:

1. **Schema Loading** (`@graphql-markdown/graphql`) - Loads GraphQL schema from various sources (files, URLs, introspection)
2. **Documentation Generation** (`@graphql-markdown/core`) - Processes schema through a pipeline:
3. **Integration Layer** (`@graphql-markdown/cli` or `@graphql-markdown/docusaurus`) - Exposes functionality via CLI or Docusaurus plugin

**Key Design Pattern**: Events are cancellable and execute handlers sequentially, allowing plugins to modify or prevent operations (see [core/src/event-emitter.ts](packages/core/src/event-emitter.ts)).

### Unit Tests
- Run with: `bun run test` (runs all test types)

### Smoke Tests (E2E)
- Validate CLI options and complete workflows with `earthly +smoke-cli-test`
- Run with: `earthly +smoke-docusaurus-test` for Docusaurus plugin
