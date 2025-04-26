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

For Astro Starlight integration, implement a custom MDX parser:

```js
// src/modules/astro-mdx.cjs
const mdxDeclaration = `
import { Aside, Badge } from '@astrojs/starlight/components';
`;

const formatMDXAdmonition = (
  { text, title, type },
  meta,
) => {
  const asideType = type === "warning" ? "caution" : "note";
  return `<Aside type="${asideType}" title="${title}">${text}</Aside>`;
};

const formatMDXBadge = ({ text, classname }) => {
  const variant = classname === "DEPRECATED" ? 'caution' : 'default';
  return `<Badge variant="${variant}" text="${text}"/>`;
};

module.exports = {
  mdxDeclaration,
  formatMDXAdmonition,
  formatMDXBadge,
};
```

See complete implementation: [demo-astro-starlight](https://github.com/graphql-markdown/demo-astro-starlight)

### Next.js with Fumadocs

For Next.js using Fumadocs, implement a custom MDX parser:

```js
// lib/fumadocs-mdx.cjs
const mdxDeclaration = `
import { Heading } from 'fumadocs-ui/components/heading';
import { Callout } from 'fumadocs-ui/components/callout';
import Chip from '@mui/material/Chip';
`;

const formatMDXAdmonition = (
  { text, title, type },
  meta,
) => {
  const asideType = type === "warning" ? "warn" : "info";
  return `<Callout type="${asideType}" title="${title}">${text}</Callout>`;
};

const formatMDXBadge = ({ text, classname }) => {
  const color = classname === "DEPRECATED" ? 'warning' : 'info';
  return `<Chip color="${color}" label="${text}" size="small" variant="outlined"/>`;
};

module.exports = {
  mdxDeclaration,
  formatMDXAdmonition,
  formatMDXBadge,
};
```

See complete implementation: [demo-nextjs-fumadocs](https://github.com/graphql-markdown/demo-nextjs-fumadocs)

### Vocs

For Vocs integration, implement a custom MDX parser:

```js
// lib/vocs-mdx.cjs
const mdxDeclaration = `
import Chip from '@mui/material/Chip';

export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em' }}>&nbsp;●&nbsp;</span></>
`;

const formatMDXAdmonition = (
  { text, title, type },
  meta,
) => {
  const calloutType = type === "warning" ? "warning" : "info";
  return `:::${calloutType}[${title}]${text}:::`;
};

const formatMDXBadge = ({ text, classname }) => {
  const color = classname === "DEPRECATED" ? 'warning' : 'info';
  return `<Chip color="${color}" label="${text}" size="small" variant="outlined"/>`;
};

const formatMDXBullet = (text = "") => {
  return `<Bullet/>${text}`;
};

module.exports = {
  mdxDeclaration,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet
};
```

See complete implementation: [demo-vite-vocs](https://github.com/graphql-markdown/demo-vite-vocs)
