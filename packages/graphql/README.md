# @graphql-markdown/graphql

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/graphql?style=flat)](https://www.npmjs.com/package/@graphql-markdown/graphql)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_graphql&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_graphql)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_graphql&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_graphql)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dgraphql)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=graphql)

Low-level **GraphQL schema** utilities used by GraphQL-Markdown: schema loading, introspection, directive resolution, and the decorator predicates used to filter and group schema types. This package is a building block for [`@graphql-markdown/core`](https://www.npmjs.com/package/@graphql-markdown/core) and [`@graphql-markdown/printer-legacy`](https://www.npmjs.com/package/@graphql-markdown/printer-legacy); most users should not need to depend on it directly.

## Installation

```shell
npm install @graphql-markdown/graphql
```

## Usage

### Loading a schema

```ts
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-markdown/graphql";

const schema = await loadSchema("./schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});
```

### Introspecting a schema

```ts
import { getSchemaMap } from "@graphql-markdown/graphql";

const schemaMap = getSchemaMap(schema);
```

### Filtering types with decorator predicates

```ts
import { and, hasDirectiveNamed, isEntity } from "@graphql-markdown/graphql";

const isDeprecatedObject = and(
  isEntity("objects"),
  hasDirectiveNamed("deprecated"),
);
```

## Documentation

- [Configuration Options](https://graphql-markdown.dev/docs/settings)
- [Custom Directives](https://graphql-markdown.dev/docs/advanced/custom-directive)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
