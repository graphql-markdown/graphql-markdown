# GraphQL-Markdown docs

Docusaurus site generated with [GraphQL-Markdown](https://graphql-markdown.dev).

## Quick start

### 1. Generate

```shell
npm run doc
```

### 2. Start

```shell
npm start
```

## Your GraphQL Schema

The schema is configured in `.graphqlrc` (see the [documentation](https://graphql-markdown.dev/docs/configuration#graphql-config)). By default it reads the bundled `schema/example.graphql`:

```yaml
schema: './schema/example.graphql'
extensions:
  graphql-markdown:
    loaders:
      GraphQLFileLoader: '@graphql-tools/graphql-file-loader'
```

To change it, update `schema` (a local file, or a URL, `git:` or `github:` reference) and install and declare the matching [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) under `loaders`, e.g. `UrlLoader: '@graphql-tools/url-loader'`. Then run `npm run doc` again.
