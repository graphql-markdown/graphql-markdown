---
sidebar_position: 10
pagination_prev: null
pagination_next: null
description: Docusaurus-only recipes for GraphQL-Markdown — custom homepage sidebar placement, styling deprecated sections, regenerating docs, extending hooks, and multiple schema instances.
keywords:
  - Docusaurus recipes
  - GraphQL-Markdown Docusaurus
  - custom homepage
  - deprecated styling
  - Docusaurus hooks
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Docusaurus recipes

These recipes only apply when generating documentation into a Docusaurus site with `@graphql-markdown/docusaurus`. For the framework-agnostic path (any other formatter), see [Integration with Frameworks](/docs/guides/other-frameworks). To install the plugin, see [Getting started](/docs/get-started#add-to-an-existing-site).

## Requirements

- Node.js version [22.18](https://nodejs.org/en/download/) or above
- [Docusaurus](https://docusaurus.io/) 2.0 or above with the [docs plugin](https://docusaurus.io/docs/docs-introduction) enabled
- [GraphQL.js](https://graphql.org/graphql-js/) 16.0 or above

A schema loader is also required. See [schema loading](/docs/guides/schema-loading).

## Configuration

Define the plugin settings in `docusaurus.config.js`. They take precedence over a GraphQL Config file and are overridden by CLI flags.

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: [
    [
      "@graphql-markdown/docusaurus",
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader", // local file schema
        },
        // Optional advanced settings
        pretty: true,
      },
    ],
  ],
};
```

All settings are described in [settings](/docs/reference/settings). For several schemas, see [additional schemas](/docs/guides/additional-schema).

### Site settings

Add a link to the generated documentation in your site's `navbar`:

```js title="docusaurus.config.js"
module.exports = {
  // ...
  navbar: {
    items: [
      {
        to: "/swapi/homepage", // adjust the location depending on your baseURL (see configuration)
        label: "SWAPI Schema", // change the label with yours
        position: "left",
      },
    ],
  },
};
```

For more details, see the Docusaurus [navbar documentation](https://docusaurus.io/docs/api/themes/configuration#navbar).

## Custom homepage

If you decide to use a custom homepage for the GraphQL-generated documentation, then set the sidebar position to `sidebar_position: 1` to ensure it shows first:

```markdown title="schema.md"
---
title: Schema Documentation
sidebar_position: 1
---

This documentation has been automatically generated from the GraphQL schema.
```

:::tip

If you want to hide the homepage from the sidebar, then set the front matter `sidebar_class_name` (or `className` depending on your Docusaurus version) to `navbar__toggle`.

```markdown {6} title="schema.md"
---
title: Schema Documentation
sidebar_position: 1
sidebar_class_name: navbar__toggle
---
```

:::

## Customize deprecated sections

When using the option [`printTypeOptions.deprecated`](/docs/reference/settings#printtypeoptions) set to `group`, the rendering can be customized using the CSS class `.deprecated`.

Adding a `warning` emoji ⚠️ is done with a quick tweak of [Docusaurus CSS](https://docusaurus.io/docs/styling-layout).

```css title="/src/css/custom.css"
.deprecated a::after,
span.deprecated::after {
  content: "⚠️";
  padding-left: 4px !important;
  transform: none !important;
}

.deprecated {
  padding-top: 1rem;
}
```

The above CSS will render the deprecated sections as the following

![custom-deprecated-section](/img/docs/custom-deprecated-section.png)

## Regenerate the documentation

In a Docusaurus site, build your website:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm run docusaurus build
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm docusaurus build
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn docusaurus build
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun run docusaurus build
```

</TabItem>
</Tabs>

Or run the documentation generator directly:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm run docusaurus graphql-to-doc
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm docusaurus graphql-to-doc
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn docusaurus graphql-to-doc
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun run docusaurus graphql-to-doc
```

</TabItem>
</Tabs>

The `npm run docusaurus graphql-to-doc` command generates MDX files locally from your GraphQL schema. The possible command flags are documented in [settings](/docs/reference/settings).

## Using hooks with Docusaurus

When using Docusaurus, you can extend the default MDX module to add custom hooks while keeping all the built-in formatters:

```js title="custom-mdx.cjs"
const DocusaurusMDX = require("@graphql-markdown/docusaurus/mdx");

const afterPrintCodeHook = async (event) => {
  // Your custom logic here
  event.output = `${event.output}\n\n<!-- Custom content -->`;
};

module.exports = {
  ...DocusaurusMDX, // Keep all default formatters
  afterPrintCodeHook, // Add your custom hook
};
```

Then configure your Docusaurus plugin to use the custom module:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      schema: "./schema.graphql",
      // highlight-next-line
      formatter: require.resolve("./custom-mdx.cjs"),
      // ... other options
    },
  ],
],
```

See [Hooks Recipes](/docs/customize/hooks) for the full framework-agnostic hook reference.

## Multiple schemas (Docusaurus plugin instances)

If you need to support multiple schemas in a Docusaurus site, then you can set multiple instances of the plugin.

Assign a unique `id` attribute to each plugin instance (if not set, then `id` value is `default`).

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // highlight-next-line
      // id: 'default', // omitted => default instance
      schema: "./schema/swapi.graphql",
      rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
      baseURL: "swapi",
      homepage: "./docs/swapi.md",
      loaders: {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
      }
    },
  ],
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // highlight-next-line
      id: "admin",
      schema: "./schema/admin.graphql",
      rootPath: "./docs", // docs will be generated under './docs/admin' (rootPath/baseURL)
      baseURL: "admin",
      homepage: "./docs/admin.md",
      loaders: {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
      }
    },
  ],
],
```

Instance with an `id` will have their command line:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm run docusaurus graphql-to-doc:admin
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm docusaurus graphql-to-doc:admin
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn docusaurus graphql-to-doc:admin
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun run docusaurus graphql-to-doc:admin
```

</TabItem>
</Tabs>

If you also use [GraphQL Config](/docs/reference/configuration#graphql-config), you need to define `projects` with the same `id` (including `default`):

```js title="docusaurus.config.js"
plugins: [
  "@graphql-markdown/docusaurus", // default instance
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // highlight-next-line
      id: "admin",
    },
  ],
],
```

For the full generic (non-Docusaurus-plugin) multi-schema setup via GraphQL Config, see [Additional schemas](/docs/guides/additional-schema#graphql-config).
