---
description: Integrate GraphQL-Markdown with Docusaurus, Astro, Next.js, VitePress, and other documentation frameworks. Complete setup guides and examples.
keywords:
  - GraphQL-Markdown integration
  - Docusaurus
  - Astro
  - Next.js
  - VitePress
  - framework integration
---

# Integration with Frameworks

This guide provides examples for integrating GraphQL-Markdown with popular documentation frameworks.

## General Integration Approach

Most documentation frameworks allow you to generate documentation during the build process. You can integrate GraphQL-Markdown by creating a script that runs before your documentation build.

## Use the Formatter Presets Package

GraphQL-Markdown now provides framework formatter presets in a dedicated package:

```bash
npm install @graphql-markdown/formatters
```

You can use these presets directly as your `mdxParser` value:

| Framework | `mdxParser` value |
| --------- | ----------------- |
| Docusaurus | `@graphql-markdown/formatters/docusaurus` |
| Astro Starlight | `@graphql-markdown/formatters/starlight` |
| Next.js + Fumadocs | `@graphql-markdown/formatters/fumadocs` |
| Vocs | `@graphql-markdown/formatters/vocs` |
| HonKit | `@graphql-markdown/formatters/honkit` |
| Hugo | `@graphql-markdown/formatters/hugo` |
| MkDocs | `@graphql-markdown/formatters/mkdocs` |
| DocFX | `@graphql-markdown/formatters/docfx` |
| mdBook | `@graphql-markdown/formatters/mdbook` |

### Basic Integration Example

```js
import { runGraphQLMarkdown } from '@graphql-markdown/cli';

const config = {
  schema: './schema.graphql',
  rootPath: './docs',
};

await runGraphQLMarkdown(config);
```

## Custom MDX Formatter

When integrating with frameworks other than Docusaurus, you'll need to create a custom MDX module to format documentation elements (badges, admonitions, etc.) using your framework's components.

### MDX Module Structure

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

:::warning[`formatMDXDetails` contract]

The string returned by `formatMDXDetails` **must** contain a single `\r` (carriage return) character as a delimiter between the opening part and the closing part. The printer splits on `"\r"` to wrap generated content inside the collapsible element, so reserve `\r` only for that separator and use `\n` for all regular line breaks inside the returned string.

Do **not** use CRLF (`\r\n`) for normal line endings in `formatMDXDetails`, because any extra `\r` characters will also be treated as delimiters.

```js
// ✅ correct — use \n for normal line breaks and a single standalone \r as the delimiter
export const formatMDXDetails = ({ dataOpen }) =>
  `\n\n<MyDetails label="${dataOpen}">\n\r</MyDetails>\n\n`;

// ❌ incorrect — no \r means the closing tag is lost and items render outside
export const formatMDXDetails = ({ dataOpen }) =>
  `\n\n<MyDetails label="${dataOpen}">\n</MyDetails>\n\n`;

// ❌ incorrect — CRLF introduces extra \r characters that break result.split("\r")
export const formatMDXDetails = ({ dataOpen }) =>
  `\r\n\r\n<MyDetails label="${dataOpen}">\r\n\r</MyDetails>\r\n\r\n`;
```

:::

Additionally, the module can export:

| Export            | Type     | Description                                          |
| ----------------- | -------- | ---------------------------------------------------- |
| `mdxDeclaration`  | `string` | Import statements prepended to generated files       |
| `mdxExtension`    | `string` | Custom file extension (defaults to `.mdx`)           |

<br/>

:::tip
You only need to export the formatter functions your framework requires. Any missing functions will use the default HTML-like implementation.
:::

### Lifecycle Hooks

The custom MDX module can also export lifecycle hooks to customize the generation process. See **[Hooks Recipes](/docs/advanced/hook-recipes#available-hooks)** for the full hook reference and usage examples.

## Framework-Specific Integration

### Docusaurus

The official [Docusaurus](https://docusaurus.io/) integration is available as a dedicated package:

:::info[Docusaurus default details output]

With the `@graphql-markdown/formatters/docusaurus` parser, collapsible sections are emitted as native `<details>/<summary>` markup.
Custom summary labels are rendered with open/closed spans and toggled with CSS (`data-collapsed` and `[open]` selectors), so no custom `<Details>` React component is required.

:::

```js
const path = require('node:path');

module.exports = {
  // ... other docusaurus config
  plugins: [
    [
      '@graphql-markdown/docusaurus',
      {
        schema: path.join(__dirname, 'schema.graphql'),
        rootPath: path.join(__dirname, 'docs'),
        baseURL: 'api',
      },
    ],
  ],
};
```

For more details, check the [@graphql-markdown/docusaurus](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/docusaurus) package.

If you need to override formatting behavior, set `mdxParser` to your own module path and export only the formatter functions you want to customize.

### Astro Starlight

For [Astro Starlight](https://starlight.astro.build/) integration, use the built-in Starlight formatter preset:

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./src/content/docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/starlight",
});
```

If you need custom rendering on top of the preset, create a custom module and spread the preset exports:

```js
// src/modules/astro-mdx.cjs
const StarlightMDX = require("@graphql-markdown/formatters/starlight");

const formatMDXBadge = ({ text, classname }) => {
  const variant = classname === "DEPRECATED" ? "caution" : "default";
  return `<mark data-variant="${variant}">${text}</mark>`;
};

module.exports = {
  ...StarlightMDX,
  formatMDXBadge,
};
```

See complete implementation: [demo-astro-starlight](https://github.com/graphql-markdown/demo-astro-starlight)

### Next.js with Fumadocs

For Next.js using [Fumadocs](https://www.fumadocs.dev/), use the built-in Fumadocs formatter preset:

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./content/docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/fumadocs",
});
```

See complete implementation: [demo-nextjs-fumadocs](https://github.com/graphql-markdown/demo-nextjs-fumadocs)

### Vocs

For [Vocs](https://vocs.dev/) integration, use the built-in Vocs formatter preset:

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/vocs",
});
```

See complete implementation: [demo-vite-vocs](https://github.com/graphql-markdown/demo-vite-vocs)

### VitePress

For [VitePress](https://vitepress.dev/) support, check the package **[graphql-markdown-vitepress](https://www.npmjs.com/package/graphql-markdown-vitepress)**.
