# DocFX Formatter

Formatter preset for [DocFX](https://dotnet.github.io/docfx/).

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
  mdxParser: "@graphql-markdown/formatters/docfx",
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
    mdxParser: "@graphql-markdown/formatters/docfx"
```

## Features

- **DocFX Alerts**: Uses `> [!NOTE]`, `> [!WARNING]` syntax compatible with DocFX
- **Markdown Extension**: Generates `.md` files
- **UID Frontmatter**: Includes `uid` field in frontmatter for DocFX reference linking
- **Responsive**: Optimized for DocFX's static site generation
- **Type Linking**: Enhanced support for DocFX's cross-reference linking

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const DocFXMDX = require("@graphql-markdown/formatters/docfx");

const formatMDXFrontmatter = (props, formatted) => {
  const lines = [
    "---",
    `uid: ${props.uid}`,
    `title: ${props.title}`,
    ...formatted,
    "---",
  ];
  return lines.join("\n");
};

module.exports = {
  ...DocFXMDX,
  formatMDXFrontmatter,
};
```

## Links

- [DocFX Documentation](https://dotnet.github.io/docfx/)
