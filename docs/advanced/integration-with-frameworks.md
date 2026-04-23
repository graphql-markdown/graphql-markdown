---
description: Integrate GraphQL-Markdown with popular documentation frameworks using formatter presets or create custom formatters.
keywords:
  - GraphQL-Markdown integration
  - framework support
  - formatter presets
  - custom MDX formatters
---

# Integration with Frameworks

GraphQL-Markdown supports multiple documentation frameworks through formatter presets. Each framework has its own setup guide, or you can create a custom formatter for any framework.

## Supported Formatters

Install the formatters package:

```bash
npm install @graphql-markdown/formatters
```

Then select your framework:

| Framework | Package | Setup |
| --------- | ------- | ----- |
| **Docusaurus** | `@graphql-markdown/formatters/docusaurus` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/README.md) |
| **Astro Starlight** | `@graphql-markdown/formatters/starlight` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/README.md) |
| **Next.js + Fumadocs** | `@graphql-markdown/formatters/fumadocs` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/README.md) |
| **Vocs** | `@graphql-markdown/formatters/vocs` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/README.md) |
| **HonKit** | `@graphql-markdown/formatters/honkit` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/README.md) |
| **Hugo** | `@graphql-markdown/formatters/hugo` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/README.md) |
| **MkDocs** | `@graphql-markdown/formatters/mkdocs` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/README.md) |
| **DocFX** | `@graphql-markdown/formatters/docfx` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/README.md) |
| **mdBook** | `@graphql-markdown/formatters/mdbook` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/README.md) |

### Quick Example

```js
import { runGraphQLMarkdown } from '@graphql-markdown/cli';

await runGraphQLMarkdown({
  schema: './schema.graphql',
  rootPath: './docs',
  baseURL: 'api',
  mdxParser: '@graphql-markdown/formatters/docusaurus', // or your framework
});
```

## 3rd Party Packages

Some frameworks have dedicated integration packages beyond the basic formatters:

| Framework | Framework Link | Package | NPM |
| --------- | -------------- | ------- | --- |
| **VitePress** | [vitepress.dev](https://vitepress.dev/) | graphql-markdown-vitepress | [NPM](https://www.npmjs.com/package/graphql-markdown-vitepress) |

## Custom MDX Formatter

For frameworks not listed above, or to customize formatting behavior, create a custom MDX module.

### MDX Module Contract

A custom MDX module can export individual formatter functions:

| Export                     | Type                                                               | Description                                      |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `formatMDXBadge`           | `(badge: { text, classname? }) => string`                          | Format type badges (deprecated, required, etc.)  |
| `formatMDXAdmonition`      | `(admonition: { text, title, type, icon? }, meta?) => string`      | Format callout/warning blocks                    |
| `formatMDXBullet`          | `(text?: string) => string`                                        | Format bullet point separators                   |
| `formatMDXDetails`         | `(option: { dataOpen, dataClose? }) => string`                     | Format collapsible sections                      |
| `formatMDXFrontmatter`     | `(props?, formatted?: string[]) => string`                         | Format page frontmatter                          |
| `formatMDXLink`            | `(link: { text, url }) => { text, url }`                           | Transform type links                             |
| `formatMDXNameEntity`      | `(name: string, parentType?: string) => string`                    | Format named entity references                   |
| `formatMDXSpecifiedByLink` | `(url: string) => string`                                          | Format scalar specification links                |

Optional exports:

| Export            | Type     | Description                                          |
| ----------------- | -------- | ---------------------------------------------------- |
| `mdxDeclaration`  | `string` | Import statements prepended to generated files       |
| `mdxExtension`    | `string` | Custom file extension (defaults to `.mdx`)           |

:::tip
You only need to export the formatter functions your framework requires. Any missing functions will use the default HTML-like implementation.
:::

### `formatMDXDetails` Contract

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

### Extending a Preset

To customize a preset, spread its exports and override specific formatters:

```js
// src/modules/custom-mdx.cjs
const PresetMDX = require('@graphql-markdown/formatters/starlight');

const formatMDXBadge = ({ text, classname }) => {
  // Your custom logic
  return `<Badge>${text}</Badge>`;
};

module.exports = {
  ...PresetMDX,
  formatMDXBadge,
};
```

### Lifecycle Hooks

Custom MDX modules can also export lifecycle hooks to customize the generation process. See **[Hooks Recipes](/docs/advanced/hook-recipes#available-hooks)** for the full reference and examples.
