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

## Requirements

Alert rendering requires Hugo 0.132 or later with the GitHub-style blockquote alert render hook enabled (included in Hugo's default configuration since 0.132).

## Features

- **GitHub-style Alerts**: Uses `> [!NOTE]`, `> [!WARNING]`, etc. syntax rendered as styled callouts by Hugo's built-in alert hook (Hugo 0.132+)
- **Markdown Extension**: Generates `.md` files
- **Extensionless Links**: Internal links omit file extensions to match Hugo's URL routing
- **Frontmatter Support**: Includes YAML frontmatter for Hugo page metadata

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
