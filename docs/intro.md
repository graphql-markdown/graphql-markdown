---
sidebar_position: 10
pagination_next: get-started
hide_table_of_contents: true
---

# Introduction

The `@graphql-markdown/cli` package adds a CLI with commands for generating MDX using a GraphQL schema as the source. It simplifies creating and maintaining GraphQL API documentation by automatically generating well-structured documentation from your schema.

## Why GraphQL Markdown?

Managing API documentation can be time-consuming and prone to becoming outdated. This package solves these challenges by:
- Automatically generating documentation from your schema
- Keeping documentation in sync with your API
- Providing a consistent documentation structure
- Integrating seamlessly with Docusaurus

## Features

- Easy set up and customizable
- Full relations information between types
  - Visual representation of type relationships
  - Complete type hierarchy documentation
- Custom category sorting and organization
  - Alphabetical or custom ordering logic
  - Automatic folder numbering for consistent navigation
- MDX generated are fully customizable using MDX components
- Extensible hooks and events system
  - Native Node.js EventEmitter integration
  - Lifecycle hooks for custom workflows
- Use any schema loader compatible with `@graphql-tools/load`
  - Support for local schema files
  - Support for remote GraphQL endpoints
- Group types into categories using directives
  - Organize types logically
  - Create a custom navigation structure
- Support of GraphQL config
  - Integration with existing GraphQL setups
  - Consistent configuration across tools

## Quick Install

```bash
npm install @graphql-markdown/cli
```
