# @graphql-markdown/helpers

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/helpers?style=flat)](https://www.npmjs.com/package/@graphql-markdown/helpers)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_helpers&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_helpers)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_helpers&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_helpers)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Dhelpers)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=helpers)

Reusable helpers for customizing GraphQL-Markdown output: rendering custom descriptions and badges from schema directives, wiring directive-based decorators, and shared Markdown-formatting utilities used by formatter presets.

## Installation

```shell
npm install @graphql-markdown/helpers
```

## Usage

### Custom directive description

```js
import { directiveDescriptor } from "@graphql-markdown/helpers";

// customDirective.version.descriptor in your GraphQL-Config
export default (directive, type) =>
  directiveDescriptor(
    directive,
    type,
    "${description} is ${major}.${minor}.${patch}",
  );
```

### Custom directive badge

```js
import { directiveTag } from "@graphql-markdown/helpers";

// customDirective.auth.tag in your GraphQL-Config
export default (directive, type) =>
  directiveTag(directive, type, "badge--warning");
```

### Directive-based decorators

```ts
import { withDirective } from "@graphql-markdown/helpers";

const decorator = withDirective("deprecated", (directive, options, context) => {
  // render decorator content derived from the directive's definition
});
```

## Documentation

- [Custom Directives](https://graphql-markdown.dev/docs/advanced/custom-directive)
- [Decorators](https://graphql-markdown.dev/docs/advanced/decorators)

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest, you'll be creating employment for local families and restoring wildlife habitats.
