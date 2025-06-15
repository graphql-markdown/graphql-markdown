---
sidebar_position: 40
---

# Configuration

GraphQL-Markdown is compatible with most MDX frameworks, with built-in support for Docusaurus and other static site generators. This guide explains the different configuration methods and their priorities.

## Framework-agnostic Configuration

### GraphQL Config

:::tip
GraphQL Config is the recommended way to configure GraphQL-Markdown across all frameworks.
:::

You can use a [GraphQL Config](https://the-guild.dev/graphql/config/docs/user/usage) file (multiple formats supported) to configure GraphQL-Markdown:

```yaml title=".graphqlrc"
schema: "https://graphql.anilist.co/"
extensions:
  graphql-markdown:
    linkRoot: "/examples/default"
    baseURL: "."
    homepage: "data/anilist.md"
    loaders:
      UrlLoader:
        module: "@graphql-tools/url-loader"
        options:
          method: "POST"
    printTypeOptions:
      deprecated: "group"
```

## Docusaurus Integration

### Plugin Configuration

You can define plugin settings directly in your Docusaurus configuration file `docusaurus.config.js`:

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
        customDirective: true,
      },
    ],
  ],
};
```

All settings are described in the page **[settings](/docs/settings)**.

:::tip

If you want to use several GraphQL schemas, read our guide for **[additional schemas](/docs/advanced/additional-schema)**.

:::

### Site Settings

You will also need to add a link to your documentation on your site. One way to do it is to add it to your site's `navbar` in `docusaurus.config.js`:

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

For more details about the `navbar`, please refer to Docusaurus [documentation](https://docusaurus.io/docs/api/themes/configuration#navbar).

## Configuration Lifecycle

GraphQL-Markdown processes configuration sources in the following priority order (later sources override earlier ones):

1. **Default configuration**: Built-in default settings
2. **GraphQL Config file** (`.graphqlrc`): Framework-agnostic project settings
3. **Framework-specific configuration**: (e.g., Docusaurus plugin settings)
4. **CLI flags**: Command-line arguments override all other settings

:::tip
For any framework, you can use CLI flags to temporarily override settings without modifying your configuration files.
:::

**Current limitations:**
- Single schema only, no schema stitching
- `include`, `exclude`, `documents` and glob pattern are not supported
