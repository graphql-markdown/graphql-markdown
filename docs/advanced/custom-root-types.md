---
pagination_prev: null
pagination_next: null
description: Configure custom root types for Query, Mutation, and Subscription operations in your GraphQL schema documentation.
keywords:
  - custom root types
  - GraphQL operations
  - Query type
  - Mutation type
  - Subscription type
---

# Custom root types

For custom operation root types (queries not of type `Query`, or root type name used for other purpose), use the loader option `RootTypes`:

```ts
type RootTypes = { query?: string; mutation?: string; subscription?: string };
```

- use a custom type name to override the standard type
use an empty string to disable the GraphQL standard type
- unset root types will use the GraphQL standard type

Add the option `rootTypes` to the loader options under `@graphql-markdown/docusaurus` configuration (see also [schema loading](/docs/advanced/schema-loading)):

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // ... other options
      loaders: {
        GraphQLFileLoader: {
          module: "@graphql-tools/graphql-file-loader",
          options: {
            // highlight-start
            rootTypes: {
              query: "Root", // use custom root type Root for queries, instead of Query
              subscription: "" // disable Subscription type
            },
            // highlight-end
          },
        },
      },
    },
  ],
],
```
