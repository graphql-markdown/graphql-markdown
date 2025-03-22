[![GraphQL-Markdown](https://user-images.githubusercontent.com/324670/188957463-dae99daa-763d-466e-91f4-0629f455df74.svg)](https://graphql-markdown.dev)

<h1 align="center">Flexible documentation for GraphQL schemas</h1>

[![Latest Version](https://img.shields.io/npm/v/@graphql-markdown/docusaurus?style=flat)](https://www.npmjs.com/package/@graphql-markdown/docusaurus)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/graphql-markdown/graphql-markdown)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This plugin generates **Markdown pages** from a **GraphQL schema** for ~~**Docusaurus** [docs feature](https://docusaurus.io/docs/docs-introduction)~~ <mark>any Markdown static site generator</mark> (see [release 1.29.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.29.0)).

## Installation (Docusaurus)

**`graphql` package is a peer-dependency, and should be installed separately.**

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

## Usage (Docusaurus)

The plugin adds a new command `graphql-to-doc` to the [Docusaurus CLI](https://docusaurus.io/docs/cli).

```shell
npx docusaurus graphql-to-doc
```

Command line options are described in the [documentation settings](https://graphql-markdown.dev/docs/settings) page.

## Configuration

See [documentation configuration](https://graphql-markdown.dev/docs/configuration) page.

## Troubleshooting

See [documentation troubleshooting](https://graphql-markdown.dev/docs/troubleshooting) page.

## License

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Contributions

[Contributions](https://github.com/graphql-markdown/graphql-markdown/blob/main/CONTRIBUTING.md), issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!

<p align="center">
  <a href="https://github.com/graphql-markdown/graphql-markdown/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=graphql-markdown/graphql-markdown&columns=8" />
  </a>
</p>
