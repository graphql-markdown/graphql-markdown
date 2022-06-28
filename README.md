---
slug: /
---
# GraphQL Documentation Generator for Docusaurus

[![Latest Version](https://img.shields.io/npm/v/@edno/docusaurus2-graphql-doc-generator?style=flat-square)](https://www.npmjs.com/package/@edno/docusaurus2-graphql-doc-generator)
[![GitHub License](https://img.shields.io/github/license/graphql-markdown/graphql-markdown?style=flat-square)](https://raw.githubusercontent.com/graphql-markdown/graphql-markdown/main/LICENSE)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/graphql-markdown/graphql-markdown)
[![Coverage Status](https://img.shields.io/coveralls/github/graphql-markdown/graphql-markdown?style=flat-square)](https://coveralls.io/github/graphql-markdown/graphql-markdown?branch=main)
[![Mutation Score](https://img.shields.io/endpoint?label=mutation%20score&style=flat-square&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fgraphql-markdown%2Fgraphql-markdown%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/graphql-markdown/graphql-markdown/main)
[![Sonar Tech Debt](https://img.shields.io/sonar/tech_debt/graphql-markdown_graphql-markdown/main?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/project/overview?id=graphql-markdown_graphql-markdown)
[![Snyk Package Health](https://snyk.io/advisor/npm-package/@edno/docusaurus2-graphql-doc-generator/badge.svg)](https://snyk.io/advisor/npm-package/@edno/docusaurus2-graphql-doc-generator)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This plugin generates a **Markdown documentation** from a **GraphQL schema**.

The documentation is generated for **Docusaurus** [docs feature](https://docusaurus.io/docs/docs-introduction).

## Try it

Use the [CodeSandbox template](https://codesandbox.io/s/github/graphql-markdown/graphql-markdown-demo/tree/main?file=/graphql-markdown.config.js) or fork our [demo repo](https://github.com/graphql-markdown/graphql-markdown-demo) to try with your own GraphQL schema.

1. Edit the configuration in `graphql-markdown.config.js`
2. Run `npx docusaurus graphql-to-doc` in a new terminal

## Installation

**`graphql` package is a peer-dependency starting version `1.7.0`, and it must be installed separatly.**

### npm

```shell
npm install @edno/docusaurus2-graphql-doc-generator graphql
```

### Yarn

```shell
yarn add @edno/docusaurus2-graphql-doc-generator graphql
```

Add `@edno/docusaurus2-graphql-doc-generator` to your site's `docusaurus.config.js` plugins option:

```js
module.exports = {
  // ...
  plugins: ["@edno/docusaurus2-graphql-doc-generator"],
};
```

## Usage

The plugin adds a new command `graphql-to-doc` to the [Docusaurus CLI](https://docusaurus.io/docs/cli).

```shell
npx docusaurus graphql-to-doc
```

Command line options are described in the section [Options](#options).

## Configuration

You can define some or all of the plugin options directly at the plugin level in the Docusaurus configuration file `docusaurus.config.js`:

```js
module.exports = {
  // ...
  plugins: [
    [
      "@edno/docusaurus2-graphql-doc-generator",
      {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
      },
    ],
  ],
};
```

Each option is described in the section [Options](#options).

See [multi-intance](#plugin-multi-instance) section, if you want to use 2 distinct schemas.

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

For more details about navbar, please refer to Docusaurus 2 [documentation](https://docusaurus.io/docs/api/themes/configuration#navbar-link).

### Sidebars Settings

A sidebar file `sidebar-schema.js` will be generated for the documentation, you have different options depending on your Docusaurus setup:

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

> For example, if your `sidebars.js` is located under `./src` folder, then you need to go one level up in the path: `./../docs/swapi/sidebar-schema`

#### 2. Docs Multi-instance

In this use case, you have multiple sets of documentation (a.k.a. [Docs Multi-instance](https://docusaurus.io/docs/docs-multi-instance)), then you need to add a reference to `sidebar-schema.js` into the dedicated instance of `@docusaurus/plugin-content-docs`:

```js
plugins: [
  [
    "@docusaurus/plugin-content-docs",
    {
      id: "api",
      path: "api",
      routeBasePath: "api",
      sidebarPath: require.resolve("./api/sidebar-schema.js"),
      // ... other options
    },
  ],
],
```

### Plugin Multi-instance

From `1.9.0`, the plugin can support multiple instances.

To add another instance, you need to assign a unique `id` attribute to plugin instances (if not set, then `id` value is `default`).

```js
plugins: [
    [
      "@edno/docusaurus2-graphql-doc-generator",
       {
        // id: 'swapi', // omitted => default instance
        schema: "./schema/swapi.graphql",
        rootPath: "./docs", // docs will be generated under './docs/swapi' (rootPath/baseURL)
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
      },
    ],
    [
      "@edno/docusaurus2-graphql-doc-generator",
      {
        id: "admin",
        schema: "./schema/admin.graphql",
        rootPath: "./docs", // docs will be generated under './docs/admin' (rootPath/baseURL)
        baseURL: "admin",
        homepage: "./docs/admin.md",
      },
    ],
  ],
```

Instance with an `id` will have their own command line:

```shell
npx docusaurus graphql-to-doc:admin
```

## Options

By default, the plugin will use the options as defined in the plugin's [configuration](#configuration), but they can be overridden by passing them with the command.

| Config File        | CLI Flag                                                  | Default                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|--------------------|-----------------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `baseURL`          | `-b, --base <baseURL>`                                    | `schema`                                                    | The base URL to be used by Docusaurus. It will also be used as folder name under `rootPath` for the generated documentation.                                                                                                                                                                                                                                                                                                                                                                        |
| `diffMethod`       | `-d, --diff <diffMethod>`                                 | `SCHEMA-DIFF`                                               | The method to be used for identifying changes in the schema for triggering the documentation generation. The possible values are:<br /> - `SCHEMA-DIFF`: use [GraphQL Inspector](https://graphql-inspector.com/) for identifying changes in the schema (including description)<br /> - `SCHEMA-HASH`: use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters)<br />Any other value will disable the change detection. |
| `docOptions`          | `--noPagination`, `--noToc`                          | `{pagination: true, toc: true}` | Documentation presentation options (see [options](#documentation-options)).                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `groupByDirective` | `-gdb, --groupByDirective <@directive(field\|=fallback)>` | -                                                           | Group documentation by directive (see [groupByDirective](#option-groupbydirective)).                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `homepage`         | `-h, --homepage <homepage>`                               | `generated.md`                                              | The location of the landing page to be used for the documentation, relative to the current workspace. The file will be copied at the root folder of the generated documentation.<br />By default, the plugin provides a default page `assets/generated.md`.                                                                                                                                                                                                                                         |
| `linkRoot`         | `-l, --link <linkRoot>`                                   | `/`                                                         | The root for links in documentation. It depends on the entry for the schema main page in the Docusaurus sidebar.                                                                                                                                                                                                                                                                                                                                                                                    |
| `loaders`          |                                                           | `{GraphQLFileLoader: "@graphql-tools/graphql-file-loader"}` | GraphQL schema loader/s to be used (see [Loaders](#plugin-loaders)).                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `pretty`           | `--pretty`                                                | `false`                                                     | Use `prettier` to format generated files. The package `prettier` has to be installed separately. If `prettier` is not present, then the formatting will be always skipped.                                                                                                                                                                                                                                                                                                                          |
| `rootPath`         | `-r, --root <rootPath>`                                   | `./docs`                                                    | The output root path for the generated documentation, relative to the current workspace. The final path will be `rootPath/baseURL`.                                                                                                                                                                                                                                                                                                                                                                 |
| `schema`           | `-s, --schema <schema>`                                   | `./schema.graphql`                                          | The schema location. It should be compatible with the GraphQL Tools [schema loaders](https://www.graphql-tools.com/docs/schema-loading) (see [Loaders](#plugin-loaders)).                                                                                                                                                                                                                                                                                                                           |
| `tmpDir`           | `-t, --tmp <tmpDir>`                                      | *OS temp folder*                                            | The folder used for storing schema copy and signature used by `diffMethod`.                                                                                                                                                                                                                                                                                                                                                                                                                         |
|                    | `-f, --force`                                             | -                                                           | Force documentation generation (bypass diff).                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

### Documentation options

From `1.10.0`, the plugin allows disabling some of the Docusaurus documentation features:

- `docOptions.pagination`: page buttons `Previous` and `Next`
- `docOptions.toc`: page table of content

By default, the options are enabled. They can be disabled by setting them to `false` in the configuration file, or using the corresponding command line flags.

```js
plugins: [
    [
      "@edno/docusaurus2-graphql-doc-generator",
       {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs",
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
        docOptions: {
          pagination: false, // disable buttons previous and next, same as cli flag --noPagination
          toc: false, // disable page table of content, same as cli flag --noToc
        },
      },
    ],
  ],
```

### Plugin Loaders

Starting version `1.5.0`, `docusaurus2-graphql-doc-generator` only provides `graphql-file-loader` document loader out-of-the-box.
Thus, by default, the `schema` default loading expects a local GraphQL schema definition file (`*.graphql`).

However, this behaviour can be extended by installing additional GraphQL document loaders (see [full list](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders)).

If you want to load a schema from a URL, you first need to install the package `@graphql-tools/url-loader` into your Docusaurus project:

```shell
yarn add @graphql-tools/url-loader
```

Once done, you can declare the loader into `docusaurus2-graphql-doc-generator` configuration:

```js
plugins: [
  [
    "@edno/docusaurus2-graphql-doc-generator",
    {
      // ... other options
      loaders: {
        UrlLoader: "@graphql-tools/url-loader"
      }
    },
  ],
],
```

You can declare as many loaders as you need using the structure:

```ts
type className = string; // UrlLoader

type moduleName = string; // "@graphql-tools/url-loader"
type moduleOptions = { [option: string]: any };

type module = { 
  module: moduleName, 
  options: moduleOptions | undefined 
}

type loaders = {
  [className: className]: moduleName | module
}
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

> ***Tip***
>
> *If you want to hide it from the sidebar (like in the demo), then set the front matter `sidebar_class_name` (or `className` depending on your Docusaurus version) to `navbar__toggle`.*
>
> ```markdown
> ---
> id: schema
> slug: /schema
> title: Schema Documentation
> sidebar_position: 1
> sidebar_class_name: navbar__toggle
> ---
> ```

### Option `diffMethod`

The `diffMethod` is only used for identifying if the schema has changed. If a change is detected since the last documentation generation, then the full schema documentation will be generated.

### Option `groupByDirective`

The `groupByDirective` is used to add grouping to the documentation to provide for an easier user experience to navigate. This is accomplished by adding a directive to all the types you want to have grouped.

For example, we have two mutations called `addCourse` and `dropCourse`, and we want to group them under a category called `Courses`.

We can accomplish this by adding a directive called `doc` with a field `category` to each mutation. Also, we can add a fallback option called `Common` which is for types that we don't explicitly add a directive to.

```graphql
type Mutation{
  AddCourse(input: String): String  @doc(category: "Course") 
}

type Mutation{
  DropCourse(input: String): String  @doc(category: "Course") 
}
```

It can be set either with the command line flag `-gdb`:

```shell
npx docusaurus graphql-to-doc -gdb "@doc(category|=Common)"
```

or the plugin configuration `groupByDirective`:

```js
plugins: [
  [
    "@edno/docusaurus2-graphql-doc-generator",
    {
      // ... other options
      groupByDirective: {
        directive: "doc",
        field: "category",
        fallback: "Common", // default is Miscellaneous
      }
    },
  ],
],
```

## Troubleshooting

### `Duplicate "graphql" modules cannot be used at the same time`

Add a [`resolutions`](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/) entry to your `package.json` file:

```json
"resolutions": {
  "graphql": "15.5.2"
}
```

### `Unable to find any GraphQL type definitions`

Try changing the temporary folder for the plugin by setting `tmpDir: "./.docusaurus"` (see [options](#options) section for more details).

You can also disable the schema diff feature by setting `diffMethod: "NONE"`.

### `Unable to find any GraphQL type definitions for the following pointers`

> This error may occur when upgrading to version `1.5.0` or above.

Install and declare the missing GraphQL document loader package, see [Loaders](#plugin-loaders).

If the error persists, check that you have the correct class name in the configuration declaration.

## Licence

GraphQL-Markdown packages are 100% free and open-source, under the [MIT license](https://github.com/graphql-markdown/graphql-markdown/blob/main/LICENSE).         

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/graphql-markdown/graphql-markdown) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Contributions

[Contributions](https://github.com/graphql-markdown/graphql-markdown/blob/main/CONTRIBUTING.md), issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!

<a href="https://github.com/graphql-markdown/graphql-markdown/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=graphql-markdown/graphql-markdown" />
</a>

Made with [contributors-img](https://contrib.rocks).
