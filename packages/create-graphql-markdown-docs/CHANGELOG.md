# Changelog

Versions of `create-graphql-markdown-docs`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.2.1

### Patch Changes

- Update the `@graphql-markdown/*` dependency ranges of the project templates and of the markdown scaffold.
  
  - templates/docusaurus/package.json: @graphql-markdown/docusaurus: ^1.39.4 -> ^1.39.5
  - templates/markdown/package.json: @graphql-markdown/cli: ^1.3.0 -> ^1.3.1
  - templates/nuxt/package.json: @graphql-markdown/nuxt-theme: ^0.3.0 -> ^0.3.1
  - lib/frameworks/markdown.mjs: FORMATTERS_RANGE: ^1.3.0 -> ^1.3.1

## 1.2.0

### Minor Changes

- [#3668](https://github.com/graphql-markdown/graphql-markdown/pull/3668) [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c) - Add docsify formatter preset (`@graphql-markdown/formatters/docsify`) and accept `docsify` as a formatter value in CLI telemetry. The scaffolder can wire Docsify projects.

- [#3667](https://github.com/graphql-markdown/graphql-markdown/pull/3667) [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998) - Add zola formatter preset. The scaffolder can wire Zola projects.

### Patch Changes

- Update the `@graphql-markdown/*` dependency ranges of the project templates and of the markdown scaffold.
  
  - templates/docusaurus/package.json: @graphql-markdown/docusaurus: ^1.39.3 -> ^1.39.4
  - templates/markdown/package.json: @graphql-markdown/cli: ^1.2.3 -> ^1.3.0
  - templates/nuxt/package.json: @graphql-markdown/nuxt-theme: ^0.2.4 -> ^0.3.0
  - lib/frameworks/markdown.mjs: FORMATTERS_RANGE: ^1.2.3 -> ^1.3.0
- Updated dependencies [[`20ac5f5`](https://github.com/graphql-markdown/graphql-markdown/commit/20ac5f5e59c465dfd2db2aeb452ab9b0371fc145), [`8152a72`](https://github.com/graphql-markdown/graphql-markdown/commit/8152a72e53a35a6daa8e76ee75722fabfb6a196c), [`9a3b479`](https://github.com/graphql-markdown/graphql-markdown/commit/9a3b479b10338f40612a779c022b685cd1a50998), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/telemetry@0.2.2

## 1.1.4

### Patch Changes

- Update the `@graphql-markdown/*` dependency ranges of the project templates and of the markdown scaffold.
  
  - templates/nuxt/package.json: @graphql-markdown/nuxt-theme: ^0.2.3 -> ^0.2.4

## 1.1.3

### Patch Changes

- Update the `@graphql-markdown/*` dependency ranges of the project templates and of the markdown scaffold.
  
  - templates/docusaurus/package.json: @graphql-markdown/docusaurus: ^1.39.2 -> ^1.39.3
  - templates/markdown/package.json: @graphql-markdown/cli: ^1.2.2 -> ^1.2.3
  - templates/nuxt/package.json: @graphql-markdown/nuxt-theme: ^0.2.2 -> ^0.2.3
  - lib/frameworks/markdown.mjs: FORMATTERS_RANGE: ^1.2.2 -> ^1.2.3
- Updated dependencies []:
  - @graphql-markdown/telemetry@0.2.1

## 1.1.2 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 1.1.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.1.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

1.40.0 introduces **anonymous usage telemetry** (opt-out), polishes the reference pages of the Nuxt theme (`@graphql-markdown/nuxt-theme` 0.2.0), adds a generic MDX preset, and lets `create-graphql-markdown-docs` scaffold plain Markdown and MDX projects.

**Markdown and MDX scaffolds.** `create-graphql-markdown-docs --framework markdown` or `--framework mdx` creates a project that only generates the docs, with no site. `--framework mdx` also works when adding GraphQL-Markdown to an existing project. `generic` and `markdown` are accepted as aliases of each other ([#3444](https://github.com/graphql-markdown/graphql-markdown/pull/3444)). When the scaffolder adds GraphQL-Markdown to an existing project, the script it creates is now named `gqlmd` instead of `docs:api` ([#3446](https://github.com/graphql-markdown/graphql-markdown/pull/3446)).

## 1.0.0 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

1.39.0 brings `create-graphql-markdown-docs` to **1.0.0**: the same command that creates a new docs site now also adds GraphQL-Markdown to a site you already have 🚀

**`create-graphql-markdown-docs` 1.0.0: add GraphQL-Markdown to an existing site.** Run it inside your project:

## 0.1.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

**`create-graphql-markdown-docs`: scaffold a docs site in one command.**
