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

- **DocFX Alerts**: Uses `> [!NOTE]`, `> [!WARNING]` alert syntax rendered by DocFX's Markdown pipeline (not GitHub's; the two share syntax but use separate renderers)
- **Markdown Extension**: Generates `.md` files
- **UID Frontmatter**: Injects a `uid` field derived from the page path for DocFX cross-reference resolution between pages
- **TOC Generation**: Builds `toc.yml` navigation files as pages are generated
- **Bootstrap Badges**: Badge variants map to Bootstrap 5 contextual classes (available in DocFX's modern template)

## Custom Overrides

To customize formatting behavior, create your own MDX module:

```js
// modules/custom-mdx.cjs
const preset = require("@graphql-markdown/formatters/docfx");

const formatMDXAdmonition = (admonition) => {
  // Map all admonitions to DocFX NOTE (e.g. for older DocFX versions)
  return `> [!NOTE]\n> ${admonition.text}`;
};

module.exports = {
  ...preset,
  formatMDXAdmonition,
};
```

The `uid` field in frontmatter is computed from `props.id` by the default formatter and rewritten to a path-derived value by the `afterRenderTypeEntitiesHook`. Override `formatMDXFrontmatter` only if you need to change the frontmatter structure beyond the `uid` field.

## Links

- [DocFX Documentation](https://dotnet.github.io/docfx/)
