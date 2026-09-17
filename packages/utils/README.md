# @graphql-markdown/utils

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/utils?style=flat)](https://www.npmjs.com/package/@graphql-markdown/utils)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_utils&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_utils)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_utils&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_utils)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dutils)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=utils)

Common utility library shared across GraphQL-Markdown packages: array and object helpers, filesystem and Prettier-formatting helpers, string and URL helpers, Markdown/frontmatter formatting, type guards, and the internal event helpers.

## Installation

```shell
npm install @graphql-markdown/utils
```

## Usage

```ts
import {
  fileExists,
  readFile,
  saveFile,
  slugify,
} from "@graphql-markdown/utils";

const slug = slugify("My GraphQL Type");
```

## Modules

- [array](docs/array.md)
- [events](docs/events.md)
- [frontmatter](docs/frontmatter.md)
- [fs](docs/fs.md)
- [guards](docs/guards.md)
- [markdown](docs/markdown.md)
- [object](docs/object.md)
- [prettier](docs/prettier.md)
- [string](docs/string.md)
- [url](docs/url.md)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
