# Hugo Formatter

Formatter preset for [Hugo](https://gohugo.io/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./content",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/hugo",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./content
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/hugo"
```

## Features

- **GitHub-style Alerts**: Uses `> [!NOTE]`, `> [!WARNING]`, etc. for admonitions
- **Markdown Extension**: Generates `.md` files
- **Extensionless Links**: Internal links omit file extensions for Hugo's URL handling
- **Frontmatter Support**: Includes YAML frontmatter for Hugo metadata
- **Responsive**: Optimized for Hugo's static site generation

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const HugoMDX = require("@graphql-markdown/formatters/hugo");

const formatMDXAdmonition = (admonition) => {
  const type = admonition.type.toUpperCase();
  return `> [!${type}]\n> ${admonition.text}`;
};

module.exports = {
  ...HugoMDX,
  formatMDXAdmonition,
};
```

## Links

- [Hugo Documentation](https://gohugo.io/)
