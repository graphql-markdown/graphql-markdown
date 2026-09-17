# @graphql-markdown/core

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/core?style=flat)](https://www.npmjs.com/package/@graphql-markdown/core)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_core&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_core)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_core&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_core)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dcore)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=core)

Core engine for generating **Markdown documentation** from a **GraphQL schema**. It orchestrates schema loading, diffing, rendering, and the event lifecycle used by [`@graphql-markdown/cli`](https://www.npmjs.com/package/@graphql-markdown/cli) and [`@graphql-markdown/docusaurus`](https://www.npmjs.com/package/@graphql-markdown/docusaurus). Most users should install one of those packages instead of depending on `core` directly.

## Installation

```shell
npm install @graphql-markdown/core
```

## Usage

```ts
import { buildConfig, generateDocFromSchema } from "@graphql-markdown/core";

const config = await buildConfig({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
});

await generateDocFromSchema(config);
```

### Event system

`core` exposes a cancellable event emitter so that formatters, printers, and custom scripts can hook into schema loading, diff checks, and rendering:

```ts
import { getEvents, SchemaEvents } from "@graphql-markdown/core";

getEvents().on(SchemaEvents.SCHEMA_LOAD, (event) => {
  console.log("Schema loaded", event);
});
```

See the [event handlers documentation](https://graphql-markdown.dev/docs/advanced/lifecycle-events) for the full list of lifecycle events and their payloads.

## Documentation

- [Configuration Options](https://graphql-markdown.dev/docs/settings)
- [Lifecycle Events](https://graphql-markdown.dev/docs/advanced/lifecycle-events)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
