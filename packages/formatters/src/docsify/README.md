# Docsify Formatter

Formatter preset for [Docsify](https://docsify.js.org/).

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
  baseURL: "graphql",
  formatter: "@graphql-markdown/formatters/docsify",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: graphql
    formatter: "@graphql-markdown/formatters/docsify"
```

## Docsify setup

Docsify v5 is required for callouts: use the `dist/` bundles (the `lib/` bundle has no callout support). The sidebar is generated at `docs/_sidebar.md`, so `index.html` must load it and alias nested sidebars to the root one:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsify@5/dist/themes/core.min.css"
/>
<div id="app"></div>
<script>
  window.$docsify = {
    name: "GraphQL API",
    loadSidebar: true,
    alias: { "/.*/_sidebar.md": "/_sidebar.md" },
  };
</script>
<script src="https://cdn.jsdelivr.net/npm/docsify@5/dist/docsify.min.js"></script>
```

## Features

- **No front matter**: Docsify prints front matter as text, so pages only start with a `# Title` heading
- **GitHub-style Alerts**: `> [!NOTE]`, `> [!WARNING]`, etc., rendered natively by Docsify v5
- **Root-absolute links**: internal links become `/<path>.md` Docsify routes (anchors are kept, external links are unchanged)
- **Folder indexes**: each category folder gets a `README.md` listing its pages
- **Generated sidebar**: `_sidebar.md` is written once all pages exist

## Custom Overrides

```js
// modules/custom-mdx.mjs
import * as DocsifyMDX from "@graphql-markdown/formatters/docsify";

export const formatMDXBadge = ({ text }) => `**${text}**`;

export default { ...DocsifyMDX, formatMDXBadge };
```

## Examples

- Live demo: [graphql-markdown.dev/demo-docsify](https://graphql-markdown.dev/demo-docsify/)
- Source: [demo-docsify](https://github.com/graphql-markdown/demo-docsify)

## Links

- [Docsify Documentation](https://docsify.js.org/)
