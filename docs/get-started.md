---
sidebar_position: 30
description: Create a GraphQL API documentation site with the create-graphql-markdown-docs scaffolder (Nuxt or Docusaurus), or add GraphQL-Markdown to an existing site.
keywords:
  - GraphQL-Markdown installation
  - create-graphql-markdown-docs
  - scaffolding
  - Nuxt
  - Docusaurus setup
  - GraphQL documentation
  - getting started
  - configuration
---

# Getting started

The fastest way to start is the [`create-graphql-markdown-docs`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/create-graphql-markdown-docs) scaffolder, which creates a ready-to-run Nuxt or Docusaurus site. You can also [add GraphQL-Markdown to an existing site](#add-to-an-existing-site). Or try it right away with one of our [demos](/docs/try-it).

## Create a new site

### Requirements

Node.js version [22.12](https://nodejs.org/en/download/) or above (which can be checked by running `node -v`) is required.

:::info[Package managers]

You can use either `npm`, `yarn`, `pnpm` or `bun` as your package manager. The examples in this documentation use `npm`, but you can substitute the commands with your preferred package manager.

When installing Node.js, you are recommended to check all checkboxes related to dependencies.

:::

:::tip

You can use [nvm](https://github.com/nvm-sh/nvm), installed on a single machine, to manage multiple Node.js versions.

:::

### Run the scaffolder

You can type these commands into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

```shell title="npm"
npm create graphql-markdown-docs@latest
```

```shell title="pnpm"
pnpm create graphql-markdown-docs
```

```shell title="yarn"
yarn create graphql-markdown-docs
```

```shell title="bun"
bun create graphql-markdown-docs
```

Pass the project directory as an argument to skip that prompt:

```shell title="shell"
npm create graphql-markdown-docs@latest my-docs
```

With npm, flags must follow a `--` separator so that npm forwards them to the CLI:

```shell title="shell"
npm create graphql-markdown-docs@latest my-docs -- --framework docusaurus
```

### What the prompts ask

1. **Framework**: Nuxt (default) or Docusaurus.
2. **Directory**: press Enter to accept `my-graphql-docs`. The directory must not exist yet or must be empty; a non-empty directory is rejected and you are asked again.
3. **Schema**: use the bundled example, or your own (local file, introspection URL, `git:` or `github:` reference). The matching loader is detected and added as a dependency.
4. **Package manager**: detected from the command you used (`pnpm create`, `yarn create`, `bun create`, `npm create`), then from lockfiles. You are only asked if detection fails.
5. **Title** (optional), and a **primary color** for Nuxt.
6. **Install dependencies**.
7. **Git repository**: initialized unless the project is already inside one.

### Choose a framework

- **Nuxt** (default): a full API reference site built on the [`@graphql-markdown/nuxt-theme`](/docs/advanced/nuxt-theme) layer, with live reload when the schema changes.
- **Docusaurus**: a classic Docusaurus site configured with the `@graphql-markdown/docusaurus` plugin.

See [Nuxt Theme](/docs/advanced/nuxt-theme) for what the Nuxt layer provides.

### Use your own schema

A schema loader is required to load your GraphQL schema. Without `--schema`, the site uses a bundled example schema. Pass `--schema <path-or-url>` (or answer the prompt) to use your own: the CLI picks the matching [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders), adds it as a dependency, and writes it into the site configuration (`.graphqlrc` for Docusaurus, `generate-docs.ts` for Nuxt).

| Schema source | Example | Loader added |
| --- | --- | --- |
| Local `.graphql`/`.gql` file | `./schema/api.graphql` | None (default loader) |
| Local `.json` introspection result | `./introspection.json` | `@graphql-tools/json-file-loader` |
| Local code-first schema | `./schema.ts` | `@graphql-tools/code-file-loader` |
| Introspection/SDL endpoint | `https://api.example.com/graphql` | `@graphql-tools/url-loader` |
| Git-hosted file | `git:branch:path/schema.graphql` | `@graphql-tools/git-loader` |
| GitHub-hosted file | `github:owner/repo#branch:path/schema.graphql` | `@graphql-tools/github-loader` |

A local file is copied into the scaffolded project's `schema/` directory; a remote source is referenced as-is.

See [schema loading](/docs/advanced/schema-loading) for other loaders and configuration options.

### Start your site

For a Nuxt site:

```shell title="shell"
cd my-graphql-docs
npm run dev
```

The development server is available at [http://localhost:3000/](http://localhost:3000/).

For a Docusaurus site:

```shell title="shell"
cd my-graphql-docs
npm run doc
npm run start
```

If you skipped the install step, run `npm install` first.

:::tip

The `npm run doc` command is a shortcut in the scaffolded Docusaurus site for command-line document generation: `npm run docusaurus graphql-to-doc`.

:::

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

### Non-interactive usage (CI)

Use `--yes` to accept all defaults and skip every prompt:

```shell title="shell"
npm create graphql-markdown-docs@latest -- --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

| Flag | Description |
| --- | --- |
| `--framework <nuxt\|docusaurus>` | Framework preset. Default `nuxt`. |
| `[dir]`, `-d, --dir <path>` | Project directory, as the first argument or via `--dir` (`--dir` wins). Default `my-graphql-docs`. The CLI exits with an error if it exists and is not empty. |
| `--schema <path-or-url>` | Schema source, see the table above. |
| `--example` | Use the bundled example schema (the default when `--schema` is omitted). |
| `--pm <npm\|pnpm\|yarn\|bun>` | Package manager to use; otherwise detected from the invoking command, then from lockfiles. |
| `--title <name>` | Site title. |
| `--color <name>` | Nuxt only. Primary color, any Nuxt UI / Tailwind color name (e.g. `violet`, `emerald`). |
| `--no-install` | Skip dependency installation. |
| `--no-git` | Skip git repository initialization. |
| `-y, --yes` | Accept all defaults; fully non-interactive. |
| `-h, --help` | Show usage and exit. |
| `-v, --version` | Print the CLI version and exit. |

## Add to an existing site

### Docusaurus

#### Prerequisites

:::note

These requirements are specific to Docusaurus integration. See our [Framework Integration Guide](/docs/advanced/integration-with-frameworks) for formatter-based setups and their requirements.

:::

Your project needs to meet the following requirements:

- Node.js version [22.12](https://nodejs.org/en/download/) or above
- [Docusaurus](https://docusaurus.io/) instance version 2.0 or above with the [docs plugin](https://docusaurus.io/docs/docs-introduction) enabled
- [GraphQL.js](https://graphql.org/graphql-js/) version 16.0 or above

#### Install the plugin

Add the `@graphql-markdown/docusaurus` plugin to your site installation:

```shell title="shell"
npm install @graphql-markdown/docusaurus graphql
```

#### Add a schema loader

See [schema loading](/docs/advanced/schema-loading).

#### Configure the plugin

See [configuration](/docs/configuration).

### Nuxt

Add the `@graphql-markdown/nuxt-theme` layer to your Nuxt project and create `content.config.ts` and `generate-docs.ts`. See [extending the layer directly](/docs/advanced/nuxt-theme#extending-the-layer-directly).

### Other frameworks

For Hugo, MkDocs, DocFX, mdBook and other formatter-based setups, see [Integration with Frameworks](/docs/advanced/integration-with-frameworks).

## Regenerate the documentation (Docusaurus)

In a Docusaurus site, build your website:

```shell title="shell"
npm run docusaurus build
```

Or run the documentation generator directly:

```shell title="shell"
npm run docusaurus graphql-to-doc
```

The `npm run docusaurus graphql-to-doc` command generates MDX files locally from your GraphQL schema. The possible command flags are documented in [settings](/docs/settings).

In a Nuxt site, generation runs automatically on `npm run dev`, `npm run generate` and `npm run build` through the layer's own module, so there is no separate command.
