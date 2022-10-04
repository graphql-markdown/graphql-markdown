---
sidebar_position: 4
---

# Configuration

You can define some or all of the plugin settings directly at the plugin level in the Docusaurus configuration file `docusaurus.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    [
      "@graphql-markdown/docusaurus",
      {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
      },
    ],
  ],
};
```

All settings are described in the page [settings](/docs/settings).

:::tip
If you want to use several GraphQL schemas, read our page for [additional schema](/docs/advanced/additional-schema).
:::

## Sidebar

A sidebar file `sidebar-schema.js` will be generated for the documentation, and you need to add a reference to `sidebar-schema.js` into the default `sidebar.js`.

```js
module.exports = {
  docsSidebar: [
    // ... your site's sidebar
  ],
  ...require("./docs/swapi/sidebar-schema.js"),
};
```

:::caution
The sidebar path must be relative to the `sidebars.js` location. By default, the plugin provides a relative path from the root folder of Docusaurus.

For example, if your `sidebars.js` is located under `./src` folder, then you need to go one level up in the path: `./../docs/swapi/sidebar-schema`.
:::

:::tip
See [docs multi-instance](/docs/advanced/docs-multi-instance) for sidebar settings when using multiple sets of documentation.
:::

## Site Settings

You will also need to add a link to your documentation on your site. One way to do it is to add it to your site's `navbar` in `docusaurus.config.js`:

```js
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

For more details about `navbar`, please refer to Docusaurus [documentation](https://docusaurus.io/docs/api/themes/configuration#navbar).
