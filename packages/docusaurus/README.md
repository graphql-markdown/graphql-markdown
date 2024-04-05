# @graphql-markdown/docusaurus

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/docusaurus?style=flat)](https://www.npmjs.com/package/@graphql-markdown/docusaurus)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_docusaurus&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_docusaurus)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=graphql-markdown_docusaurus&metric=coverage)](https://sonarcloud.io/summary/new_code?id=graphql-markdown_docusaurus)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain%3Fmodule%3Ddocusarus)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main?module=docusarus)

**Docusaurus** [docs feature](https://docusaurus.io/docs/docs-introduction) plugin for generating **Markdown documentation** from a **GraphQL schema**.

## Installation

**`graphql` package is a peer-dependency, and it should be installed separately.**

```shell
npm install @graphql-markdown/docusaurus graphql
```

Add `@graphql-markdown/docusaurus` to your site's `docusaurus.config.js` plugins option:

```js
module.exports = {
  // ...
  plugins: ["@graphql-markdown/docusaurus"],
};
```

## Usage

The plugin adds a new command `graphql-to-doc` to the [Docusaurus CLI](https://docusaurus.io/docs/cli).

```shell
npx docusaurus graphql-to-doc
```

Command line options are described in the [documentation settings](https://graphql-markdown.github.io/docs/settings) page.

## Configuration

See [documentation settings](https://graphql-markdown.github.io/docs/settings) page.

## Troubleshooting

See [documentation troubleshooting](https://graphql-markdown.github.io/docs/troubleshooting) page.

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.
