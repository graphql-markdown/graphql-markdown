# create-graphql-markdown-docs

Interactive CLI that either creates a ready-to-run [GraphQL Markdown](https://graphql-markdown.dev) API reference site (Nuxt or Docusaurus) or adds GraphQL-Markdown to an existing documentation site. The Nuxt preset is built on the [`@graphql-markdown/nuxt-theme`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/nuxt-theme) layer.

Full guide: [graphql-markdown.dev/docs/get-started](https://graphql-markdown.dev/docs/get-started).

## Quick start

Run it in an empty or new folder to create a new site, or inside an existing project to add GraphQL-Markdown to it (see [Add to an existing site](#add-to-an-existing-site)):

```bash
npm create graphql-markdown-docs@latest
# or pass the project directory directly
npm create graphql-markdown-docs@latest my-docs
```

To create a new site, follow the interactive prompts to:

1. Choose a project directory — press Enter to accept `my-graphql-docs`. It must not exist yet or must be empty; a non-empty directory is rejected and you're asked again.
2. Provide a GraphQL schema, or use the bundled example.
3. Confirm the package manager (auto-detected from how you invoked the command; only asked if detection fails).
4. Optionally customize the site title and primary color.
5. Install dependencies.
6. Initialize a git repository (skipped when the project is already inside one, e.g. a monorepo).

## Add to an existing site

Run the same command inside a folder that already contains a project. The CLI detects it and adds GraphQL-Markdown to it (wire mode):

```bash
cd my-starlight-site
npm create graphql-markdown-docs@latest
```

If you run the command without a directory inside a non-empty folder, it asks whether to add GraphQL-Markdown to this project or create a new one in a subfolder. `--new` and `--existing` force one mode or the other.

In wire mode the CLI:

1. Detects the framework from `package.json`, or asks you to choose one (`generic` for anything unlisted).
2. Asks for the schema (a path, glob or URL, written as you enter it) and the output folder. The output folder is always asked, never guessed.
3. Suggests a link root for the generated pages.
4. Writes a `.graphqlrc` file and a `docs:api` script that runs `gqlmd graphql-to-doc`.
5. Prints the next step for your framework, such as adding a sidebar or navigation entry.

It never edits your framework configuration files and never overwrites existing files. If the project already has a GraphQL config, the CLI prints the block to merge into it instead. It installs nothing unless you pass `--install`; otherwise it prints the install command. Use `--dry-run` to see what it would write without writing anything.

For CI or scripting, pass the required options and skip the prompts:

```bash
npm create graphql-markdown-docs@latest . -- --yes --schema ./schema.graphql --output src/content/docs/api --install
```

With `--yes`, `--schema` and `--output` are required, and so is `--framework` when the framework cannot be detected from `package.json`.

### Supported frameworks (existing sites)

| Framework       | Typical output folder  | Notes                                                     |
| --------------- | ---------------------- | --------------------------------------------------------- |
| Docusaurus      | `docs/api`             | Router links; the suggested link root follows the route.  |
| Nuxt            | `content/api`          | Router links; the suggested link root follows the route.  |
| Astro Starlight | `src/content/docs/api` | Set `--site-base` if the site is served under a sub-path. |
| Fumadocs        | `content/docs/api`     | Router links; the suggested link root follows the route.  |
| Vocs            | `docs/pages/api`       | Router links; the suggested link root follows the route.  |
| HonKit          | `api`                  | Set `--site-base` if the site is served under a sub-path. |
| Hugo            | `content/api`          | Set `--site-base` if the site is served under a sub-path. |
| MkDocs          | `docs/api`             | Links relative to pages.                                  |
| DocFX           | `docs/api`             | Links relative to pages.                                  |
| mdBook          | `src/api`              | Links relative to pages.                                  |
| Generic         | Any folder you choose  | Any Markdown/MDX site — you set the link root.            |

## Schema sources

Point `--schema` (or the equivalent prompt) at any of the following — the CLI detects which [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) it needs and adds that dependency to the scaffolded project automatically:

| Schema source                      | Example                                        | Loader added                                              |
| ---------------------------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Local `.graphql`/`.gql` file       | `./schema/api.graphql`                         | None — `@graphql-markdown/nuxt-theme`'s built-in default. |
| Local `.json` introspection result | `./introspection.json`                         | `@graphql-tools/json-file-loader`                         |
| Local code-first schema            | `./schema.ts`                                  | `@graphql-tools/code-file-loader`                         |
| Introspection/SDL endpoint         | `https://api.example.com/graphql`              | `@graphql-tools/url-loader`                               |
| Git-hosted file                    | `git:branch:path/schema.graphql`               | `@graphql-tools/git-loader`                               |
| GitHub-hosted file                 | `github:owner/repo#branch:path/schema.graphql` | `@graphql-tools/github-loader`                            |

`github:` sources call the GitHub API and need a token: set the `GITHUB_TOKEN` environment variable before generating the docs (the scaffolded config reads it).

A local SDL/JSON file is copied into the scaffolded project's `schema/` directory; a remote source is referenced as-is, with no local file to copy. For Nuxt, `generate-docs.ts` is rewritten to match and `nuxt.config.ts`'s `watch` entry points at the local file (or is removed for a remote source); for Docusaurus, `.graphqlrc` is rewritten. Local code-first schemas are referenced in place rather than copied, so their imports keep working.

## Non-interactive mode

For CI/CD or scripting, use `--yes`:

```bash
npm create graphql-markdown-docs@latest -- --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

### Flags

#### Shared

| Flag                         | Description                                                                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `[dir]`, `-d, --dir <path>`  | Target folder (default: ask, or the current folder with `--existing`).                                                                                                                        |
| `--new` \| `--existing`      | Force scaffold or wire mode (default: picked from the folder).                                                                                                                                |
| `--framework <name>`         | Scaffold: `nuxt` \| `docusaurus` (default `nuxt`). Wire: `docusaurus` \| `starlight` \| `fumadocs` \| `vocs` \| `honkit` \| `hugo` \| `mkdocs` \| `docfx` \| `mdbook` \| `nuxt` \| `generic`. |
| `--schema <source>`          | Schema source: `<path\|url\|git:\|github:>`. See the table above.                                                                                                                             |
| `--pm <name>`                | Package manager: `npm` \| `pnpm` \| `yarn` \| `bun`. Otherwise detected from the invoking command, then from lockfiles.                                                                       |
| `--install` / `--no-install` | Install dependencies (or skip it). Wire mode installs nothing unless `--install` is passed.                                                                                                   |
| `-y, --yes`                  | Accept defaults and skip all prompts.                                                                                                                                                         |
| `-h, --help`                 | Show usage and exit.                                                                                                                                                                          |
| `-v, --version`              | Print the CLI version and exit.                                                                                                                                                               |

#### Scaffold only

| Flag             | Description                                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--example`      | Use the bundled example schema (the default when `--schema` is omitted).                                                                                                            |
| `--title <text>` | Site title (Nuxt: `app.config.ts`'s `gqlmd.siteTitle`; Docusaurus: `docusaurus.config.js`'s `title` and navbar title).                                                              |
| `--color <name>` | Primary color, Nuxt only (ignored with a warning for Docusaurus). Any Nuxt UI / Tailwind color name (e.g. `violet`, `emerald`, `blue`). Sets `app.config.ts`'s `ui.colors.primary`. |
| `--no-git`       | Skip git repository initialization.                                                                                                                                                 |

#### Wire only

| Flag                  | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `--formatter <name>`  | Formatter module or path (default: the framework's own formatter preset). |
| `--output <folder>`   | Folder for the generated docs, relative to the project.                   |
| `--link-root <route>` | Route prefix used in generated links.                                     |
| `--site-base <route>` | Base path the site is served from.                                        |
| `--script <name>`     | `package.json` script to add (default: `docs:api`).                       |
| `--dry-run`           | Show what would be written without writing it.                            |

## What's included

The scaffolded project is a real, complete Nuxt 4 project:

- `nuxt.config.ts` — extends `@graphql-markdown/nuxt-theme`, nothing else required.
- `content.config.ts` — required in every consuming project (not inherited from the layer — see the theme's own README for why).
- `generate-docs.ts` — calls the theme's `createGenerateDocs` factory with your schema (and, if applicable, the loader it needs).
- `schema/` — your schema, or the bundled example.
- `app/app.config.ts` / `app/pages/index.vue` — a minimal landing page and theme override point, yours to edit.

## Docusaurus

With `--framework docusaurus`, the scaffold replaces the standalone `graphql-markdown/template` repo:

- `docusaurus.config.js` — Docusaurus 3 with the classic preset and `@graphql-markdown/docusaurus`.
- `.graphqlrc` — schema and loader configuration (rewritten for your `--schema`).
- `schema/` — your schema, or the bundled example.
- `static/index.md`, `src/css/custom.css`, `babel.config.js` — landing page, styling and build config.

Then run `npm run doc` to generate the docs and `npm start` to serve them.

## Documentation

- [`@graphql-markdown/nuxt-theme`](https://github.com/graphql-markdown/graphql-markdown/tree/main/packages/nuxt-theme) — the layer this scaffolds, including the full customization/swizzling reference.
- [GraphQL-Markdown documentation](https://graphql-markdown.dev)
- [Nuxt documentation](https://nuxt.com)

## License

MIT
