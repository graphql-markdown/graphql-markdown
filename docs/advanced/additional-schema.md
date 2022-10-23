---
pagination_prev: null
pagination_next: null
---

# Additional schemas

If you need to support multiple schemas, then you can set multiple instances of the plugin

Assign a unique `id` attribute to each plugin instance (if not set, then `id` value is `default`).

```js {15 }
plugins: [
    [
      "@graphql-markdown/docusaurus",
       {
        // id: 'swapi', // omitted => default instance
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
      {
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

Instance with an `id` will have their own command line:

```shell
npm run docusaurus graphql-to-doc:admin
```
