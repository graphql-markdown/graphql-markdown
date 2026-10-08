# create-graphql-markdown-docs

Interactive scaffolding CLI that generates a ready-to-run [GraphQL Markdown](https://graphql-markdown.dev) + Nuxt or Docusaurus API reference site; the Nuxt preset is built on the [`@graphql-markdown/nuxt-theme`](../nuxt-theme) layer.

## Quick start

```bash
npm create graphql-markdown-docs@latest
# or pass the project directory directly
npm create graphql-markdown-docs@latest my-docs
```

Follow the interactive prompts to:

1. Choose a project directory — press Enter to accept `my-graphql-docs`. It must not exist yet or must be empty; a non-empty directory is rejected and you're asked again.
2. Provide a GraphQL schema, or use the bundled example.
3. Confirm the package manager (auto-detected from how you invoked the command; only asked if detection fails).
4. Optionally customize the site title and primary color.
5. Install dependencies.
6. Initialize a git repository (skipped when the project is already inside one, e.g. a monorepo).

## Schema sources

Point `--schema` (or the equivalent prompt) at any of the following — the CLI detects which [graphql-tools loader](https://github.com/ardatan/graphql-tools/tree/master/packages/loaders) it needs and adds that dependency to the scaffolded project automatically:

| Schema source | Example | Loader added |
| --- | --- | --- |
| Local `.graphql`/`.gql` file | `./schema/api.graphql` | None — `@graphql-markdown/nuxt-theme`'s built-in default. |
| Local `.json` introspection result | `./introspection.json` | `@graphql-tools/json-file-loader` |
| Local code-first schema | `./schema.ts` | `@graphql-tools/code-file-loader` |
| Introspection/SDL endpoint | `https://api.example.com/graphql` | `@graphql-tools/url-loader` |
| Git-hosted file | `git:branch:path/schema.graphql` | `@graphql-tools/git-loader` |
| GitHub-hosted file | `github:owner/repo#branch:path/schema.graphql` | `@graphql-tools/github-loader` |

A local file is copied into the scaffolded project's `schema/` directory; a remote source is referenced as-is, with no local file to copy. Either way, `generate-docs.ts` and `nuxt.config.ts`'s `watch` entry are both written to match — never left pointing at the bundled `schema/example.graphql` once a real schema is provided.

## Non-interactive mode

For CI/CD or scripting, use `--yes`:

```bash
npm create graphql-markdown-docs@latest -- --yes --dir ./my-docs --schema ./schema.graphql --no-install --no-git
```

### Flags

| Flag | Description |
| --- | --- |
| `--framework <nuxt\|docusaurus>` | Framework preset. Default `nuxt`; asked first in interactive mode when omitted. |
| `[dir]`, `-d, --dir <path>` | Project directory, as the first argument or via `--dir` (`--dir` wins). Default `my-graphql-docs`. Must not already exist and be non-empty — the CLI exits with an error rather than overwrite anything. The `package.json` name is derived from it (lowercased, invalid characters replaced with `-`). |
| `--schema <path-or-url>` | Schema source — see the table above. |
| `--example` | Use the bundled example schema (the default when `--schema` is omitted). |
| `--pm <npm\|pnpm\|yarn\|bun>` | Package manager to use; otherwise detected from the invoking command (`pnpm create`, `yarn create`, …), then from lockfiles. |
| `--title <name>` | Site title (Nuxt: `app.config.ts`'s `gqlmd.siteTitle`; Docusaurus: `docusaurus.config.js`'s `title`). |
| `--color <name>` | Nuxt only (ignored with a warning for Docusaurus). Primary color — any Nuxt UI / Tailwind color name (e.g. `violet`, `emerald`, `blue`). Sets `app.config.ts`'s `ui.colors.primary`. |
| `--no-install` | Skip dependency installation. |
| `--no-git` | Skip git repository initialization. |
| `-y, --yes` | Accept all defaults; fully non-interactive. |
| `-h, --help` | Show usage and exit. |
| `-v, --version` | Print the CLI version and exit. |

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

- [`@graphql-markdown/nuxt-theme`](../nuxt-theme) — the layer this scaffolds, including the full customization/swizzling reference.
- [GraphQL-Markdown documentation](https://graphql-markdown.dev)
- [Nuxt documentation](https://nuxt.com)

## License

MIT
