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

## Required Remark Plugins

The output assumes the MDX pipeline of your site understands the common remark conventions below. Without them, front matter and heading ids render as plain text.

- [`remark-frontmatter`](https://github.com/remarkjs/remark-frontmatter): parses the YAML front matter. Add [`remark-mdx-frontmatter`](https://github.com/remcohaszing/remark-mdx-frontmatter) as well if you want the front matter exposed as an export.
- [`remark-heading-id`](https://github.com/imcuttle/remark-heading-id): turns the heading permalinks (`{#id}`, written `\{#id\}` in the generated files) into heading ids.

Example for `@next/mdx` (`next.config.mjs`):

```js
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkHeadingId from "remark-heading-id";

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkHeadingId],
  },
});

export default withMDX({ pageExtensions: ["js", "jsx", "md", "mdx"] });
```

With Turbopack, pass the plugins by name instead (`remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter", "remark-heading-id"]`), since plugin functions cannot be serialized.

Example for Astro MDX (`astro.config.mjs`), which already parses front matter, so only heading ids need a plugin:

```js
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkHeadingId from "remark-heading-id";

export default defineConfig({
  integrations: [mdx({ remarkPlugins: [remarkHeadingId] })],
});
```

Check each plugin's documentation for its own options and for compatibility with your MDX version.

### Internal links

Internal links point at `.mdx` files (for example `../scalars/id.mdx`). They work in editors, on GitHub and with file-link resolvers. Sites that route by URL (no `.mdx` in the path) need a link resolver, or a rehype/remark plugin that maps file links to routes.

## Custom Overrides

```js
// modules/custom-mdx.cjs
// Omit `createMDXFormatter`: when present, it is used instead of the
// individual exports, so overrides placed next to it would be ignored.
const {
  createMDXFormatter,
  ...mdx
} = require("@graphql-markdown/formatters/mdx");

module.exports = {
  ...mdx,
  formatMDXBadge: ({ text }) => `<strong>${text}</strong>`,
};
```

## Links

- [MDX Documentation](https://mdxjs.com/)
