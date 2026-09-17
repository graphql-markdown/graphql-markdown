# @graphql-markdown/printer-legacy

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/printer-legacy?style=flat)](https://www.npmjs.com/package/@graphql-markdown/printer-legacy)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_printer-legacy&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_printer-legacy)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_printer-legacy&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_printer-legacy)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dprinter-legacy)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=printer-legacy)

Legacy Docusaurus-flavored MDX printer for GraphQL-Markdown. Converts GraphQL schema types into MDX pages, and is the printer used by default when no `formatter` is configured. New setups should prefer a formatter preset from [`@graphql-markdown/formatters`](https://www.npmjs.com/package/@graphql-markdown/formatters); this package is kept for backward compatibility with existing Docusaurus configurations and for `customDirective`-based decorators.

## Installation

```shell
npm install @graphql-markdown/printer-legacy
```

## Usage

`printer-legacy` is typically consumed indirectly through [`@graphql-markdown/core`](https://www.npmjs.com/package/@graphql-markdown/core), which builds a `Printer` instance from the resolved configuration. It can also be used directly:

```ts
import { Printer } from "@graphql-markdown/printer-legacy";

await Printer.init(schema, baseURL, options);
const page = await Printer.printType("query", queryType, options);
```

### Custom directive decorators

```ts
import { buildCustomDirectiveDecorators } from "@graphql-markdown/printer-legacy";
```

## Documentation

- [Configuration Options](https://graphql-markdown.dev/docs/settings)
- [Custom Directives](https://graphql-markdown.dev/docs/advanced/custom-directive)
- [Integration with Frameworks](https://graphql-markdown.dev/docs/advanced/integration-with-frameworks)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
