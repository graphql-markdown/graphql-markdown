---
sidebar_position: 5
---

# Settings

By default, the plugin will use the options as defined in the [configuration](/docs/configuration), and they can be overridden using CLI flags.

## `baseURL`

The base URL used by Docusaurus. It will also be used as the folder name under [`rootPath`](#rootpath) for the generated documentation.

| Setting   | CLI flag               | Default  |
| --------- | ---------------------- | -------- |
| `baseURL` | `-b, --base <baseURL>` | `schema` |

## `customDirective`

Use this option to render directive information for types (see [custom directive](/docs/advanced/custom-directive)).

| Setting           | CLI flag        | Default     |
| ----------------- | --------------- | ----------- |
| `customDirective` | _not supported_ | `undefined` |

## `diffMethod`

The method to be used for identifying changes in the schema for triggering the documentation generation.

The possible values are:

- `FORCE`: skip diff, always generate documentation, same as CLI flag `-f` or `--force`.
- `NONE`: skip diff (same as `FORCE`).
- `SCHEMA-DIFF`: use [GraphQL Inspector](https://graphql-inspector.com) to identify changes in the schema (including description).
- `SCHEMA-HASH`: use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters).

| Setting      | CLI flag                  | Default |
| ------------ | ------------------------- | ------- |
| `diffMethod` | `-d, --diff <diffMethod>` | `NONE`  |

<br/>

:::info

The package `@graphql-markdown/diff` is required for using `diffMethod`.
If the package is missing, then the change detection is always skipped.

```shell
npm install @graphql-markdown/diff
```

:::

## `docOptions`

Use these options to tweak some of the Docusaurus documentation features:

- `frontMatter`: set custom front matter entries, see [Docusaurus documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter).
- `index`: enable/disable the index page for categories/groups, see [Docusaurus documentation](https://docusaurus.io/docs/sidebar/items#generated-index-page).
- `pagination`: enable/disable page buttons `Previous` and `Next` [**deprecated**, see note below].
- `toc`: enable/disable page table of content [**deprecated**, see note below].

| Setting                  | CLI flag         | Default |
| ------------------------ | ---------------- | ------- |
| `docOptions.frontMatter` | _not supported_  | `{}`    |
| `docOptions.index`       | `--index`        | `false` |
| `docOptions.pagination`  | `--noPagination` | `true`  |
| `docOptions.toc`         | `--noToc`        | `true`  |

<br/>

```js title="docusaurus.config.js"
plugins: [
    [
      "@graphql-markdown/docusaurus",
       /** @type {import('@graphql-markdown/types').ConfigOptions} */
       {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs",
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
        // highlight-start
        docOptions: {
          frontMatter: {
            pagination_next: null, // disable page navigation next
            pagination_prev: null, // disable page navigation previous
            hide_table_of_contents: true, // disable page table of content
          },
          index: true, // enable generated index pages, same as CLI flag --index
        },
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        },
      },
    ],
  ],
```

<br/>

:::warning[DEPRECATED]

- **`docOptions.pagination`** (CLI flag `--noPagination`) has been replaced by `docOptions.frontMatter`:

  ```js
  docOptions: {
   frontMatter: {
     pagination_next: null, // disable page navigation next
     pagination_prev: null, // disable page navigation previous
   },
  },
  ```

- **`docOptions.toc`** (CLI flag `--noToc`) has been replaced by `docOptions.frontMatter`:

  ```js
  docOptions: {
   frontMatter: {
     hide_table_of_contents: true, // disable page table of content
   },
  },
  ```

:::

## `groupByDirective`

Use a GraphQL directive for creating documentation categories (see [documentation categories](/docs/advanced/group-by-directive)).

| Setting            | CLI flag                                                                        | Default     |
| ------------------ | ------------------------------------------------------------------------------- | ----------- |
| `groupByDirective` | <code>-gdb, --groupByDirective &lt;&#64;directive(field&#124;=fallback)></code> | `undefined` |

## `homepage`

The location of the landing page to be used for the documentation, relative to the current workspace (see [custom homepage](/docs/advanced/homepage)). The file will be copied at the root folder of the generated documentation.

The plugin provides a default page in `assets/generated`.

| Setting    | CLI flag                    | Default        |
| ---------- | --------------------------- | -------------- |
| `homepage` | `-h, --homepage <homepage>` | `generated.md` |

<br/>

:::info

The GraphQL-Markdown template for Docusaurus provides a customized homepage located at `static/index.md`.

:::

## `linkRoot`

The root for links in documentation. It depends on the entry for the schema main page in the Docusaurus sidebar.

| Setting    | CLI flag                | Default |
| ---------- | ----------------------- | ------- |
| `linkRoot` | `-l, --link <linkRoot>` | `/`     |

## `loaders`

GraphQL schema loaders to use (see [schema loading](/docs/advanced/schema-loading)).

| Setting   | CLI flag        | Default |
| --------- | --------------- | ------- |
| `loaders` | _not supported_ | `{ }`   |

## `metatags`

Set page metadata in `<html>`, `<head>` using [Docusaurus head metadata](https://docusaurus.io/docs/markdown-features/head-metadata).

Meta tags are provided as a list of metadata objects, eg `[{ name: "robots", content: "noindex" }]` for `<meta name="robots" content="noindex" />`.

| Setting    | CLI flag        | Default |
| ---------- | --------------- | ------- |
| `metatags` | _not supported_ | `[]`    |

<br/>

```js title="docusaurus.config.js"
plugins: [
    [
      "@graphql-markdown/docusaurus",
       /** @type {import('@graphql-markdown/types').ConfigOptions} */
       {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs",
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
        // highlight-start
        metatags: [
          { name: "robots", content: "noindex" }, // <meta name="robots" content="noindex" />
          { charset: "utf-8" }, // <meta charset="utf-8" />
        ],
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        }
      },
    ],
  ],
```

## `onlyDocDirective`

The schema directive/s is used for selecting types to be rendered in the documentation.

The CLI flag supports multiple values separated by a space character, eg `--only @stable @beta`.

| Setting            | CLI flag                 | Default |
| ------------------ | ------------------------ | ------- |
| `onlyDocDirective` | `--only <@directive...>` | `[]`    |

See also [`skipDocDirective`](#skipdocdirective).

<br/>

:::info

It only applies to types with a location compatible with the directive, i.e. if the `onlyDocDirective` cannot be applied to a type (e.g. `ENUM`) then the type will be displayed.

:::

## `printTypeOptions`

Use these options to toggle type information rendered on pages:

- `codeSection`: display type code section.
- `deprecated`: option for displaying deprecated entities (fields, values, operations).
  - `default`: deprecated entities are displayed with other entities.
  - `group`: deprecated entities are grouped.
  - `skip`: deprecated entities are not displayed (same as [`skipDocDirective`](#skipdocdirective)).
- `exampleSection`: display example section based on directive data (see [Examples](/docs/advanced/examples)).
- `parentTypePrefix`: prefix field names with the parent type name.
- `relatedTypeSection`: display related type sections.
- `typeBadges`: add field type attributes badges.
- `useApiGroup`: split entities in `API` group (executable types) and `Types` group (system types).

| Setting                               | CLI flag                | Default   |
| ------------------------------------- | ----------------------- | --------- |
| `printTypeOptions.codeSection`        | `--noCode`              | `true`    |
| `printTypeOptions.deprecated`         | `--deprecated <option>` | `default` |
| `printTypeOptions.exampleSection`     | `--noExample`           | `false`   |
| `printTypeOptions.parentTypePrefix`   | `--noParentType`        | `true`    |
| `printTypeOptions.relatedTypeSection` | `--noRelatedType`       | `true`    |
| `printTypeOptions.typeBadges`         | `--noTypeBadges`        | `true`    |
| `printTypeOptions.useApiGroup`        | `--noApiGroup`          | `true`    |

<br/>

```js title="docusaurus.config.js"
plugins: [
    [
      "@graphql-markdown/docusaurus",
       /** @type {import('@graphql-markdown/types').ConfigOptions} */
       {
        schema: "./schema/swapi.graphql",
        rootPath: "./docs",
        baseURL: "swapi",
        homepage: "./docs/swapi.md",
        // highlight-start
        printTypeOptions: {
          codeSection: false, // disable code section, same as CLI flag --noCode
          deprecated: "group", // group deprecated entities, same as CLI flag --deprecated group
          exampleSection: false, // disable code section, same as CLI flag --noExample
          parentTypePrefix: false, // disable parent prefix, same as CLI flag --noParentType
          relatedTypeSection: false, // disable related type sections, same as CLI flag --noRelatedType
          typeBadges: false, // disable type attribute badges, same as CLI flag --noTypeBadges
          useApiGroup: false, // disable type API grouping, same as CLI flag --noApiGroup
        },
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        }
      },
    ],
  ],
```

<br/>

:::warning[useApiGroup]

**If you upgraded to version [1.23.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.23.0) or higher**, then in some case the old GraphQL documentation structure is not being removed.

To resolve this, you will need to delete manually all files to get a clean folder and regenerate the documentation, or disable `useApiGroup` to keep the previous behavior.

:::

:::info

See **[customize deprecated sections](/docs/advanced/custom-deprecated-section)** to customize the rendering of `printTypeOptions.deprecated: "group"`.

:::

## `pretty`

Use [`prettier`](https://prettier.io) to format generated files.

| Setting  | CLI flag   | Default |
| -------- | ---------- | ------- |
| `pretty` | `--pretty` | `false` |

<br/>

:::info

The `prettier` package has to be installed separately. If the package is not present locally, then the formatting will always be skipped.

:::

## `runOnBuild`

:::warning[EXPERIMENTAL]

`runOnBuild` is an experimental feature, and it should not be used in production.

:::

When set to `true` enables running doc generation on `docusaurus build`.
If `false`, then the documentation can only be generated with the Docusaurus command `graphql-to-doc`.

| Setting      | CLI flag | Default |
| ------------ | -------- | ------- |
| `runOnBuild` | n/a      | `false` |

## `rootPath`

The output root path for the generated documentation, relative to the current workspace.
It works in relation to [`baseURL`](#baseurl), and the final path will be `rootPath/baseURL`.

| Setting    | CLI flag                | Default  |
| ---------- | ----------------------- | -------- |
| `rootPath` | `-r, --root <rootPath>` | `./docs` |

## `schema`

The GraphQL schema location.

| Setting  | CLI flag                | Default            |
| -------- | ----------------------- | ------------------ |
| `schema` | `-s, --schema <schema>` | `./schema.graphql` |

## `skipDocDirective`

The schema directive/s is used for skipping types from documentation.

The CLI flag supports multiple values separated by a space character, eg `--skip @noDoc @deprecated`.

| Setting            | CLI flag                 | Default |
| ------------------ | ------------------------ | ------- |
| `skipDocDirective` | `--skip <@directive...>` | `[]`    |

See also [`onlyDocDirective`](#onlydocdirective).

<br/>

:::danger

Declaring the same type in both `onlyDocDirective` and `skipDocDirective` will generate an error.

:::

:::info

Types with `@deprecated` directive can also be skipped using the setting **[`printTypeOptions.deprecated: "skip"`](#printtypeoptions)** or the flag `--deprecated skip`.

:::

## `tmpDir`

The folder used for storing schema copy and signature is used by [`diffMethod`](#diffmethod) setting.

| Setting  | CLI flag             | Default          |
| -------- | -------------------- | ---------------- |
| `tmpDir` | `-t, --tmp <tmpDir>` | _OS temp folder_ |
