---
slug: /
---
# GraphQL Documentation Generator for Docusaurus 2

[![npm](https://img.shields.io/npm/dt/@edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator)
[![Latest Version](https://img.shields.io/npm/v/@edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator)
[![GitHub License](https://img.shields.io/github/license/edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://raw.githubusercontent.com/edno/docusaurus2-graphql-doc-generator/main/LICENSE)
[![Coverage Status](https://img.shields.io/coveralls/github/edno/graphql-markdown?style=flat-square)](https://coveralls.io/github/edno/graphql-markdown?branch=main)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat-square&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fedno%2Fgraphql-markdown%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/edno/graphql-markdown/main)

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

You can define some or all of the plugin options directly at the plugin level in in the Docusaurus configuration file `docusaurus.config.js`:

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

A sidebar file `sidebar-schema.js` will be generated for the documentation, you have them different options depending on your Docusaurus setup:

#### 1. Single Docs instance

In this use case, you have a unique set of documentation, then you just need to add a reference to `sidebar-schema.js` into the default `sidebar.js`.

```js
module.exports = {
  docsSidebar: [
    // ... your site's sidebar
  ],
  ...require("./docs/swapi/sidebar-schema.js"),
};
```

##### Important

The sidebar path must be relative to the `sidebars.js` location. By default, the plugin provides a relative path from the root folder of Docusaurus.

> For example: if your `sidebars.js` is located under `./src` folder, then you need to go one level up in the path: `./../docs/swapi/sidebar-schema`

#### 2. Docs Multi-instance

In this use case, you have multiple sets of documentation (a.k.a. [Docs Multi-instance](https://docusaurus.io/docs/next/docs-multi-instance)), then you need to add a reference to `sidebar-schema.js` into the dedicated instance of `@docusaurus/plugin-content-docs`:

```js
plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'api',
        path: 'api',
        routeBasePath: 'api',
        sidebarPath: require.resolve('./api/sidebar-schema.js'),
        // ... other options
      },
    ],
  ],
```

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
| `homepage`   | `-h, --homepage <homepage>` | `generated.md`     | The location of the landing page to be used for the documentation, relative to the current workspace. The file will be copied at the root folder of the generated documentation.<br />By default, the plugin provides a default page `assets/generated.md`.                                                                                                                                                                                                                          |
| `diffMethod` | `-d, --diff <diffMethod>`   | `SCHEMA-DIFF`      | The method to be used for identifying changes in the schema for triggering the documentation generation. The possible values are:<br /> - `SCHEMA-DIFF`: use [GraphQL Inspector](https://graphql-inspector.com/) for identifying changes in the schema (including description)<br /> - `SCHEMA-HASH`: use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters)<br />Any other value will disable the change detection. |
| `tmpDir`     | `-t, --tmp <tmpDir>`        | _OS temp folder_   | The folder used for storing schema copy and signature used by `diffMethod`.                                                                                                                                                                                                                                                                                                                                                                                                                         |
|              | `-f, --force`               | -                  | Force documentation generation (bypass diff).                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

#### About `diffMethod`

The `diffMethod` is only used for identifying if the schema has changed. If a change is detected since last documentation generation, then the full schema documentation will be generated.

## Troubleshooting

### `Duplicate "graphql" modules cannot be used at the same time`

Add a `resolutions` entry to your `package.json` file:

```json
"resolutions": {
  "graphql": "15.5.2"
}
```

### `Unable to find any GraphQL type definitions`

Try changing the temporary folder for the plugin by setting `tmpDir: "./.docusaurus"` (see [options](#options) section for more details).

You can also disable the schema diff feature by setting `diffMethod: "NONE"`.

## Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!
