# mdBook Formatter

Formatter preset for [mdBook](https://rust-lang.github.io/mdBook/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./src",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/mdbook",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./src
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/mdbook"
```

## Features

- **No Frontmatter**: mdBook doesn't support frontmatter; content is rendered as documentation
- **Blockquote Admonitions**: Uses blockquote syntax for admonitions
- **Markdown Extension**: Generates `.md` files
- **Responsive**: Optimized for mdBook's Rust documentation framework
- **Simplicity**: Minimal configuration for straightforward documentation

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const mdBookMDX = require("@graphql-markdown/formatters/mdbook");

const formatMDXAdmonition = (admonition) => {
  return `> **${admonition.title}**\n>\n> ${admonition.text}`;
};

module.exports = {
  ...mdBookMDX,
  formatMDXAdmonition,
};
```

## Notes

Since mdBook doesn't support frontmatter, metadata (title, description, etc.) is typically handled through mdBook's `SUMMARY.md` file for navigation and book.toml for configuration.

## Links

- [mdBook Documentation](https://rust-lang.github.io/mdBook/)
