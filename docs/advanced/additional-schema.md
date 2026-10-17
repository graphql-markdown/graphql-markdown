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

If you need to support multiple schemas, then you can set multiple projects, each with a different schema.

## GraphQL Config

Define `projects` with the same `id` (including `default`) using [GraphQL Config](/docs/configuration#graphql-config):

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

Each additional project gets its own generator command, e.g. `npx gqlmd graphql-to-doc:admin`.

For a Docusaurus site using plugin instances instead of GraphQL Config, see [Docusaurus recipes](./docusaurus-recipes#multiple-schemas-docusaurus-plugin-instances).
