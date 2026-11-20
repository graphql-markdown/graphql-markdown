---
sidebar_position: 40
description: Write a custom MDX formatter module for any documentation framework, or extend a formatter preset. Covers the module contract, the formatMDXDetails delimiter, and lifecycle hooks.
keywords:
  - custom MDX formatter
  - formatter module
  - formatMDXDetails
  - extend formatter preset
---

# Custom formatter

Use a custom formatter module for frameworks without a preset, or to change how a preset renders pages. It exports the formatter functions below and falls back to the defaults for the rest.

## MDX Module Contract

A custom MDX module can export individual formatter functions:

| Export                     | Type                                                              | Description                                                                                                                                     |
| -------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `formatMDXBadge`           | `(badge: { text, classname? }) => string`                         | Format type badges (deprecated, required, etc.)                                                                                                 |
| `formatMDXAdmonition`      | `(admonition: { text, title, type, icon? }, meta?) => string`     | Format callout/warning blocks                                                                                                                   |
| `formatMDXBullet`          | `(text?: string) => string`                                       | Format bullet point separators                                                                                                                  |
| `formatMDXDetails`         | `(option: { dataOpen, dataClose? }) => string`                    | Format collapsible sections                                                                                                                     |
| `formatMDXFrontmatter`     | `(props?, formatted?: string[], context?: { entity? }) => string` | Format page frontmatter; `context.entity` is the page's entity kind (e.g. `objects`, `queries`)                                                 |
| `formatMDXLink`            | `(link: { text, url }) => { text, url }`                          | Transform type links                                                                                                                            |
| `formatMDXNameEntity`      | `(name: string, parentType?: string) => string`                   | Format named entity references                                                                                                                  |
| `formatMDXPermalink`       | `(id: string) => string`                                          | Format section header permalinks                                                                                                                |
| `formatMDXSpecifiedByLink` | `(url: string) => string`                                         | Format scalar specification links. Receives an absolute `http(s)` URL; encode it for where you write it (for example as an HTML attribute)      |
| `formatMDXTitle`           | `(title: string) => string`                                       | Optional: format a visible page title printed after the frontmatter (e.g. `# Title`), for frameworks that do not render the frontmatter `title` |

Optional exports:

| Export           | Type     | Description                                    |
| ---------------- | -------- | ---------------------------------------------- |
| `mdxDeclaration` | `string` | Import statements prepended to generated files |
| `mdxExtension`   | `string` | Custom file extension (defaults to `.mdx`)     |

You only need to export the formatter functions your framework requires. Any missing functions use the default HTML-like implementation.

## `formatMDXDetails` Contract

The string returned by `formatMDXDetails` **must** contain a single `\r` (carriage return) character as a delimiter between the opening and closing parts. The printer splits on `"\r"` to wrap content, so reserve `\r` only for that separator and use `\n` for line breaks.

```js
// ✅ correct — use \n for line breaks and a single standalone \r as the delimiter
export const formatMDXDetails = ({ dataOpen }) =>
  `\n\n<MyDetails label="${dataOpen}">\n\r</MyDetails>\n\n`;

// ❌ incorrect — no \r means the closing tag is lost
export const formatMDXDetails = ({ dataOpen }) =>
  `\n\n<MyDetails label="${dataOpen}">\n</MyDetails>\n\n`;

// ❌ incorrect — CRLF introduces extra \r characters
export const formatMDXDetails = ({ dataOpen }) =>
  `\r\n\r\n<MyDetails label="${dataOpen}">\r\n\r</MyDetails>\r\n\r\n`;
```

## Extending a Preset

To customize a preset, spread its exports and override specific formatters:

```js
// src/modules/custom-mdx.cjs
const PresetMDX = require("@graphql-markdown/formatters/starlight");

const formatMDXBadge = ({ text, classname }) => {
  // Your custom logic
  return `<Badge>${text}</Badge>`;
};

module.exports = {
  ...PresetMDX,
  formatMDXBadge,
};
```

## Lifecycle Hooks

Custom MDX modules can also export lifecycle hooks to customize the generation process. See [Hooks](/docs/customize/hooks#available-hooks) for the full reference and examples.
