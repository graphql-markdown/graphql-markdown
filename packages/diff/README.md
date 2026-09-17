# @graphql-markdown/diff

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/diff?style=flat)](https://www.npmjs.com/package/@graphql-markdown/diff)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_diff&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_diff)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_diff&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_diff)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Ddiff)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=diff)

Schema comparison utilities for GraphQL-Markdown. Detects whether a **GraphQL schema** has changed since the last documentation generation, so tools like [`@graphql-markdown/core`](https://www.npmjs.com/package/@graphql-markdown/core) can skip regeneration when nothing changed.

## Installation

```shell
npm install @graphql-markdown/diff
```

## Usage

```ts
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { checkSchemaChanges, CompareMethod } from "@graphql-markdown/diff";
import { loadSchema } from "@graphql-markdown/graphql";

const schema = await loadSchema("./schema.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const hasChanged = await checkSchemaChanges(
  schema,
  "./docs",
  CompareMethod.DIFF,
);

if (!hasChanged) {
  console.log("Schema is unchanged, skipping documentation generation.");
}
```

### Comparison methods

- `CompareMethod.DIFF` — diffs the printed schema against a saved `schema.graphql` reference file (default).
- `CompareMethod.HASH` — compares a SHA-256 hash of the printed schema against a saved `.schema` file.
- `CompareMethod.FORCE` — always reports a change, forcing regeneration.
- `CompareMethod.NONE` — always reports no change, skipping regeneration.

## Documentation

- [Configuration Options](https://graphql-markdown.dev/docs/settings)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
