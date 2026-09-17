# @graphql-markdown/logger

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/logger?style=flat)](https://www.npmjs.com/package/@graphql-markdown/logger)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_logger&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_logger&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_logger)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dlogger)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=logger)

Singleton logger used across GraphQL-Markdown packages. Defaults to `console`, but can be pointed at any object exposing standard log-level methods (`debug`, `error`, `info`, `log`, `warn`) or a custom module such as `@docusaurus/logger`.

## Installation

```shell
npm install @graphql-markdown/logger
```

## Usage

```js
import Logger, { log } from "@graphql-markdown/logger";

log("Info message"); // console output "Info message"

// Point the logger at a named module
await Logger("@docusaurus/logger");
log("Info message", "info"); // Docusaurus log output "Info message"

// Or a custom logger instance
await Logger({ info: (message) => process.stdout.write(message) });
log("Info message", "info"); // custom logger output "Info message"
```

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
