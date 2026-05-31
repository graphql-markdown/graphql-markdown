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

GraphQL-Markdown supports two main setup paths:

- the official Docusaurus integration for Docusaurus sites
- the CLI with formatter presets for other supported documentation ecosystems

This guide focuses on the Docusaurus path. If you are using Hugo, MkDocs, DocFX, mdBook, or another supported formatter-based setup, start with our [Framework Integration Guide](/docs/advanced/integration-with-frameworks).

:::

If you are setting up Docusaurus, get started by [creating a new site](#new-docusaurus-site).

Or try GraphQL-Markdown immediately with our [demo](/docs/try-it).

If you are not using Docusaurus, install the CLI and formatter presets:

```shell title="shell"
npm install @graphql-markdown/cli @graphql-markdown/formatters graphql
```

Then continue with [Integration with Frameworks](/docs/advanced/integration-with-frameworks) to choose the preset for your documentation stack.

## New Docusaurus site

### Requirements

Node.js version [20.0](https://nodejs.org/en/download/) or above (which can be checked by running `node -v`) is required.

:::info[Package managers]

You can use either `npm`, `yarn`, or `pnpm` as your package manager. The examples in this documentation use `npm`, but you can substitute the commands with your preferred package manager.

When installing Node.js, you are recommended to check all checkboxes related to dependencies.

:::

:::tip

You can use [nvm](https://github.com/nvm-sh/nvm), installed on a single machine, to manage multiple Node.js versions.

:::

### Generate a new site

Generate a new Docusaurus site using the [GraphQL-Markdown template](https://github.com/graphql-markdown/template).

The template will automatically be added to your project after you run the command:

```shell title="shell"
npm init docusaurus my-website https://github.com/graphql-markdown/template.git
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all the necessary dependencies you need to run Docusaurus.

### Add a GraphQL schema loader

A schema loader is required to load your GraphQL schema. The template comes with `@graphql-tools/url-loader` pre-configured for remote schemas.

See [schema loading](/docs/advanced/schema-loading) for other loaders and configuration options.

### Start your site

Run the development server:

```shell title="shell"
cd my-website
npm start
```

:::tip

The `npm run doc` command is a shortcut in the template for command-line document generation: `npm run docusaurus graphql-to-doc`.

:::

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

## Existing Docusaurus site

### Prerequisites

:::note

These requirements are specific to Docusaurus integration. See our [Framework Integration Guide](/docs/advanced/integration-with-frameworks) for formatter-based setups and their requirements.

:::

Your project needs to meet the following requirements:

- Node.js version [20.0](https://nodejs.org/en/download/) or above
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
