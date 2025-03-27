# Integration with Frameworks

This guide provides examples for integrating GraphQL-Markdown with popular documentation frameworks.

## General Integration Approach

Most documentation frameworks allow you to generate documentation during the build process. You can integrate GraphQL-Markdown by creating a script that runs before your documentation build.

### Basic Integration Example

```js
const { generateMarkdown } = require('@graphql-markdown/core');

const config = {
  schema: './schema.graphql',
  rootPath: './docs',
  baseURL: 'graphql-api',
};

generateMarkdown(config);
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

Usage in your VuePress configuration:

```js
const config = {
  schema: './schema.graphql',
  rootPath: './docs/api',
  mdxParser: './src/vuepress-mdx.cjs'
};
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

Usage in your Gatsby configuration:

```js
const config = {
  schema: './schema.graphql',
  rootPath: './content/api',
  mdxParser: './src/gatsby-mdx.cjs'
};
```

## Customizing Output

You can customize the output by configuring various options:

```js
const { GraphQLSchema } = require('graphql');

const config = {
  // Schema can be a path or custom loader
  schema: './schema.graphql',
  // Custom loader must return GraphQLSchema type
  loader: async (): Promise<GraphQLSchema> => {
    return new GraphQLSchema({
      // Your schema definition
    });
  },
  
  // Output configuration
  rootPath: './docs/api',
  groupByDirective: true,
  
  // Custom homepage
  homepage: '/path/to/custom/homepage.md',
  
  // Framework-specific MDX parser
  mdxParser: './src/custom-mdx-parser.js'
};
```

## CI/CD Integration

To automate documentation generation in your CI/CD pipeline:

```bash
# Example CI script
npm install @graphql-markdown/cli
npx gqlmd graphql-to-doc
```
