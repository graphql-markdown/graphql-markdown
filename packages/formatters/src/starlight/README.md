# Astro Starlight Formatter

Formatter preset for [Astro Starlight](https://starlight.astro.build/).

## Installation

```bash
npm install @graphql-markdown/formatters
```

## Quick Start

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown({
  schema: "./schema.graphql",
  rootPath: "./src/content/docs",
  baseURL: "api",
  mdxParser: "@graphql-markdown/formatters/starlight",
});
```

## Configuration

### GraphQL Config

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./src/content/docs
    baseURL: api
    mdxParser: "@graphql-markdown/formatters/starlight"
```

## Features

- **Starlight Components**: Uses `<Aside>` and `<Badge>` components
- **MDX Extension**: Generates `.mdx` files with JSX support
- **Hooks**: Includes `beforeGenerateIndexMetafileHook` and `afterRenderTypeEntitiesHook` for advanced customization

## Custom Overrides

To override specific formatters, spread the preset and customize:

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

Then reference your custom module in the config:

```yaml
extensions:
  graphql-markdown:
    mdxParser: ./src/modules/astro-mdx.cjs
```

## Examples

See the complete implementation: [demo-astro-starlight](https://github.com/graphql-markdown/demo-astro-starlight)

## Links

- [Astro Starlight Documentation](https://starlight.astro.build/)
