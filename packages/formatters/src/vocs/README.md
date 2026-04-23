# Vocs Formatter

Formatter preset for [Vocs](https://vocs.dev/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

The Vocs formatter uses MUI `<Chip>` for badges. Install MUI if it is not already a dependency of your project:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/vocs",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/vocs"
```

## Features

- **Vocs Components**: Uses MUI `<Chip>` for badges
- **Callout Syntax**: Uses Vocs' native callout syntax with `:::` markers
- **MDX Extension**: Generates `.mdx` files with JSX support
- **Responsive**: Optimized for Vocs' documentation framework

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const VocsMDX = require("@graphql-markdown/formatters/vocs");

const formatMDXBadge = ({ text }) => {
  return `<Chip label="${text}" />`;
};

module.exports = {
  ...VocsMDX,
  formatMDXBadge,
};
```

## Examples

See the complete implementation: [demo-vite-vocs](https://github.com/graphql-markdown/demo-vite-vocs)

## Links

- [Vocs Documentation](https://vocs.dev/)
