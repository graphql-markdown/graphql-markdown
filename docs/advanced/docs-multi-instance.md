---
pagination_prev: null
pagination_next: null
---

# Docs multi-instance

In this use case, you have multiple sets of documentation (a.k.a. [Docs Multi-instance](https://docusaurus.io/docs/docs-multi-instance)), then you need to add a reference to `sidebar-schema.js` into the dedicated instance of `@docusaurus/plugin-content-docs`:

```js title="docusaurus.config.js"
plugins: [
  [
    "@docusaurus/plugin-content-docs",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      id: "api",
      path: "api",
      routeBasePath: "api",
      /// highlight-next-line
      sidebarPath: require.resolve("./api/sidebar-schema.js"),
      // ... other options
    },
  ],
],
```
