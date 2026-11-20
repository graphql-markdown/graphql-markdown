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

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Getting started

The fastest way to start is the [`create-graphql-markdown-docs`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/create-graphql-markdown-docs) scaffolder, which creates a ready-to-run Nuxt or Docusaurus site, or [adds GraphQL-Markdown to an existing site](#add-to-an-existing-site). Or try it right away with one of our [demos](/docs/try-it).

## Create a new site

### Requirements

Node.js version [22.18](https://nodejs.org/en/download/) or above (which can be checked by running `node -v`) is required.

You can use `npm`, `yarn`, `pnpm` or `bun` as your package manager. Command examples have a tab for each package manager; pick yours once and every page follows. To manage several Node.js versions on one machine, use [nvm](https://github.com/nvm-sh/nvm).

### Run the scaffolder

You can type these commands into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs
```

</TabItem>
</Tabs>

Pass the project directory as an argument to skip that prompt:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest my-docs
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs my-docs
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs my-docs
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs my-docs
```

</TabItem>
</Tabs>

With npm, flags follow a `--` separator so that npm forwards them to the CLI; the other package managers pass them directly:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest my-docs -- --framework docusaurus
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs my-docs --framework docusaurus
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs my-docs --framework docusaurus
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs my-docs --framework docusaurus
```

</TabItem>
</Tabs>

### What the prompts ask

1. **Framework**: Nuxt (default) or Docusaurus.
2. **Directory**: press Enter to accept `my-graphql-docs`. The directory must not exist yet or must be empty; a non-empty directory is rejected and you are asked again.
3. **Schema**: use the bundled example, or your own (local file, introspection URL, `git:` or `github:` reference). The matching loader is detected and added as a dependency.
4. **Package manager**: detected from the command you used (`pnpm create`, `yarn create`, `bun create`, `npm create`), then from lockfiles. You are only asked if detection fails.
5. **Title** (optional), and a **primary color** for Nuxt.
6. **Install dependencies**.
7. **Git repository**: initialized unless the project is already inside one.

### Choose a framework

- **Nuxt** (default): a full API reference site built on the [`@graphql-markdown/nuxt-theme`](/docs/guides/nuxt) layer, with live reload when the schema changes.
- **Docusaurus**: a classic Docusaurus site configured with the `@graphql-markdown/docusaurus` plugin.

See [Nuxt Theme](/docs/guides/nuxt) for what the Nuxt layer provides.

### Use your own schema

A schema loader is required to load your GraphQL schema. Without `--schema`, the site uses a bundled example schema. Pass `--schema <path-or-url>` (or answer the prompt) to use your own: the CLI picks the matching [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders), adds it as a dependency, and writes it into the site configuration (`.graphqlrc` for Docusaurus, `generate-docs.ts` for Nuxt).

| Schema source                      | Example                                        | Loader added                      |
| ---------------------------------- | ---------------------------------------------- | --------------------------------- |
| Local `.graphql`/`.gql` file       | `./schema/api.graphql`                         | None (default loader)             |
| Local `.json` introspection result | `./introspection.json`                         | `@graphql-tools/json-file-loader` |
| Local code-first schema            | `./schema.ts`                                  | `@graphql-tools/code-file-loader` |
| Introspection/SDL endpoint         | `https://api.example.com/graphql`              | `@graphql-tools/url-loader`       |
| Git-hosted file                    | `git:branch:path/schema.graphql`               | `@graphql-tools/git-loader`       |
| GitHub-hosted file                 | `github:owner/repo#branch:path/schema.graphql` | `@graphql-tools/github-loader`    |

`github:` sources call the GitHub API and need a token: set the `GITHUB_TOKEN` environment variable before generating the docs (the scaffolded config reads it).

A local SDL/JSON file is copied into the scaffolded project's `schema/` directory; a remote source is referenced as-is. Local code-first schemas are referenced in place rather than copied, so their imports keep working.

See [schema loading](/docs/guides/schema-loading) for other loaders and configuration options.

### Start your site

For a Nuxt site:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
cd my-graphql-docs
npm run dev
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
cd my-graphql-docs
pnpm dev
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
cd my-graphql-docs
yarn dev
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
cd my-graphql-docs
bun run dev
```

</TabItem>
</Tabs>

The development server is available at [http://localhost:3000/](http://localhost:3000/).

For a Docusaurus site:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
cd my-graphql-docs
npm run doc
npm run start
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
cd my-graphql-docs
pnpm doc
pnpm start
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
cd my-graphql-docs
yarn doc
yarn start
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
cd my-graphql-docs
bun run doc
bun run start
```

</TabItem>
</Tabs>

If you skipped the install step, install the dependencies first (`npm install`, `pnpm install`, `yarn` or `bun install`).

The `doc` script is a shortcut in the scaffolded site for `docusaurus graphql-to-doc`. The `start` script builds your website locally and serves it through a development server, ready for you to view at [http://localhost:3000/](http://localhost:3000/).

### Non-interactive usage (CI)

Use `--yes` to accept all defaults and skip every prompt:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest -- --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

</TabItem>
</Tabs>

| Flag                             | Description                                                                                                                                                                                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--framework <nuxt\|docusaurus>` | Framework preset. Default `nuxt`.                                                                                                                                                                                                                                                         |
| `[dir]`, `-d, --dir <path>`      | Project directory, as the first argument or via `--dir` (`--dir` wins). Default `my-graphql-docs`. Must be a directory that doesn't exist yet or is empty (an existing empty directory, including `.`, is scaffolded in place); the CLI exits with an error if it is a file or not empty. |
| `--schema <path-or-url>`         | Schema source, see the table above. A local path must point to an existing file; the CLI exits with an error otherwise.                                                                                                                                                                   |
| `--example`                      | Use the bundled example schema (the default when `--schema` is omitted).                                                                                                                                                                                                                  |
| `--pm <npm\|pnpm\|yarn\|bun>`    | Package manager to use; otherwise detected from the invoking command, then from lockfiles.                                                                                                                                                                                                |
| `--title <name>`                 | Site title.                                                                                                                                                                                                                                                                               |
| `--color <name>`                 | Nuxt only. Primary color, any Nuxt UI / Tailwind color name (e.g. `violet`, `emerald`).                                                                                                                                                                                                   |
| `--no-install`                   | Skip dependency installation.                                                                                                                                                                                                                                                             |
| `--no-git`                       | Skip git repository initialization.                                                                                                                                                                                                                                                       |
| `-y, --yes`                      | Accept all defaults; fully non-interactive.                                                                                                                                                                                                                                               |
| `-h, --help`                     | Show usage and exit.                                                                                                                                                                                                                                                                      |
| `-v, --version`                  | Print the CLI version and exit.                                                                                                                                                                                                                                                           |

## Add to an existing site

### With the scaffolder (recommended)

Run the scaffolder inside your existing project. When the folder already holds a project, it adds GraphQL-Markdown to it instead of creating a new site.

It detects your framework from `package.json` (or asks you), then asks for your schema (a path, glob or URL) and the output folder for the generated docs. It writes a `.graphqlrc` file and a `gqlmd` script, and prints the one step left for your framework, such as adding a sidebar or navigation entry.

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
cd my-starlight-site
npm create graphql-markdown-docs@latest
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
cd my-starlight-site
pnpm create graphql-markdown-docs
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
cd my-starlight-site
yarn create graphql-markdown-docs
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
cd my-starlight-site
bun create graphql-markdown-docs
```

</TabItem>
</Tabs>

To skip the prompts, for example in CI, pass the options explicitly:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm create graphql-markdown-docs@latest . -- --yes --schema ./schema.graphql --output src/content/docs/api --install
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm create graphql-markdown-docs . --yes --schema ./schema.graphql --output src/content/docs/api --install
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn create graphql-markdown-docs . --yes --schema ./schema.graphql --output src/content/docs/api --install
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun create graphql-markdown-docs . --yes --schema ./schema.graphql --output src/content/docs/api --install
```

</TabItem>
</Tabs>

The scaffolder never edits your framework configuration files and never overwrites existing files. It installs nothing unless you pass `--install`. Use `--dry-run` to preview the changes first.

For every option, see the [create-graphql-markdown-docs flags](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/create-graphql-markdown-docs#flags).

Prefer to set it up by hand? Follow the steps for your framework.

### Docusaurus

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/docusaurus graphql
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/docusaurus graphql
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/docusaurus graphql
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/docusaurus graphql
```

</TabItem>
</Tabs>

Then add a schema loader and configure the plugin. See the [Docusaurus guide](/docs/guides/docusaurus) for requirements and configuration.

### Nuxt

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/nuxt-theme
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/nuxt-theme
```

</TabItem>
</Tabs>

Then create `content.config.ts` and `generate-docs.ts`. See the [Nuxt guide](/docs/guides/nuxt#extending-the-layer-directly).

### Other frameworks

For Hugo, MkDocs, DocFX, mdBook and other formatter-based setups, see [Other frameworks](/docs/guides/other-frameworks).

## Use the API

To generate the documentation from your own script instead of the CLI or a framework plugin, call `@graphql-markdown/core` directly. `buildConfig` takes the same [settings](/docs/reference/settings) as the configuration file and fills in the defaults; `generateDocFromSchema` loads the schema and writes the pages. The `loaders` option is required: it names the [schema loader](/docs/guides/schema-loading) used to read the schema.

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npm install @graphql-markdown/core graphql @graphql-tools/graphql-file-loader
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm add @graphql-markdown/core graphql @graphql-tools/graphql-file-loader
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @graphql-markdown/core graphql @graphql-tools/graphql-file-loader
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bun add @graphql-markdown/core graphql @graphql-tools/graphql-file-loader
```

</TabItem>
</Tabs>

```ts title="generate-docs.ts"
import { buildConfig, generateDocFromSchema } from "@graphql-markdown/core";

const config = await buildConfig({
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "api",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
  },
});

await generateDocFromSchema(config);
```

Run it with any TypeScript-aware runtime, for example `node generate-docs.ts` (Node.js 22.18 or above), `bun generate-docs.ts` or `deno run -A generate-docs.ts`.

`buildConfig` also reads a [GraphQL Config](/docs/reference/configuration#graphql-config) file when `graphql-config` is installed, and merges it with the options passed in code. Without it, the options in code are all that is needed.

## Install from JSR

The GraphQL-Markdown libraries are also published on [JSR](https://jsr.io/@graphql-markdown) for Deno, Node.js and Bun. See [JSR](/docs/reference/jsr) for installation, the supported GraphQL.js version and optional features.

## Regenerate the documentation

In a Docusaurus site, see [Docusaurus recipes](/docs/guides/docusaurus#regenerate-the-documentation) for the build/regenerate commands.

In a Nuxt site, generation runs automatically on `npm run dev`, `npm run generate` and `npm run build` through the layer's own module, so there is no separate command.
