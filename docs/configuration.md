---
sidebar_position: 4
---

# Configuration

You can define some or all of the plugin settings directly at the plugin level in the Docusaurus configuration file `docusaurus.config.js`:

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
      },
    ],
  ],
};
```

All settings are described in the page **[settings](/docs/settings)**.

:::tip

If you want to use several GraphQL schemas, read our guide for **[additional schemas](/docs/advanced/additional-schema)**.

:::

## Site Settings

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

## GraphQL Config

:::tip

The GraphQL-Markdown template provides GraphQL Config as the default configuration file.

:::

Instead of defining the configuration alongside the Docusaurus config file, you can use a [GraphQL Config](https://the-guild.dev/graphql/config/docs/user/usage) file (multiple formats supported).

You need to install the package `graphql-config`.

```shell title="shell"
npm install graphql-config
```

```js title="docusaurus.config.js"
module.exports = {
  // ...
  plugins: ["@graphql-markdown/docusaurus"],
};
```

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

:::warning

Note that **`schema` is not part of the extension configuration**, but part of the default `graphql-config` configuration.

:::

**Current limitations:**

- single schema only, no schema stitching
- `include`, `exclude`, `documents` and glob pattern are not supported

## Configuration lifecycle

GraphQL-Markdown allows mixing the different configurations, and building the final configuration using the following order:

1. Default configuration
2. `.graphqlrc` configuration file
3. Docusaurus plugin configuration
4. CLI flags
