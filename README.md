# GraphQL Documentation Generator for Docusaurus 2

[![npm](https://img.shields.io/npm/dt/@edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator)
[![Latest Version](https://img.shields.io/npm/v/@edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator)
[![GitHub license](https://img.shields.io/github/license/edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://raw.githubusercontent.com/edno/docusaurus2-graphql-doc-generator/main/LICENSE)
[![Coverage Status](https://img.shields.io/coveralls/github/edno/graphql-markdown?style=flat-square)](https://coveralls.io/github/edno/graphql-markdown?branch=main)

This plugin generates a **Markdown documentation** from a **GraphQL schema**.

The documentation is generated for **Docusaurus 2** [docs feature](https://v2.docusaurus.io/docs/docs-introduction).

## Installation

### npm

```shell
npm install --save @edno/docusaurus2-graphql-doc-generator
```

### Yarn

```shell
yarn add @edno/docusaurus2-graphql-doc-generator
```

Then you add it in your site's `docusaurus.config.js`'s plugins option:

```js
module.exports = {
  // ...
  plugins: ["@edno/docusaurus2-graphql-doc-generator"],
};
```

## Configuration

You can define some or all of the plugin options directly at the plugin level in your site's `docusaurus.config.js`:

### Plugin Options

```js
module.exports = {
  // ...
  plugins: [
    [
      require.resolve("@edno/docusaurus2-graphql-doc-generator"),
      {
        schema: "https://swapi.graph.cool/",
        rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
      },
    ],
  ],
};
```

Each option is described in the section [Options](#options).

### Site Settings

You will also need to add a link to your documentation on your site. One way to do it is to add it to your site's navbar in `docusaurus.config.js`:

```js
module.exports = {
  // ...
  navbar: {
    items: [
      {
        to: "/swapi/homepage", // adjust the location depending on your baseURL (see configuration)
        label: "SWAPI Schema", // change the label with yours
        position: "left",
      },
    ],
  },
};
```

For more details about navbar, please refer to Docusaurus 2 [documentation](https://v2.docusaurus.io/docs/theme-classic/#navbar-links).

### Sidebars Settings

A sidebar file `sidebar-schema.js` will be generated for the documentation, and you will need to add it to your site's `sidebars.js`:

```js
module.exports = {
  docsSidebar: [
    // ... your site's sidebar
  ],
  ...require("./docs/swapi/sidebar-schema"),
};
```

#### Important

The sidebar path must be relative to the `sidebars.js` location. By default, the plugin provides a relative path from the root folder of Docusaurus.

> For example: if your `sidebars.js` is located under `./src` folder, then you need to go one level up in the path: `./../docs/swapi/sidebar-schema`

### Home Page

If you decide to use your own home page for the GraphQL generated documentation, then set the page ID to `id: schema` and the sidebar position to `sidebar_position: 1`:

```markdown
---
id: schema
slug: /schema
title: Schema Documentation
sidebar_position: 1
---

This documentation has been automatically generated from the GraphQL schema.
```

## Usage

The plugin adds a new command `graphql-to-doc` to the [Docusaurus CLI](https://v2.docusaurus.io/docs/cli).

```shell
npx docusaurus graphql-to-doc
```

### Options

By default, the plugin will use the options as defined in the plugin's [configuration](#configuration), but they can be overriden by passing them with the command.

| Config File  | CLI Flag                    | Default            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | --------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`     | `-s, --schema <schema>`     | `./schema.graphql` | The schema location. It should be compatible with the GraphQL Tools [schema loaders](https://www.graphql-tools.com/docs/schema-loading) (e.g. an URL, a GraphQL file, a JSON file...)..                                                                                                                                                                                                                                                                                                             |
| `rootPath`   | `-r, --root <rootPath>`     | `./docs`           | The output root path for the generated documentation, relative to the current workspace. The final path will be `rootPath/baseURL`.                                                                                                                                                                                                                                                                                                                                                                 |
| `baseURL`    | `-b, --base <baseURL>`      | `schema`           | The base URL to be used by Docusaurus. It will also be used as folder name under `rootPath` for the generated documentation.                                                                                                                                                                                                                                                                                                                                                                        |
| `linkRoot`   | `-l, --link <linkRoot>`     | `/`                | The root for links in documentation. It depends on the entry for the schema main page in the Docusaurus sidebar.                                                                                                                                                                                                                                                                                                                                                                                    |
| `homepage`   | `-h, --homepage <homepage>` | `generated.md`     | The location of the landing page to be used for the documentation, relative to the current workspace. The file will be copied at the root folder of the generated documentation.<br />The plugin provides a [default page](assets/generated.md), but you can use your own.                                                                                                                                                                                                                          |
| `diffMethod` | `-d, --diff <diffMethod>`   | `SCHEMA-DIFF`      | The method to be used for identifying changes in the schema for triggering the documentation generation. The possible values are:<br /> - `SCHEMA-DIFF`: use [GraphQL Inspector](https://graphql-inspector.com/) for identifying changes in the schema (including description)<br /> - `SCHEMA-HASH`: use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters)<br />Any other value will disable the change detection. |
| `tmpDir`     | `-t, --tmp <tmpDir>`        | _OS temp folder_   | The folder used for storing schema copy and signature used by `diffMethod`.                                                                                                                                                                                                                                                                                                                                                                                                                         |
|              | `-f, --force`               | -                  | Force documentation generation (bypass diff).                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

##### About `diffMethod`

The `diffMethod` is only used for identifying if the schema has changed. If a change is detected since last documentation generation, then the full schema documentation will be generated.

## Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!
