# Zola Formatter

Formatter preset for [Zola](https://www.getzola.org/).

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
  baseURL: "graphql",
  formatter: "@graphql-markdown/formatters/zola",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./content
    baseURL: graphql
    formatter: "@graphql-markdown/formatters/zola"
```

## Requirements

Zola section pages (`_index.md`) and pages need templates that render the page content (for example `{{ page.content | safe }}` and `{{ section.content | safe }}`), and sections list their pages sorted by title (`sort_by: "title"`).

## Features

- **Strict front matter**: Only keys Zola accepts at the top level (`title`, `description`, `date`, `updated`, `weight`, `draft`, `slug`, `path`, `aliases`, `template`, `in_search_index`, `render`, `authors`, `taxonomies`) stay on top. Every other key (such as `id`) is nested under `extra:`. A visible `# Title` heading follows the front matter.
- **Checked internal links**: Internal links become `@/<path>.md`, which Zola validates at build time. External, `mailto:` and `#anchor` links are unchanged.
- **Blockquote admonitions**: Rendered as a blockquote with a bold title, without `[!TYPE]` alerts.
- **Section index**: `_index.md` is written with `title` and `sort_by: "title"`.
- **Markdown Extension**: Generates `.md` files.

## Custom Overrides

```js
// modules/custom-mdx.mjs

export * from "@graphql-markdown/formatters/zola";

export const formatMDXAdmonition = (admonition) => `> ${admonition.text}`;
```

## Examples

See the complete implementation: [demo-zola](https://github.com/graphql-markdown/demo-zola) and the [live demo](https://graphql-markdown.dev/demo-zola/).

## Links

- [Zola Documentation](https://www.getzola.org/documentation/)
