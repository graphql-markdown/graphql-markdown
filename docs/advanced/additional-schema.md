---
pagination_prev: null
pagination_next: null
description: Configure multiple GraphQL schemas in a single project. Set up separate documentation instances for different APIs.
keywords:
  - multiple schemas
  - multi-schema
  - GraphQL documentation
  - multiple APIs
  - schema instances
---

# Additional schemas

If you need to support multiple schemas, then you can set multiple instances of the plugin

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

```shell
npm run docusaurus graphql-to-doc:admin
```

## GraphQL Config

If you use [GraphQL config](/docs/configuration#graphql-config), then you need to define `projects` with the same `id` (including `default`).

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

```yaml title=".graphqlrc"
projects:
  # highlight-next-line
  default:
    schema: "./schema/swapi.graphql"
    extensions:
      graphql-markdown:
        linkRoot: "./docs"
        baseURL: "swapi"
        homepage: "./docs/swapi.md"
        loaders:
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader"
  # highlight-next-line
  admin:
    schema: "./schema/admin.graphql"
    extensions:
      graphql-markdown:
        linkRoot: "./docs"
        baseURL: "admin"
        homepage: "./docs/admin.md"
        loaders:
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader"
```
