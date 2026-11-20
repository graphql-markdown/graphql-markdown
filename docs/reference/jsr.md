---
sidebar_position: 40
description: Install the GraphQL-Markdown libraries from JSR for Deno, Node.js and Bun, and use them from your own code.
keywords:
  - GraphQL-Markdown JSR
  - jsr.io
  - Deno
  - Bun
  - GraphQL documentation API
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# JSR

The GraphQL-Markdown libraries are also published on [JSR](https://jsr.io/@graphql-markdown): `core`, `graphql`, `utils`, `formatters`, `printer-legacy`, `helpers`, `diff`, `logger`, `telemetry` and `types`. Use them to generate the documentation from your own code, as shown in [Use the API](/docs/get-started#use-the-api).

The CLI (`gqlmd`), the Docusaurus plugin, the scaffolder and the Nuxt theme are published on npm only. JSR has no executables, so use npm to get the `gqlmd` command.

## Install

<Tabs groupId="runtime" queryString>
<TabItem value="deno" label="Deno" default>

```shell
deno add jsr:@graphql-markdown/core
```

</TabItem>
<TabItem value="node" label="Node.js">

```shell
npx jsr add @graphql-markdown/core
```

</TabItem>
<TabItem value="bun" label="Bun">

```shell
bunx jsr add @graphql-markdown/core
```

</TabItem>
</Tabs>

## GraphQL.js version

The JSR packages depend on [GraphQL.js](https://graphql.org/graphql-js/) 17. The npm packages support versions 16 and 17.

:::warning

If your project uses GraphQL.js 16, install from npm instead. Installing from JSR adds a second copy of `graphql`, and a schema built with one copy is rejected by the other.

:::

## Optional features

Some features load their package only when they are used, so a JSR install does not include it:

| Feature                                                             | Package                        |
| ------------------------------------------------------------------- | ------------------------------ |
| [Schema loaders](/docs/guides/schema-loading)                       | `@graphql-tools/*-loader`      |
| [GraphQL Config](/docs/reference/configuration#graphql-config) file | `graphql-config`               |
| [`pretty`](/docs/reference/settings#pretty)                         | `prettier`                     |
| [`diffMethod`](/docs/reference/settings#diffmethod)                 | `@graphql-markdown/diff`       |
| [`formatter`](/docs/reference/settings#formatter) presets           | `@graphql-markdown/formatters` |

- **Node.js and Bun**: install the packages for the features you use, for example `npm install graphql-config`.
- **Deno**: the packages are fetched from JSR or npm the first time the feature runs. Allow it with `--allow-import` (or `-A`), see [Deno permissions for dynamic imports](https://docs.deno.com/runtime/fundamentals/modules/#dynamic-imports).
- On Deno, a loader or other package named without a version is fetched at its latest version. Pin one with an `npm:` specifier, for example `GraphQLFileLoader: "npm:@graphql-tools/graphql-file-loader@^9.0.0"`.

If a package cannot be loaded, the feature is skipped with a warning and the generation continues.
