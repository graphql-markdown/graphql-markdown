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

## Requirements

Admonitions use the `!!!` block syntax from the Python-Markdown [`admonition`](https://python-markdown.github.io/extensions/admonition/) extension. Enable it in your `mkdocs.yml`:

```yaml
markdown_extensions:
  - admonition
```

This works with any MkDocs theme that supports the extension, including Material for MkDocs and the ReadTheDocs theme.

## Features

- **Admonitions**: Uses Python-Markdown `!!!` block syntax (requires the `admonition` extension)
- **Collapsible Sections**: Uses HTML `<details>/<summary>` elements — no theme-specific plugin required
- **Markdown Extension**: Generates `.md` files
- **Frontmatter**: Renders the page title as a visible `# Heading` (MkDocs ignores YAML frontmatter by default)

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
