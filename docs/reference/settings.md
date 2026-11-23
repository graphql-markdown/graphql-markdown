---
sidebar_position: 20
description: Complete reference of all GraphQL-Markdown settings, CLI flags, and configuration options with default values and examples.
keywords:
  - GraphQL-Markdown settings
  - CLI options
  - configuration reference
  - plugin options
  - documentation settings
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Settings

Every setting is a plugin option in your config file, and most have a CLI flag that overrides it. Run the CLI with `npx docusaurus graphql-to-doc` (Docusaurus plugin) or `npx gqlmd graphql-to-doc` (standalone), and see [configuration](/docs/reference/configuration) for where the config lives.

A setting that is not listed on this page is rejected with an error. The error names each unsupported setting and suggests the closest supported one for a likely typo. If you are upgrading from an earlier version, see [Upgrade to 1.44](/docs/guides/upgrade-1-44).

## At a glance

| Option                                  | Type                | Default            | Purpose                                                         |
| :-------------------------------------- | :------------------ | :----------------- | :-------------------------------------------------------------- |
| [`schema`](#schema)                     | `string`            | `./schema.graphql` | Path, URL or introspection result of the schema                 |
| [`loaders`](#loaders)                   | `object`            | `{ }`              | GraphQL schema loaders                                          |
| [`rootPath`](#rootpath)                 | `string`            | `./docs`           | Root folder for the generated documentation                     |
| [`baseURL`](#baseurl)                   | `string`            | `schema`           | Base URL and output folder name under `rootPath`                |
| [`linkRoot`](#linkroot)                 | `string`            | `/`                | Root path used for type cross-links                             |
| [`docOptions`](#docoptions)             | `object`            | -                  | Index pages, front matter, category sort, header IDs            |
| [`printTypeOptions`](#printtypeoptions) | `object`            | -                  | Hierarchy, deprecated handling, badges, parent prefix           |
| [`groupByDirective`](#groupbydirective) | `string`            | `undefined`        | Group types by a directive: `@directive(field\|=fallback)`      |
| [`homepage`](#homepage)                 | `string` \| `false` | `generated.md`     | Landing page file, `false` to disable                           |
| [`id`](#id)                             | `string`            | `default`          | Identifier of the configuration instance                        |
| [`onlyDocDirective`](#onlydocdirective) | `string[]`          | `[]`               | Include only types with these directives                        |
| [`skipDocDirective`](#skipdocdirective) | `string[]`          | `[]`               | Exclude types with these directives                             |
| [`decorators`](#decorators)             | `object`            | `undefined`        | Render custom content for schema nodes                          |
| [`formatter`](#formatter)               | `string`            | `undefined`        | Package name or path to a formatter module                      |
| [`outputAdapter`](#outputadapter)       | `object`            | local filesystem   | Write pages somewhere other than the filesystem                 |
| [`metatags`](#metatags)                 | `object[]`          | `[]`               | Page `<head>` metadata                                          |
| [`pretty`](#pretty)                     | `boolean`           | `false`            | Format generated files with Prettier                            |
| [`force`](#force)                       | `boolean`           | `false`            | Force regeneration of all files                                 |
| [`diffMethod`](#diffmethod)             | `string`            | `NONE`             | Change detection: `NONE`, `FORCE`, `SCHEMA-DIFF`, `SCHEMA-HASH` |
| [`tmpDir`](#tmpdir)                     | `string`            | _OS temp folder_   | Folder for the schema copy and signature                        |
| [`telemetry`](#telemetry)               | `boolean`           | _on_               | Anonymous usage telemetry                                       |
| [`--config`](#--config)                 | flag                | `null`             | Print the resolved configuration                                |

## CLI flags

Every flag below works with `npx docusaurus graphql-to-doc` (Docusaurus plugin) and `npx gqlmd graphql-to-doc` (standalone CLI), and overrides the matching setting.

| Flag                        | Setting                                                  | Description                                  |
| --------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| `-s, --schema <path>`       | [`schema`](#schema)                                      | Schema file, URL, or introspection JSON      |
| `-b, --base <baseURL>`      | [`baseURL`](#baseurl)                                    | Base URL and output folder name              |
| `-r, --root <rootPath>`     | [`rootPath`](#rootpath)                                  | Root output folder                           |
| `-l, --link <linkRoot>`     | [`linkRoot`](#linkroot)                                  | Root path for cross-links                    |
| `-h, --homepage <file>`     | [`homepage`](#homepage)                                  | Custom homepage file                         |
| `-f, --force`               | [`force`](#force)                                        | Skip diff, always regenerate                 |
| `-d, --diff <method>`       | [`diffMethod`](#diffmethod)                              | Diff method (`NONE`, `SCHEMA-DIFF`, etc.)    |
| `-t, --tmp <dir>`           | [`tmpDir`](#tmpdir)                                      | Temp dir for schema diffing                  |
| `--index`                   | [`docOptions.index`](#docoptions)                        | Generate category index pages                |
| `--hierarchy <type>`        | [`printTypeOptions.hierarchy`](#printtypeoptions)        | Folder structure: `api`, `entity`, `flat`    |
| `--deprecated <option>`     | [`printTypeOptions.deprecated`](#printtypeoptions)       | `default`, `group`, or `skip`                |
| `--noParentType`            | [`printTypeOptions.parentTypePrefix`](#printtypeoptions) | Hide parent type prefix on fields            |
| `--noTypeBadges`            | [`printTypeOptions.typeBadges`](#printtypeoptions)       | Hide type attribute badges                   |
| `--noSectionId`             | [`docOptions.sectionHeaderId`](#docoptions)              | Disable section header IDs for permalinks    |
| `--only <@directive...>`    | [`onlyDocDirective`](#onlydocdirective)                  | Include only types with these directives     |
| `--skip <@directive...>`    | [`skipDocDirective`](#skipdocdirective)                  | Exclude types with these directives          |
| `--groupByDirective <expr>` | [`groupByDirective`](#groupbydirective)                  | Group by directive: `@dir(field\|=fallback)` |
| `--pretty`                  | [`pretty`](#pretty)                                      | Format output with Prettier                  |
| `--formatter <pkg>`         | [`formatter`](#formatter)                                | Formatter package name or path               |
| `--config`                  | [`--config`](#--config)                                  | Print resolved config (debug)                |
| `--no-telemetry`            | [`telemetry`](#telemetry)                                | Disable anonymous usage telemetry            |

`--formatter` is only registered when the CLI has a default formatter package, as `@graphql-markdown/docusaurus` does. The standalone `gqlmd` command doesn't expose it, so set `formatter` in your configuration file instead.

## Input

Where the schema comes from and how its pages are addressed.

### `schema`

The GraphQL schema location.

| Setting  | CLI flag                | Default            |
| -------- | ----------------------- | ------------------ |
| `schema` | `-s, --schema <schema>` | `./schema.graphql` |

### `loaders`

GraphQL schema loaders to use (see [schema loading](/docs/guides/schema-loading)).

| Setting   | CLI flag        | Default |
| --------- | --------------- | ------- |
| `loaders` | _not supported_ | `{ }`   |

### `rootPath`

The output root path for the generated documentation, relative to the current workspace.
It works with [`baseURL`](#baseurl), and the final path will be `rootPath/baseURL`.

| Setting    | CLI flag                | Default  |
| ---------- | ----------------------- | -------- |
| `rootPath` | `-r, --root <rootPath>` | `./docs` |

### `baseURL`

The base URL used by Docusaurus. It will also be used as the folder name under [`rootPath`](#rootpath) for the generated documentation.

| Setting   | CLI flag               | Default  |
| --------- | ---------------------- | -------- |
| `baseURL` | `-b, --base <baseURL>` | `schema` |

### `linkRoot`

The root for links in documentation. It depends on the entry for the schema main page in the Docusaurus sidebar.

| Setting    | CLI flag                | Default |
| ---------- | ----------------------- | ------- |
| `linkRoot` | `-l, --link <linkRoot>` | `/`     |

## Output structure

How generated pages are organized, named and linked.

### `docOptions`

Use these options to tweak some of the static documentation generator features:

- `categorySort`: control how categories are sorted in the sidebar. Can be `"natural"` for alphabetical sorting or a custom compare function. When enabled, folder names are automatically prefixed with zero-padded order numbers (e.g., `01-objects`, `02-queries`). When not set, the order depends on document generator folders sorting and no prefixes are added.
- `frontMatter`: set custom front matter entries as key/value. If set to `false`, then it will disable the frontmatter and print a level 1 title as the page title.
- `index`: enable/disable the index page for categories/groups, see [Docusaurus documentation](https://docusaurus.io/docs/sidebar/items#generated-index-page) &mdash; **ONLY FOR DOCUSAURUS**
- `sectionHeaderId`: enable/disable the generation of custom header IDs for permalinks. When disabled, field and argument names are printed without a link, since their headings have no known anchor. The syntax depends on the formatter:
  - Docusaurus 3.10 and later: `### Section {/* #ID */}` (see [Strict Heading IDs](https://docusaurus.io/blog/releases/3.10#strict-heading-ids) and [heading IDs](https://docusaurus.io/docs/markdown-features/toc#heading-ids)).
  - Fumadocs: `### Section [#ID]`.
  - Other formatters: the classic `### Section {#ID}`.
  - Starlight and Vocs have no custom header ID syntax, so the classic one is escaped as `### Section \{#ID\}` to keep the page valid MDX. It is only resolved if a remark plugin such as `remark-custom-heading-id` is configured.
  - DocFX does not support `{#ID}` by default, so its formatter appends an HTML anchor `<a id="ID"></a>` to the heading instead.
  - Override `formatMDXPermalink` in a [custom formatter](#formatter) to change it.

| Setting                      | CLI flag        | Default |
| ---------------------------- | --------------- | ------- |
| `docOptions.categorySort`    | _not supported_ | -       |
| `docOptions.frontMatter`     | _not supported_ | `{}`    |
| `docOptions.index`           | `--index`       | `false` |
| `docOptions.sectionHeaderId` | `--noSectionId` | `true`  |

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
          categorySort: "natural", // sort categories alphabetically and prefix with order numbers (01-objects, 02-queries, etc.)
          sectionHeaderId: false, // disable custom section header IDs (restores previous behavior)
        },
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        },
      },
    ],
  ],
```

#### Compatibility between options

The `categorySort` option works seamlessly with:

- **`hierarchy` option**: Works with all hierarchy types (`api`, `entity`, `flat`)
- **`groupByDirective` option**: When using custom groups, categories are sorted based on group names and prefixed accordingly
- **`deprecated` option**: Deprecated categories are sorted along with other categories

Example with `groupByDirective`:

```js
docOptions: {
  categorySort: "natural",      // Sort groups alphabetically and prefix with order numbers
},
groupByDirective: {
  directive: "doc",
  field: "category",
  fallback: "Common",
}
```

This generates folder names like: `01-common`, `02-internal`, `03-public`

### `printTypeOptions`

Use these options to toggle the type of information rendered on pages:

- `deprecated`: option for displaying deprecated entities (fields, values, operations).
  - `default`: deprecated entities are displayed with other entities.
  - `group`: deprecated entities are grouped.
  - `skip`: deprecated entities are not displayed (same as [`skipDocDirective`](#skipdocdirective)).
- `exampleSection`: configure example rendering based on directive data (see [Examples](/docs/guides/examples)).
- `hierarchy`: option for type folder structure:
  - `api`: folder structure by operations (`Operations` group) and types `Types` group based on GraphQL entity types.
  - `entity`: folder structure by GraphQL entity types (eg. queries, mutations, scalars, objects...).
  - `flat`: no folder structure (override [`groupByDirective`](#groupbydirective)). Filenames are prefixed with the entity kind to keep them unique, e.g. `objects-user.mdx` and `queries-user.mdx` (since 1.38.0).
  - _Namespaced operations are supported by default and generated as nested operation paths (See [Namespaced Operations](/docs/guides/namespaced-operations))._
- `parentTypePrefix`: prefix field names with the parent type name.
- `typeBadges`: add field type attributes badges.

| Setting                             | CLI flag                | Default   |
| ----------------------------------- | ----------------------- | --------- |
| `printTypeOptions.deprecated`       | `--deprecated <option>` | `default` |
| `printTypeOptions.exampleSection`   | n/a                     | —         |
| `printTypeOptions.hierarchy`        | `--hierarchy`           | `api`     |
| `printTypeOptions.parentTypePrefix` | `--noParentType`        | `true`    |
| `printTypeOptions.typeBadges`       | `--noTypeBadges`        | `true`    |

Use [`beforeComposePageTypeHook`](/docs/customize/hooks) to control section visibility and order. To customize the rendering of `printTypeOptions.deprecated: "group"`, see **[customize deprecated sections](/docs/guides/docusaurus#customize-deprecated-sections)**.

:::danger

Declaring a different option type in the CLI flag `hierarchy` and the config file `hierarchy` will generate an error.

:::

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
          deprecated: "group", // group deprecated entities, same as CLI flag --deprecated group
          exampleSection: {
            field: "example", // use directive field for example rendering
          },
          hierarchy: "entity",  // disable type API grouping, same as CLI flag --hierarchy entity
          parentTypePrefix: false, // disable parent prefix, same as CLI flag --noParentType
          typeBadges: false, // disable type attribute badges, same as CLI flag --noTypeBadges
        },
        formatter: require.resolve("./custom-mdx.cjs"), // use hook-based section composition
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        }
      },
    ],
  ],
```

```js title="custom-mdx.cjs"
const DocusaurusMDX = require("@graphql-markdown/docusaurus/mdx");

const beforeComposePageTypeHook = async (event) => {
  // Hide code and relations sections
  event.output = event.output.filter(
    (key) => key !== "code" && key !== "relations",
  );
};

module.exports = {
  ...DocusaurusMDX,
  beforeComposePageTypeHook,
};
```

#### Custom group names

The `api` option for `hierarchy` can use customized group names (defaults are `operations` and `types`). Pass an object instead of `api`, using the group name as key for the new name:

```js title="docusaurus.config.js"
plugins: [
    [
      "@graphql-markdown/docusaurus",
       /** @type {import('@graphql-markdown/types').ConfigOptions} */
       {
        // highlight-start
        printTypeOptions: {
          hierarchy: { // no customization 'hierarchy: "api"' (default)
            api: { // enable useApiGroup with custom groups name
              operations: "api", // rename the group 'operations' to 'api'
              //group 'types' left unchanged
            }
          }
        },
        // highlight-end
      },
    ],
  ],
```

### `groupByDirective`

Use a GraphQL directive for creating documentation categories (see [documentation categories](/docs/guides/group-by-directive)).

| Setting            | CLI flag                                                                  | Default     |
| ------------------ | ------------------------------------------------------------------------- | ----------- |
| `groupByDirective` | <code>--groupByDirective &lt;&#64;directive(field&#124;=fallback)></code> | `undefined` |

### `homepage`

The location of the landing page to be used for the documentation, relative to the current workspace (see [custom homepage](/docs/guides/docusaurus#custom-homepage)). The file will be copied to the root folder of the generated documentation.

The plugin provides a default page in `assets/generated`.

| Setting    | CLI flag                    | Default        |
| ---------- | --------------------------- | -------------- |
| `homepage` | `-h, --homepage <homepage>` | `generated.md` |

Set `homepage: false` to disable the homepage generation. The GraphQL-Markdown template for Docusaurus provides a customized homepage located at `static/index.md`.

### `id`

The identifier of the configuration instance. It is used for supporting [additional schemas](/docs/guides/additional-schema): each instance gets its own command `graphql-to-doc:<id>`, and it maps to the [GraphQL Config](/docs/reference/configuration#graphql-config) project of the same name.

| Setting | CLI flag        | Default   |
| ------- | --------------- | --------- |
| `id`    | _not supported_ | `default` |

## Content filtering

Which types and directives end up in the documentation.

### `onlyDocDirective`

The schema directive/s is used for selecting types to be rendered in the documentation.

The CLI flag supports multiple values separated by a space character, eg `--only @stable @beta`.

| Setting            | CLI flag                 | Default |
| ------------------ | ------------------------ | ------- |
| `onlyDocDirective` | `--only <@directive...>` | `[]`    |

It only applies to types with a location compatible with the directive, i.e. if the `onlyDocDirective` cannot be applied to a type (e.g. `ENUM`), then the type will be displayed. See also [`skipDocDirective`](#skipdocdirective).

### `skipDocDirective`

The schema directive/s is used for skipping types from documentation.

The CLI flag supports multiple values separated by a space character, eg `--skip @noDoc @deprecated`.

| Setting            | CLI flag                 | Default |
| ------------------ | ------------------------ | ------- |
| `skipDocDirective` | `--skip <@directive...>` | `[]`    |

Types with `@deprecated` directive can also be skipped using the setting **[`printTypeOptions.deprecated: "skip"`](#printtypeoptions)** or the flag `--deprecated skip`. See also [`onlyDocDirective`](#onlydocdirective).

:::danger

Declaring the same type in both `onlyDocDirective` and `skipDocDirective` will generate an error.

:::

### `decorators`

Select any node in the schema with a predicate and render a custom section, badge, or description text for it (see [decorators](/docs/customize/decorators)).

| Setting      | CLI flag        | Default     |
| ------------ | --------------- | ----------- |
| `decorators` | _not supported_ | `undefined` |

## Rendering

How pages are formatted, written and decorated.

### `formatter`

Provide a custom module for formatting output content. You can also use built-in formatter presets from [`@graphql-markdown/formatters`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/formatters). `@graphql-markdown/docusaurus` comes with `@graphql-markdown/formatters/docusaurus` by default.

The value is a package name, an absolute path or file URL, or a path relative to the current working directory (for example `./lib/custom-mdx.cjs`).

| Setting     | CLI flag      | Default     |
| ----------- | ------------- | ----------- |
| `formatter` | `--formatter` | `undefined` |

:::caution

The `--formatter` CLI flag is only registered when the CLI is set up with a default formatter package, which is what `@graphql-markdown/docusaurus` does. The standalone `gqlmd` command does not expose them, so set `formatter` in your configuration file instead.

:::

The custom module can export individual formatter functions:

| Export                     | Type                                       | Description                                                                                                                                |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `formatMDXBadge`           | `(badge: { text, classname? }) => string`  | Format type badges                                                                                                                         |
| `formatMDXAdmonition`      | `(admonition, meta?) => string`            | Format callout/warning blocks                                                                                                              |
| `formatMDXBullet`          | `(text?: string) => string`                | Format bullet point separators                                                                                                             |
| `formatMDXDetails`         | `(option) => string`                       | Format collapsible sections                                                                                                                |
| `formatMDXFrontmatter`     | `(props?, formatted?, context?) => string` | Format page frontmatter                                                                                                                    |
| `formatMDXLink`            | `(link) => { text, url }`                  | Transform type links                                                                                                                       |
| `formatMDXNameEntity`      | `(name, parentType?) => string`            | Format named entity references                                                                                                             |
| `formatMDXPermalink`       | `(id) => string`                           | Format section header permalinks                                                                                                           |
| `formatMDXSpecifiedByLink` | `(url) => string`                          | Format scalar specification links. Receives an absolute `http(s)` URL; encode it for where you write it (for example as an HTML attribute) |
| `formatMDXTitle`           | `(title) => string`                        | Optional visible page title, printed after the frontmatter                                                                                 |

For detailed examples on formatter functions, see **[Other frameworks](/docs/guides/other-frameworks)**.

Additionally, the module can export:

| Export           | Type     | Description                                    |
| ---------------- | -------- | ---------------------------------------------- |
| `mdxDeclaration` | `string` | Import statements prepended to generated files |
| `mdxExtension`   | `string` | Custom file extension (defaults to `.mdx`)     |

The custom module can also export lifecycle hooks for customizing the generation process, see **[Hooks Recipes](/docs/customize/hooks)**.

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
        formatter: "./lib/custom-mdx.cjs",
        // highlight-end
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader" // local file schema
        }
      },
    ],
  ],
```

### `outputAdapter`

The destination for generated documentation. By default pages are written to the local filesystem under [`rootPath`](#rootpath)/[`baseURL`](#baseurl). Set an adapter to send them somewhere else instead — a CMS storage API, an object store, an in-memory map — without forking the renderer.

| Setting         | CLI flag | Default          |
| --------------- | -------- | ---------------- |
| `outputAdapter` | none     | local filesystem |

An adapter must provide `writeFile` and `readFile`, and may provide `ensureDir`:

```ts
interface OutputAdapter {
  writeFile: (filePath: string, content: string) => Promise<void>;
  readFile: (filePath: string) => Promise<string | undefined>;
  ensureDir?: (
    dirPath: string,
    options?: { forceEmpty?: boolean },
  ) => Promise<void>;
}
```

See **[Output adapter](/docs/customize/output-adapter)** for the full contract and worked examples:

- [when each method is called](/docs/customize/output-adapter#when-each-method-is-called)
- [how paths map onto keys](/docs/customize/output-adapter#paths-are-keys)
- [which formatters read their output back](/docs/customize/output-adapter#reading-back)
- why [omitting `ensureDir`](/docs/customize/output-adapter#deleted-types) leaves pages for deleted types behind
- the [limitations](/docs/customize/output-adapter#limitations) worth knowing before relying on one in a pipeline

### `metatags`

Set page metadata in `<html>`, `<head>` using [Docusaurus head metadata](https://docusaurus.io/docs/markdown-features/head-metadata).

Meta tags are provided as a list of metadata objects, eg `[{ name: "robots", content: "noindex" }]` for `<meta name="robots" content="noindex" />`.

| Setting    | CLI flag        | Default |
| ---------- | --------------- | ------- |
| `metatags` | _not supported_ | `[]`    |

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

### `pretty`

Use [`prettier`](https://prettier.io) to format generated files. The `prettier` package has to be installed separately. If the package is not present locally, then the formatting will always be skipped.

| Setting  | CLI flag   | Default |
| -------- | ---------- | ------- |
| `pretty` | `--pretty` | `false` |

## Run behavior

How and when generation runs.

### `force`

Force generating documentation in an empty folder and set [`diffMethod`](#diffmethod) to `FORCE`. If the folder located at `rootPath/baseURL` is not empty, then the plugin will delete the folder recursively and recreate it.

| Setting | CLI flag      | Default |
| ------- | ------------- | ------- |
| `force` | `-f, --force` | `false` |

### `diffMethod`

The method to be used for identifying changes in the schema for triggering the documentation generation.

The possible values are:

- `FORCE`: skip diff, always generate documentation, also triggered by [`force`](#force) setting.
- `NONE`: skip diff (same as `FORCE`).
- `SCHEMA-DIFF`: use [GraphQL Inspector](https://graphql-inspector.com) to identify changes in the schema (including description).
- `SCHEMA-HASH`: use the schema SHA-256 hash for identifying changes in the schema (this method is sensitive to white spaces and invisible characters).

| Setting      | CLI flag                  | Default |
| ------------ | ------------------------- | ------- |
| `diffMethod` | `-d, --diff <diffMethod>` | `NONE`  |

The package `@graphql-markdown/diff` is required for using `diffMethod`. If the package is missing, then the change detection is always skipped.

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/diff
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/diff
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/diff
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/diff
```

</TabItem>
</Tabs>

### `tmpDir`

The folder used for storing schema copy and signature is used by [`diffMethod`](#diffmethod) setting.

| Setting  | CLI flag             | Default          |
| -------- | -------------------- | ---------------- |
| `tmpDir` | `-t, --tmp <tmpDir>` | _OS temp folder_ |

### `telemetry`

Enables or disables [anonymous usage telemetry](/docs/reference/telemetry). Set it to `false` to opt out; `true` only enables telemetry for programmatic use of `@graphql-markdown/core`, and never overrides `DO_NOT_TRACK`, `GRAPHQL_MARKDOWN_TELEMETRY_DISABLED` or `gqlmd telemetry disable`.

| Setting     | CLI flag         | Default |
| ----------- | ---------------- | ------- |
| `telemetry` | `--no-telemetry` | _on_    |

### `--config`

Print the resolved configuration used for generating documentation. This CLI flag is used for debugging purposes.

| Setting | CLI flag   | Default |
| :------ | :--------- | :------ |
|         | `--config` | `null`  |

Example:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npx docusaurus graphql-to-doc --config
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm exec docusaurus graphql-to-doc --config
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn docusaurus graphql-to-doc --config
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bunx docusaurus graphql-to-doc --config
```

</TabItem>
</Tabs>
