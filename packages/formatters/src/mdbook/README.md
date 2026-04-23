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

- **No Frontmatter**: mdBook doesn't support YAML frontmatter; it renders the delimiters and content as raw text. Metadata is handled via `SUMMARY.md` and `book.toml` instead.
- **Blockquote Admonitions**: Uses `> **Note**` / `> **Warning**` blockquote style (compatible with all mdBook versions without plugins)
- **Markdown Extension**: Generates `.md` files
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
