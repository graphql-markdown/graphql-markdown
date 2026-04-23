# MkDocs Formatter

Formatter preset for [MkDocs](https://www.mkdocs.org/) with Material theme.

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
  mdxParser: "@graphql-markdown/formatters/mkdocs",
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
    mdxParser: "@graphql-markdown/formatters/mkdocs"
```

## Features

- **Material Admonitions**: Uses Material for MkDocs `!!!` syntax for admonitions
- **Collapsible Sections**: Uses `???` syntax for details/collapsible content
- **Markdown Extension**: Generates `.md` files
- **Frontmatter Support**: Includes YAML frontmatter for page metadata
- **Responsive**: Optimized for MkDocs' static site generation

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const MkDocsMDX = require("@graphql-markdown/formatters/mkdocs");

const formatMDXAdmonition = (admonition) => {
  const type = admonition.type.toLowerCase();
  return `!!! ${type}\n    ${admonition.text}`;
};

module.exports = {
  ...MkDocsMDX,
  formatMDXAdmonition,
};
```

## Links

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
