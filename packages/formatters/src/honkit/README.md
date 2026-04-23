# HonKit Formatter

Formatter preset for [HonKit](https://honkit.io/).

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
  mdxParser: "@graphql-markdown/formatters/honkit",
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
    mdxParser: "@graphql-markdown/formatters/honkit"
```

## Features

- **Markdown Extension**: Generates `.md` files (not `.mdx`)
- **HTML Links**: Uses `.html` extension for internal links
- **GraphQL Schema Introspection**: Includes `beforeComposePageTypeHook` for advanced schema integration
- **No Frontmatter**: HonKit doesn't use frontmatter by default
- **Responsive**: Optimized for HonKit's documentation framework

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const HonKitMDX = require("@graphql-markdown/formatters/honkit");

const formatMDXLink = ({ text, url }) => {
  return { text, url: url.replace(/\.html$/, "") };
};

module.exports = {
  ...HonKitMDX,
  formatMDXLink,
};
```

## Hooks

The HonKit formatter includes the `beforeComposePageTypeHook` which allows you to customize how type pages are composed with GraphQL schema introspection data.

## Examples

See the complete implementation: [demo-honkit](https://github.com/graphql-markdown/demo-honkit)

## Links

- [HonKit Documentation](https://honkit.io/)
