# API

This section provides documentation of the GraphQL-Markdown API for NodeJS. For more details about each individual module, refer to the specific package documentation below.

## Packages

GraphQL-Markdown is organized into several packages:

- [@graphql-markdown/cli](/api/category/graphql-markdowncli/) - Command-line interface for generating documentation
- [@graphql-markdown/core](/api/category/graphql-markdowncore/) - Core functionality and base classes
- [@graphql-markdown/docusaurus](/api/category/graphql-markdowndocusaurus/) - Docusaurus plugin and MDX formatters
- [@graphql-markdown/graphql](/api/category/graphql-markdowngraphql/) - GraphQL schema utilities and helpers
- [@graphql-markdown/helpers](/api/category/graphql-markdownhelpers/) - Helper functions for documentation generation
- [@graphql-markdown/printer-legacy](/api/category/graphql-markdownprinter-legacy/) - Legacy markdown printer implementation
- [@graphql-markdown/utils](/api/category/graphql-markdownutils/) - Utility functions and helpers

## Installation

```bash
npm install @graphql-markdown/cli
# or with your preferred package manager
yarn add @graphql-markdown/cli
```

## Basic Usage

Using the CLI:
```bash
graphql-markdown --schema ./schema.graphql --root ./docs
```

For programmatic usage, you can use the core package:
```typescript
import { GraphQLMarkdown } from '@graphql-markdown/core';

const config = {
  schema: './schema.graphql',
  rootPath: './docs',
};

const generator = new GraphQLMarkdown(config);
await generator.generate();
```

## Contributing

This documentation is intended primarily for those interested in:
- Contributing to the GraphQL-Markdown codebase
- Developing custom documentation generators
- Extending the base functionality
- Understanding the internal architecture
