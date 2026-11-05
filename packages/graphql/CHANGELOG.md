# Changelog

Versions of `@graphql-markdown/graphql`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

This file is generated from the root `CHANGELOG.md` by `.github/scripts/package-changelogs.mts`. Do not edit it by hand.

## 1.3.4 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

- 🧩 **`@graphql-markdown/graphql`**: `graphql-config` is declared as an optional peer dependency. It was used without being declared ([#3486](https://github.com/graphql-markdown/graphql-markdown/pull/3486)).

## 1.3.3 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.3.2 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.3.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.3.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

const { getDirectiveFromSchema, getTypeDirectiveValuesList, hasDirectiveNamed } = require("@graphql-markdown/graphql");

`@graphql-markdown/graphql` exports the building blocks used above (`getDirectiveFromSchema`, `getTypeDirectiveValues`/`List`, `getTypeDirectiveArgValue`, and predicate helpers like `hasDirectiveNamed`, `and`, `or`, `not`, `isEntity`), and `@graphql-markdown/helpers` adds a ready-made `withDirective` decorator for the common case. Full reference and a step-by-step migration guide from `customDirective`: [docs/advanced/decorators](https://graphql-markdown.dev/docs/advanced/decorators) ([#3312](https://github.com/graphql-markdown/graphql-markdown/issues/3312)).

## 1.2.5 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.2.4 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.2.3 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.2.2 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.2.1 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).

- **Namespace detection regression** ([#2809](https://github.com/graphql-markdown/graphql-markdown/issues/2809)): fields whose return type is the root operation type (for example, a `Mutation` field returning `Mutation`) were incorrectly classified as namespace containers. This caused those fields to be omitted from operation lists and the root type to be stripped from the objects map. Fixed in `@graphql-markdown/graphql` (reported in [#2803](https://github.com/graphql-markdown/graphql-markdown/pull/2803) by [@artiom](https://github.com/artiom)).
