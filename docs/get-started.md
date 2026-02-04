---
sidebar_position: 30
description: Quick start guide for installing and configuring GraphQL-Markdown with Docusaurus. Generate documentation from your GraphQL schema in minutes.
keywords:
  - GraphQL-Markdown installation
  - Docusaurus setup
  - GraphQL documentation
  - getting started
  - configuration
---

# Getting started

:::info

While GraphQL-Markdown was initially developed as a Docusaurus plugin, it now supports various MDX documentation generators. This guide focuses on the Docusaurus integration - for other frameworks, please see our [Framework Integration Guide](/docs/advanced/integration-with-frameworks).

:::

Get started by [creating a new site](#new-docusaurus-site).

Or try GraphQL-Markdown immediately with our [demo](/docs/try-it).

## New Docusaurus site

### Requirements

Node.js version [16.14](https://nodejs.org/en/download/) or above (which can be checked by running `node -v`) is required.

:::info Package managers

You can use either `npm`, `yarn`, or `pnpm` as your package manager. The examples in this documentation use `npm`, but you can substitute the commands with your preferred package manager.

When installing Node.js, you are recommended to check all checkboxes related to dependencies.

:::

:::tip

You can use [nvm](https://github.com/nvm-sh/nvm) for managing multiple Node.js versions on a single machine installed.

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

:::tip

The template comes by default with `@graphql-tools/url-loader` for remote schemas.

:::

### Start your site

Run the development server:

```shell title="shell"
cd my-website
npm start
```

The `cd` command changes the directory you're working in. To work with your newly created Docusaurus site, you'll need to navigate the terminal there.

:::tip

The `npm run doc` is a template shortcut for command line document generation `npm run docusaurus graphql-to-doc`.

:::

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

## Existing Docusaurus site

### Requirements

:::note

These requirements are specific to Docusaurus integration. See our [Framework Integration Guide](/docs/advanced/integration-with-frameworks) for other frameworks' requirements.

:::

Your project needs to meet the following requirements:

- Node.js version [16.14](https://nodejs.org/en/download/) or above
- [Docusaurus](https://docusaurus.io/) instance version 2.0 or above with the [docs plugin](https://docusaurus.io/docs/docs-introduction) enabled
- [GraphQL.js](https://graphql.org/graphql-js/) version 16.0 or above

### Install the plugin

Add the `@graphql-markdown/docusaurus` plugin to your site installation:

```shell title="shell"
npm install @graphql-markdown/docusaurus graphql
```

### Add a GraphQL schema loader

See [schema loading](/docs/advanced/schema-loading).

### Configure the plugin

See [configuration](/docs/configuration).

## Update your documentation

Build your website:

```shell title="shell"
npm run docusaurus build
```

**OR**

Run the documentation generator using CLI:

```shell title="shell"
npm run docusaurus graphql-to-doc
```

The `npm run docusaurus graphql-to-doc` command generates MDX files locally from your GraphQL schema. The possible command flags are documented in [settings](/docs/settings).
