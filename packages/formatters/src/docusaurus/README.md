# Docusaurus Formatter

Formatter preset for [Docusaurus](https://docusaurus.io/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

### Via Docusaurus Plugin

Use the official Docusaurus integration package:

```bash
npm install @graphql-markdown/docusaurus
```

```js
// docusaurus.config.js
const path = require("node:path");

module.exports = {
  // ... other config
  plugins: [
    [
      "@graphql-markdown/docusaurus",
      {
        schema: path.join(__dirname, "schema.graphql"),
        rootPath: path.join(__dirname, "docs"),
        baseURL: "api",
      },
    ],
  ],
};
```

### Via Formatter Preset

If you prefer direct CLI usage without the plugin:

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/docusaurus",
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
    mdxParser: "@graphql-markdown/formatters/docusaurus"
```

## Features

- **MDX Components**: Uses Docusaurus-native components (Badge, Admonition, Details)
- **MDX Extension**: Generates `.mdx` files with JSX support
- **Details/Summary**: Collapsible sections use native `<details>/<summary>` HTML with custom CSS for label control
- **Sidebar Integration**: Automatically generates `_category_.yml` files for Docusaurus sidebar metadata

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// src/modules/custom-mdx.cjs
const DocusaurusMDX = require("@graphql-markdown/formatters/docusaurus");

const formatMDXBadge = ({ text, classname }) => {
  // Your custom badge logic
  return `<Badge variant="primary">${text}</Badge>`;
};

module.exports = {
  ...DocusaurusMDX,
  formatMDXBadge,
};
```

Then use it in your config:

```yaml
extensions:
  graphql-markdown:
    mdxParser: ./src/modules/custom-mdx.cjs
```

## Links

- [GraphQL-Markdown Docusaurus Plugin](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/docusaurus)
- [Docusaurus Documentation](https://docusaurus.io/)
