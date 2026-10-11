# Generic MDX Formatter

Framework-neutral formatter preset that generates valid `.mdx` pages: plain Markdown and JSX-safe HTML, with no framework components or imports.

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  formatter: "@graphql-markdown/formatters/mdx",
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
    formatter: "@graphql-markdown/formatters/mdx"
```

## Features

- **Valid MDX**: Header permalinks are escaped (`\{#id\}`) since an unescaped `{#id}` is an invalid MDX expression
- **No Components**: Badges, collapsible blocks and name entities are plain HTML; admonitions are blockquotes
- **Front Matter**: Standard YAML front matter is kept
- **Relative Links**: Internal links are rewritten to page-relative `.mdx` paths
- **MDX Extension**: Generates `.mdx` files

## Custom Overrides

```js
// modules/custom-mdx.cjs
const mdx = require("@graphql-markdown/formatters/mdx");

module.exports = {
  ...mdx,
  formatMDXBadge: ({ text }) => `<strong>${text}</strong>`,
};
```

## Links

- [MDX Documentation](https://mdxjs.com/)
