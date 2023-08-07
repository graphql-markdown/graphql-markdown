---
pagination_prev: null
pagination_next: null
---

# Custom root types

For custom operation root types (queries not of type `Query`, or root type name used for other purpose), use the loader option `RootTypes`:

```ts
type RootTypes = { query?: string; mutation?: string; subscription?: string };
```

- use a custom type name to override standard type
- use a empty string to disable the GraphQL standard type
- unset root types will use the GraphQL standard type

Add the option `rootTypes` to the loader options under `@graphql-markdown/docusaurus` configuration (see also [schema loading](/docs/advanced/schema-loading)):

```js
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      loaders: {
        GraphQLFileLoader: {
          module: "@graphql-tools/graphql-file-loader",
          options: {
            rootTypes: {
              query: "Root", // use custom root type Root for queries, instead of Query
              subscription: "" // disable Subscription type
            },
          },
        },
      },
    },
  ],
],
```
