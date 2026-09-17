# @graphql-markdown/types

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/types?style=flat)](https://www.npmjs.com/package/@graphql-markdown/types)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)

Shared TypeScript type definitions used across the `@graphql-markdown` packages (`cli`, `core`, `graphql`, `helpers`, `logger`, `printer-legacy`, `utils`, and the events and formatter contracts). This is a types-only package with no runtime code, useful when building custom formatters, decorators, or event handlers that need to type-check against the internal contracts.

## Installation

```shell
npm install --save-dev @graphql-markdown/types
```

## Usage

```ts
import type { PrintTypeOptions, GraphQLSchema } from "@graphql-markdown/types";

const printType = (schema: GraphQLSchema, options: PrintTypeOptions) => {
  // ...
};
```

## Documentation

- [Custom Formatters](https://graphql-markdown.dev/docs/advanced/integration-with-frameworks#custom-mdx-formatter)
- [Decorators](https://graphql-markdown.dev/docs/advanced/decorators)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
