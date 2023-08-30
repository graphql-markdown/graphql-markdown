---
sidebar_position: 3
---

# Getting started

Get started by [creating a new site](#new-site).

Or try GraphQL-Markdown immediately with our [demo](/docs/try-it).

## New site

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

### Generate a new site

Generate a new Docusaurus site using the [GraphQL-Markdown template](https://github.com/graphql-markdown/template).

The template will automatically be added to your project after you run the command:

```bash
npm init docusaurus my-website https://github.com/graphql-markdown/template.git
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

### Add a GraphQL schema loader

See [schema loading](/docs/advanced/schema-loading).

:::tip
The template comes by default with `@graphql-tools/url-loader` for remote schemas.
:::

### Start your site

Run the development server:

```bash
cd my-website
npm start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

:::tip
The `npm run doc` is a template shortcut for command line document generation `npm run docusaurus graphql-to-doc`.
:::

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

## Existing site

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.
- [Docusaurus](https://docusaurus.io/) instance version 2.0 or above with the [docs](https://docusaurus.io/docs/docs-introduction) feature:
  - Docs feature is provided by [`@docusaurus/plugin-content-docs`](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs) or `@docusaurus/preset-classic`.

### Install the plugin

Add the `@graphql-markdown/docusaurus` plugin to your site installation:

```shell
npm install @graphql-markdown/docusaurus graphql
```

:::info
The `graphql` package is a peer-dependency, and it should be installed if not yet present.
:::

### Add a GraphQL schema loader

See [schema loading](/docs/advanced/schema-loading).

### Configure the plugin

See [configuration](/docs/configuration).

## Update your documentation

Build your website:

```bash
npm run docusaurus build
```

**OR**

Run the documentation generator using CLI:

```bash
npm run docusaurus graphql-to-doc
```

The `npm run docusaurus graphql-to-doc` command generates MDX files locally from your GraphQL schema. The possible command's flags are documented in [settings](/docs/settings).
