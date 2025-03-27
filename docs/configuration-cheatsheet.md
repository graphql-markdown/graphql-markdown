---
sidebar_position: 41
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

| Option      | Type      | Default | Description                                         |
| ----------- | --------- | ------- | --------------------------------------------------- |
| `linkRoot`  | `boolean` | `false` | Link types to root documentation                    |
| `homepage`  | `string`  | —       | Custom homepage content file                        |
| `hierarchy` | `string`  | `api`   | Documentation structure: `api`, `entity`, or `flat` |
| `index`     | `boolean` | `false` | Generate category indices                           |
| `pretty`    | `boolean` | `false` | Format generated Markdown files                     |

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

## Advanced Options

| Option   | Type      | Default | Description                            |
| -------- | --------- | ------- | -------------------------------------- |
| `force`  | `boolean` | `false` | Force regeneration of all files        |
| `diff`   | `string`  | —       | Diff method for schema changes         |
| `tmpDir` | `string`  | —       | Temporary directory for schema diffing |
