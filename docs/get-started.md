---
sidebar_position: 30
description: Quick start guide for installing and configuring GraphQL-Markdown with Docusaurus, plus the right entry point for formatter-based setups.
keywords:
  - GraphQL-Markdown installation
  - Docusaurus setup
  - GraphQL documentation
  - getting started
  - configuration
---

# Getting started

:::info

This guide covers Docusaurus. For a Nuxt site, see [Nuxt Theme](/docs/advanced/nuxt-theme). For Hugo, MkDocs, DocFX, mdBook and other formatter-based setups, see [Integration with Frameworks](/docs/advanced/integration-with-frameworks).

:::

Start by [creating a new site](#new-docusaurus-site) or [adding GraphQL-Markdown to an existing one](#existing-docusaurus-site). Or try it right away with one of our [demos](/docs/try-it).

## New Docusaurus site

### Requirements

Node.js version [22.12](https://nodejs.org/en/download/) or above (which can be checked by running `node -v`) is required.

:::info[Package managers]

You can use either `npm`, `yarn`, or `pnpm` as your package manager. The examples in this documentation use `npm`, but you can substitute the commands with your preferred package manager.

When installing Node.js, you are recommended to check all checkboxes related to dependencies.

:::

:::tip

You can use [nvm](https://github.com/nvm-sh/nvm), installed on a single machine, to manage multiple Node.js versions.

:::

### Generate a new site

Generate a new Docusaurus site using the `create-graphql-markdown-docs` CLI:

```shell title="shell"
npm create graphql-markdown-docs@latest -- --framework docusaurus
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command scaffolds a new site and installs all the necessary dependencies you need to run Docusaurus.

The same CLI also scaffolds a [Nuxt site](/docs/advanced/nuxt-theme) with `--framework nuxt` (or without the flag to choose interactively).

### Add a GraphQL schema loader

A schema loader is required to load your GraphQL schema. Without `--schema`, the site uses a bundled example schema with `@graphql-tools/graphql-file-loader`. Pass `--schema <path-or-url>` to use your own: the CLI picks the matching loader (URL, JSON, code file, git or GitHub), adds it as a dependency, and writes it into `.graphqlrc`.

See [schema loading](/docs/advanced/schema-loading) for other loaders and configuration options.

### Start your site

Run the development server:

```shell title="shell"
cd my-graphql-docs
npm start
```

:::tip

The `npm run doc` command is a shortcut in the scaffolded site for command-line document generation: `npm run docusaurus graphql-to-doc`.

:::

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

## Existing Docusaurus site

### Prerequisites

:::note

These requirements are specific to Docusaurus integration. See our [Framework Integration Guide](/docs/advanced/integration-with-frameworks) for formatter-based setups and their requirements.

:::

Your project needs to meet the following requirements:

- Node.js version [22.12](https://nodejs.org/en/download/) or above
- [Docusaurus](https://docusaurus.io/) instance version 2.0 or above with the [docs plugin](https://docusaurus.io/docs/docs-introduction) enabled
- [GraphQL.js](https://graphql.org/graphql-js/) version 16.0 or above

### Install the plugin

Add the `@graphql-markdown/docusaurus` plugin to your site installation:

```shell title="shell"
npm install @graphql-markdown/docusaurus graphql
```

### Add a schema loader

See [schema loading](/docs/advanced/schema-loading).

### Configure the plugin

See [configuration](/docs/configuration).

## Update your documentation

Build your website:

```shell title="shell"
npm run docusaurus build
```

Or run the documentation generator directly:

```shell title="shell"
npm run docusaurus graphql-to-doc
```

The `npm run docusaurus graphql-to-doc` command generates MDX files locally from your GraphQL schema. The possible command flags are documented in [settings](/docs/settings).
