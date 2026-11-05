# Changelog

Versions of `create-graphql-markdown-docs`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

This file is generated from the root `CHANGELOG.md` by `.github/scripts/package-changelogs.mts`. Do not edit it by hand.

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
