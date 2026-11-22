# API

This section provides documentation of the GraphQL-Markdown API for NodeJS. For more details about each individual module, refer to the specific package documentation below.

## Packages

GraphQL-Markdown is organized into several packages:

- [@graphql-markdown/cli](/api/category/graphql-markdowncli/) - Command-line interface for generating documentation
- [@graphql-markdown/core](/api/category/graphql-markdowncore/) - Core functionality and base classes
- [@graphql-markdown/diff](/api/diff) - Detects schema changes so only changed documentation is regenerated
- [@graphql-markdown/docusaurus](/api/category/graphql-markdowndocusaurus/) - Docusaurus plugin integration
- [@graphql-markdown/formatters](/api/category/graphql-markdownformatters/) - Formatter presets for all supported documentation frameworks
- [@graphql-markdown/graphql](/api/category/graphql-markdowngraphql/) - GraphQL schema utilities and helpers
- [@graphql-markdown/helpers](/api/category/graphql-markdownhelpers/) - Helper functions for documentation generation
- [@graphql-markdown/logger](/api/logger) - Logger used by the GraphQL-Markdown packages
- [@graphql-markdown/printer-legacy](/api/category/graphql-markdownprinter-legacy/) - Legacy markdown printer implementation
- [@graphql-markdown/telemetry](/api/category/graphql-markdowntelemetry/) - Anonymous, opt-out usage telemetry for the CLI
- [@graphql-markdown/utils](/api/category/graphql-markdownutils/) - Utility functions and helpers

## Installation

```bash
npm install @graphql-markdown/cli
# or with your preferred package manager
yarn add @graphql-markdown/cli
```

If you are targeting a formatter-based documentation stack such as Hugo, MkDocs, DocFX, or mdBook, also install `@graphql-markdown/formatters` and configure the `formatter` option.

## Basic Usage

Using the CLI:

```bash
npx gqlmd graphql-to-doc --schema ./schema.graphql --root ./docs
```

For programmatic usage, you can use the CLI package:

```typescript
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

const config = {
  schema: "./schema.graphql",
  rootPath: "./docs",
};

await runGraphQLMarkdown(config);
```

## Contributing

This documentation is intended primarily for those interested in:

- Contributing to the GraphQL-Markdown codebase
- Developing custom documentation generators
- Extending the base functionality
- Understanding the internal architecture
