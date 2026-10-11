# GraphQL-Markdown docs

API documentation generated with [GraphQL-Markdown](https://graphql-markdown.dev). The pages are plain files written to `docs/` (`.md`, or `.mdx` for the MDX variant), with no site framework attached.

## Generate

```shell
npm run doc
```

### Your GraphQL Schema

The schema is configured in `.graphqlrc` (see the [documentation](https://graphql-markdown.dev/docs/configuration#graphql-config)). By default it reads the bundled `schema/example.graphql`. To change it, edit `schema` in `.graphqlrc` (a local file, or a URL, `git:` or `github:` reference) and declare the matching [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) under `loaders`. Then run `npm run doc` again.
