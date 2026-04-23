# Next.js Fumadocs Formatter

Formatter preset for Next.js with [Fumadocs](https://www.fumadocs.dev/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./content/docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/fumadocs",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./content/docs
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/fumadocs"
```

## Features

- **Fumadocs Components**: Uses `<Callout>` for admonitions and MUI `<Chip>` for badges
- **MDX Extension**: Generates `.mdx` files with JSX support
- **Responsive**: Tailored for Fumadocs' design system

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const FumadocsMDX = require("@graphql-markdown/formatters/fumadocs");

const formatMDXAdmonition = (admonition) => {
  // Your custom admonition logic
  return `<Callout type="info">${admonition.text}</Callout>`;
};

module.exports = {
  ...FumadocsMDX,
  formatMDXAdmonition,
};
```

## Examples

See the complete implementation: [demo-nextjs-fumadocs](https://github.com/graphql-markdown/demo-nextjs-fumadocs)

## Links

- [Fumadocs Documentation](https://www.fumadocs.dev/)
