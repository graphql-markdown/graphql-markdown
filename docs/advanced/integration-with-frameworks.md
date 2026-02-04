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

| Export | Type | Description |
|--------|------|-------------|
| `formatMDXBadge` | `(badge: { text, classname? }) => string` | Format type badges (deprecated, required, etc.) |
| `formatMDXAdmonition` | `(admonition: { text, title, type, icon? }, meta?) => string` | Format callout/warning blocks |
| `formatMDXBullet` | `(text?: string) => string` | Format bullet point separators |
| `formatMDXDetails` | `(option: { dataOpen, dataClose? }) => string` | Format collapsible sections |
| `formatMDXFrontmatter` | `(props?, formatted?: string[]) => string` | Format page frontmatter |
| `formatMDXLink` | `(link: { text, url }) => { text, url }` | Transform type links |
| `formatMDXNameEntity` | `(name: string, parentType?: string) => string` | Format named entity references |
| `formatMDXSpecifiedByLink` | `(url: string) => string` | Format scalar specification links |

Additionally, the module can export:

| Export | Type | Description |
|--------|------|-------------|
| `mdxDeclaration` | `string` | Import statements prepended to generated files |
| `mdxExtension` | `string` | Custom file extension (defaults to `.mdx`) |

### Lifecycle Hooks

The custom MDX module can also export lifecycle hooks to customize the generation process. These hooks are executed at specific points during documentation generation:

**Generation Hooks:**

| Export | Description |
|--------|-------------|
| `beforeSchemaLoadHook` | Called before loading the GraphQL schema |
| `afterSchemaLoadHook` | Called after loading the GraphQL schema |
| `beforeDiffCheckHook` | Called before checking schema differences |
| `afterDiffCheckHook` | Called after checking schema differences |
| `beforeRenderRootTypesHook` | Called before rendering root types |
| `afterRenderRootTypesHook` | Called after rendering root types |
| `beforeRenderHomepageHook` | Called before rendering the homepage |
| `afterRenderHomepageHook` | Called after rendering the homepage |
| `beforeRenderTypeEntitiesHook` | Called before rendering type entities |
| `afterRenderTypeEntitiesHook` | Called after rendering type entities |
| `beforeGenerateIndexMetafileHook` | Called before generating index metafiles |
| `afterGenerateIndexMetafileHook` | Called after generating index metafiles |

**Printer Hooks:**

| Export | Description |
|--------|-------------|
| `beforePrintCodeHook` | Called before generating code blocks - can modify options or prevent default generation |
| `afterPrintCodeHook` | Called after generating code blocks - can modify the generated output |
| `beforePrintTypeHook` | Called before generating type documentation - can modify options or prevent default |
| `afterPrintTypeHook` | Called after generating type documentation - can modify the generated output |

:::tip
Printer hooks are useful for extending the generated documentation. For example, you can use `afterPrintCodeHook` to append response type information after operation code blocks. See **[Hooks Recipes](/docs/advanced/hook-recipes)** for examples.
:::

:::tip
You only need to export the formatter functions your framework requires. Any missing functions will use the default HTML-like implementation.
:::

## Framework-Specific Integration

### Docusaurus

The official Docusaurus integration is available as a dedicated package:

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

### Astro Starlight

For Astro Starlight integration, create a custom MDX module:

```js
// src/modules/astro-mdx.cjs

/**
 * Import statement prepended to every generated MDX file.
 */
const mdxDeclaration = `import { Aside, Badge } from '@astrojs/starlight/components';`;

/**
 * Optional: Custom file extension for generated files.
 */
const mdxExtension = ".mdx";

/**
 * Format badge elements (e.g., "deprecated", "required")
 */
const formatMDXBadge = ({ text, classname }) => {
  const variant = classname === "DEPRECATED" ? 'caution' : 'default';
  return `<Badge variant="${variant}" text="${text}"/>`;
};

/**
 * Format admonition/callout blocks (warnings, notes, tips)
 */
const formatMDXAdmonition = ({ text, title, type }, meta) => {
  const asideType = type === "warning" ? "caution" : "note";
  return `<Aside type="${asideType}" title="${title}">${text}</Aside>`;
};

module.exports = {
  mdxDeclaration,
  mdxExtension,
  formatMDXBadge,
  formatMDXAdmonition,
};
```

See complete implementation: [demo-astro-starlight](https://github.com/graphql-markdown/demo-astro-starlight)

### Next.js with Fumadocs

For Next.js using Fumadocs, create a custom MDX module:

```js
// lib/fumadocs-mdx.cjs
const mdxDeclaration = `
import { Heading } from 'fumadocs-ui/components/heading';
import { Callout } from 'fumadocs-ui/components/callout';
import Chip from '@mui/material/Chip';
`;

/**
 * Format badge elements
 */
const formatMDXBadge = ({ text, classname }) => {
  const color = classname === "DEPRECATED" ? 'warning' : 'info';
  return `<Chip color="${color}" label="${text}" size="small" variant="outlined"/>`;
};

/**
 * Format admonition/callout blocks
 */
const formatMDXAdmonition = ({ text, title, type }, meta) => {
  const calloutType = type === "warning" ? "warn" : "info";
  return `<Callout type="${calloutType}" title="${title}">${text}</Callout>`;
};

module.exports = {
  mdxDeclaration,
  formatMDXBadge,
  formatMDXAdmonition,
};
```

See complete implementation: [demo-nextjs-fumadocs](https://github.com/graphql-markdown/demo-nextjs-fumadocs)

### Vocs

For Vocs integration, create a custom MDX module:

```js
// lib/vocs-mdx.cjs
const mdxDeclaration = `
import Chip from '@mui/material/Chip';

export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em' }}>&nbsp;●&nbsp;</span></>
`;

/**
 * Format badge elements
 */
const formatMDXBadge = ({ text, classname }) => {
  const color = classname === "DEPRECATED" ? 'warning' : 'info';
  return `<Chip color="${color}" label="${text}" size="small" variant="outlined"/>`;
};

/**
 * Format admonition/callout blocks
 */
const formatMDXAdmonition = ({ text, title, type }, meta) => {
  const calloutType = type === "warning" ? "warning" : "info";
  return `:::${calloutType}[${title}]${text}:::`;
};

/**
 * Format bullet point separators using custom Bullet component
 */
const formatMDXBullet = (text = "") => {
  return `<Bullet/>${text}`;
};

module.exports = {
  mdxDeclaration,
  formatMDXBadge,
  formatMDXAdmonition,
  formatMDXBullet,
};
```

See complete implementation: [demo-vite-vocs](https://github.com/graphql-markdown/demo-vite-vocs)

