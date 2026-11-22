---
sidebar_position: 30
description: Integrate GraphQL-Markdown with popular documentation frameworks using formatter presets or create custom formatters.
keywords:
  - GraphQL-Markdown integration
  - framework support
  - formatter presets
  - custom MDX formatters
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Integration with frameworks

GraphQL-Markdown supports multiple documentation frameworks through formatter presets. Each framework has its own setup guide, or you can create a custom formatter for any framework.

## Choose a path

Use the path that matches your documentation stack:

| If you are using...                        | Recommended path                                                                                                                                                                                                                             |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Docusaurus**                             | Use the `@graphql-markdown/docusaurus` plugin when you want the official Docusaurus integration and default Docusaurus formatter behavior. See [Docusaurus recipes](/docs/guides/docusaurus) for sidebar, styling, and hook recipes.         |
| **Nuxt**                                   | Use the `@graphql-markdown/nuxt-theme` layer (or scaffold one with `npm create graphql-markdown-docs`) for a full reference site — layout, navigation and search included, not just formatted Markdown. See [Nuxt Theme](/docs/guides/nuxt). |
| **Hugo, MkDocs, DocFX, mdBook, or HonKit** | Use `@graphql-markdown/cli` with a formatter preset from `@graphql-markdown/formatters`. This is the main path for non-TS/JS documentation ecosystems.                                                                                       |
| **Starlight, Fumadocs, or Vocs**           | Use `@graphql-markdown/cli` with the matching formatter preset when you already have one of these frameworks in place.                                                                                                                       |
| **Any unsupported framework**              | Start from the closest preset or create a custom formatter module.                                                                                                                                                                           |

The quickest way to wire any supported framework is to run `npm create graphql-markdown-docs@latest` inside your existing site. It detects the framework, asks for your schema and output folder, and writes the configuration for you. See [Add to an existing site](/docs/get-started#with-the-scaffolder-recommended).

For new configurations, use the `formatter` setting.

## Common setup

Install the CLI and formatter presets:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/cli @graphql-markdown/formatters graphql
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/cli @graphql-markdown/formatters graphql
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/cli @graphql-markdown/formatters graphql
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/cli @graphql-markdown/formatters graphql
```

</TabItem>
</Tabs>

Then configure the formatter that matches your framework:

```yaml
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    formatter: "@graphql-markdown/formatters/hugo"
```

## Supported formatters

Install the formatters package:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/formatters
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/formatters
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/formatters
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/formatters
```

</TabItem>
</Tabs>

Then select your framework:

| Framework              | Package                                   | Setup                                                                                                                |
| ---------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Docusaurus**         | `@graphql-markdown/formatters/docusaurus` | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docusaurus/README.md) |
| **Astro Starlight**    | `@graphql-markdown/formatters/starlight`  | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/starlight/README.md)  |
| **Next.js + Fumadocs** | `@graphql-markdown/formatters/fumadocs`   | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/fumadocs/README.md)   |
| **Vocs**               | `@graphql-markdown/formatters/vocs`       | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/vocs/README.md)       |
| **HonKit**             | `@graphql-markdown/formatters/honkit`     | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/honkit/README.md)     |
| **Docsify**            | `@graphql-markdown/formatters/docsify`    | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docsify/README.md)    |
| **Hugo**               | `@graphql-markdown/formatters/hugo`       | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/hugo/README.md)       |
| **MkDocs**             | `@graphql-markdown/formatters/mkdocs`     | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mkdocs/README.md)     |
| **DocFX**              | `@graphql-markdown/formatters/docfx`      | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/docfx/README.md)      |
| **mdBook**             | `@graphql-markdown/formatters/mdbook`     | [Guide](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/formatters/src/mdbook/README.md)     |

### Quick example

Declare the settings in your GraphQL Config file, then run the CLI:

```yaml title=".graphqlrc"
schema: ./schema.graphql
extensions:
  graphql-markdown:
    rootPath: ./docs
    baseURL: api
    formatter: "@graphql-markdown/formatters/docusaurus" # or your framework
```

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npx gqlmd graphql-to-doc
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm exec gqlmd graphql-to-doc
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn gqlmd graphql-to-doc
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bunx gqlmd graphql-to-doc
```

</TabItem>
</Tabs>

The command name is `graphql-to-doc` for the default project, and `graphql-to-doc:<id>` for each additional [GraphQL Config project](/docs/guides/additional-schema#graphql-config).

You can also call the generator programmatically. `runGraphQLMarkdown` takes the configuration as first argument, and CLI-style overrides as second argument:

```js
import { runGraphQLMarkdown } from "@graphql-markdown/cli";

await runGraphQLMarkdown(
  {
    schema: "./schema.graphql",
    rootPath: "./docs",
    baseURL: "api",
    formatter: "@graphql-markdown/formatters/docusaurus", // or your framework
  },
  {}, // CLI flags overrides, eg `{ force: true }`
);
```

## 3rd party packages

Some frameworks have dedicated integration packages beyond the basic formatters:

| Framework     | Framework Link                          | Package                    | NPM                                                             |
| ------------- | --------------------------------------- | -------------------------- | --------------------------------------------------------------- |
| **VitePress** | [vitepress.dev](https://vitepress.dev/) | graphql-markdown-vitepress | [NPM](https://www.npmjs.com/package/graphql-markdown-vitepress) |

## Custom formatter

For frameworks not listed above, write your own formatter module. See [Custom formatter](/docs/customize/custom-formatter).

Examples:

- **Pelican**: a custom formatter built on the `mkdocs` preset (Pelican also uses Python-Markdown). See the [Pelican demo](https://github.com/graphql-markdown/demo-pelican#using-graphql-markdown-with-pelican) for the formatter, the `pelicanconf.py` settings and a docs theme.
