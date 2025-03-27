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
const parser = {
  generateIndexMetafile: async (dirPath, category, options) => {
    // Generate index file for a directory
  },
  formatMDXAdmonition: ({ text, title, type, icon }, meta) => {
    return `::: ${type}${title ? ` ${title}` : ''}\n${text}\n:::`;
  },
  formatMDXBadge: ({ text, classname }) => {
    return `<Badge variant="${classname}">${text}</Badge>`;
  },
  mdxDeclaration: 'import { Badge } from \'@astrojs/starlight/components\';'
};

module.exports = parser;
```

See complete implementation: [demo-astro-starlight](https://github.com/graphql-markdown/demo-astro-starlight)

### Next.js with Fumadocs

For Next.js using Fumadocs, implement a custom MDX parser:

```js
// lib/fumadocs-mdx.cjs
const parser = {
  generateIndexMetafile: async (dirPath, category, options) => {
    // Generate index file for a directory
  },
  formatMDXAdmonition: ({ text, title, type }, meta) => {
    return `<Callout type="${type}">${title ? `**${title}**: ` : ''}${text}</Callout>`;
  },
  formatMDXBadge: ({ text, classname }) => {
    return `<Badge variant="${classname}">${text}</Badge>`;
  },
  formatMDXDetails: ({ dataOpen, dataClose }) => {
    return `<Collapsible summary="${dataOpen}">\n\n${dataClose}\n\n</Collapsible>`;
  },
  mdxDeclaration: `import { Callout } from '@fumadocs/core';
import { Badge, Collapsible } from '@/components';`
};

module.exports = parser;
```

Full implementation: [fumadocs-mdx.cjs](https://github.com/graphql-markdown/demo-nextjs-fumadocs/blob/main/lib/fumadoc-mdx.cjs)

### VuePress

For VuePress integration, implement a custom MDX parser:

```js
// src/vuepress-mdx.cjs
const parser = {
  formatMDXAdmonition: ({ text, title, type }, meta) => {
    return `::: ${type}${title ? ` ${title}` : ''}\n${text}\n:::`;
  },
  formatMDXBadge: ({ text, classname }) => {
    return `<Badge type="${classname}" text="${text}" />`;
  },
  mdxDeclaration: `import { Badge } from '@vuepress/theme-default/lib/client/components'`
};

module.exports = parser;
```

### Gatsby

For Gatsby integration, implement a custom MDX parser:

```js
// src/gatsby-mdx.cjs
const parser = {
  formatMDXAdmonition: ({ text, title, type }, meta) => {
    return `<Alert variant="${type}">${title ? `**${title}**: ` : ''}${text}</Alert>`;
  },
  formatMDXBadge: ({ text, classname }) => {
    return `<Badge variant="${classname}">${text}</Badge>`;
  },
  mdxDeclaration: `import { Alert, Badge } from '@chakra-ui/react';`
};

module.exports = parser;
```
