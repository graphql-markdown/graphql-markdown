---
sidebar_position: 41
description: Quickly look up in the most frequently used CLI flag and renderer options for GraphQL-Markdown in one place without digging through the longer Settings guide.
keywords:
  - GraphQL-Markdown setup
  - getting started
  - configuration
---

# Configuration Cheat Sheet

:::note
This is a quick reference guide. All settings are thoroughly documented in the [**Settings** page](/docs/settings).
:::

## Essential Options

| Option     | Type     | Default    | Description                                               |
| ---------- | -------- | ---------- | --------------------------------------------------------- |
| `schema`   | `string` | —          | **Required**. Path to schema file or introspection result |
| `rootPath` | `string` | `./docs`   | Root folder for documentation generation                  |
| `baseURL`  | `string` | `/graphql` | Base URL path for generated documentation                 |

## Document Structure

| Option         | Type                     | Default | Description                                                           |
| -------------- | ------------------------ | ------- | --------------------------------------------------------------------- |
| `linkRoot`     | `string`                 | `/`     | Root path used for type cross-links in generated documentation        |
| `homepage`     | `string`                 | —       | Custom homepage content file                                          |
| `hierarchy`    | `string`                 | `api`   | Documentation structure: `api`, `entity`, or `flat`                   |
| `index`        | `boolean`                | `false` | Generate category indices                                             |
| `categorySort` | `string` \| `function`   | —       | Sort categories: `"natural"` for alphabetical or custom function      |
| `pretty`       | `boolean`                | `false` | Format generated Markdown files                                       |

## Content Options

| Option          | Type      | Default | Description                |
| --------------- | --------- | ------- | -------------------------- |
| `noCode`        | `boolean` | `false` | Hide code sections         |
| `noExample`     | `boolean` | `false` | Hide example sections      |
| `noParentType`  | `boolean` | `false` | Hide parent type prefix    |
| `noRelatedType` | `boolean` | `false` | Hide related types section |
| `noTypeBadges`  | `boolean` | `false` | Hide type badges           |

## Filtering Options

| Option             | Type       | Default   | Description                                                        |
| ------------------ | ---------- | --------- | ------------------------------------------------------------------ |
| `groupByDirective` | `string`   | —         | Group by directive: `@directive(field)` or `@directive(=fallback)` |
| `only`             | `string[]` | —         | Include only types with specified directives                       |
| `skip`             | `string[]` | —         | Exclude types with specified directives                            |
| `deprecated`       | `string`   | `default` | Handling of deprecated items: `default`, `group`, `skip`           |

## Build Control Options

| Option        | Type      | Default | Description                                                       |
| ------------- | --------- | ------- | ----------------------------------------------------------------- |
| `force`       | `boolean` | `false` | Force regeneration of all files                                   |
| `diffMethod`  | `string`  | `NONE`  | Change detection: `NONE`, `FORCE`, `SCHEMA-DIFF`, `SCHEMA-HASH`   |
| `tmpDir`      | `string`  | —       | Temporary directory for storing schema signature (used by diff)   |
| `pretty`      | `boolean` | `false` | Format output files with Prettier (requires `prettier` installed) |
| `mdxParser`   | `string`  | —       | Path to a custom MDX formatter module                             |

## CLI Flags

All config options can be passed as CLI flags to `npx docusaurus graphql-to-doc` or `npx graphql-markdown`.

| Flag                              | Config option                         | Description                                    |
| --------------------------------- | ------------------------------------- | ---------------------------------------------- |
| `-s, --schema <path>`             | `schema`                              | Schema file, URL, or introspection JSON        |
| `-b, --base <baseURL>`            | `baseURL`                             | Base URL and output folder name                |
| `-r, --root <rootPath>`           | `rootPath`                            | Root output folder                             |
| `-l, --link <linkRoot>`           | `linkRoot`                            | Root path for cross-links                      |
| `-h, --homepage <file>`           | `homepage`                            | Custom homepage file                           |
| `-f, --force`                     | `force`                               | Skip diff, always regenerate                   |
| `-d, --diff <method>`             | `diffMethod`                          | Diff method (`NONE`, `SCHEMA-DIFF`, etc.)      |
| `-t, --tmp <dir>`                 | `tmpDir`                              | Temp dir for schema diffing                    |
| `--index`                         | `docOptions.index`                    | Generate category index pages                  |
| `--hierarchy <type>`              | `printTypeOptions.hierarchy`          | Folder structure: `api`, `entity`, `flat`      |
| `--deprecated <option>`           | `printTypeOptions.deprecated`         | `default`, `group`, or `skip`                  |
| `--noParentType`                  | `printTypeOptions.parentTypePrefix`   | Hide parent type prefix on fields              |
| `--noTypeBadges`                  | `printTypeOptions.typeBadges`         | Hide type attribute badges                     |
| `--only <@directive...>`          | `onlyDocDirective`                    | Include only types with these directives       |
| `--skip <@directive...>`          | `skipDocDirective`                    | Exclude types with these directives            |
| `-gdb, --groupByDirective <expr>` | `groupByDirective`                    | Group by directive: `@dir(field\|=fallback)`   |
| `--pretty`                        | `pretty`                              | Format output with Prettier                    |
| `--mdxParser <path>`              | `mdxParser`                           | Custom MDX formatter module                    |
| `--config`                        | —                                     | Print resolved config (debug)                  |
