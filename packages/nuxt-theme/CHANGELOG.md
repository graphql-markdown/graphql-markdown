# Changelog

Versions of `@graphql-markdown/nuxt-theme`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 0.2.4

### Patch Changes

- [#3621](https://github.com/graphql-markdown/graphql-markdown/pull/3621) [`c5c1448`](https://github.com/graphql-markdown/graphql-markdown/commit/c5c14480eeebf565022e862b004c17cf9b46e1c4) Thanks [@edno](https://github.com/edno)! - Render type badges and deprecation callouts as Nuxt UI components in production builds instead of raw `<UBadge>`/`<UAlert>` tags.

- [#3620](https://github.com/graphql-markdown/graphql-markdown/pull/3620) [`b17ec24`](https://github.com/graphql-markdown/graphql-markdown/commit/b17ec24c1f2840f3ac4eb9e0b411de29d7989313) Thanks [@edno](https://github.com/edno)! - Fix search finding nothing on the single-page reference by matching results to the sidebar anchors and cleaning the search index.
  Stop the code-group kind badge from covering the first line of a snippet.
  Group directives in their own "Directives" sidebar section instead of under "Types".

## 0.2.3

### Patch Changes

- Updated dependencies []:
  - @graphql-markdown/cli@1.2.3

## 0.2.2 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 0.2.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 0.2.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

1.40.0 introduces **anonymous usage telemetry** (opt-out), polishes the reference pages of the Nuxt theme (`@graphql-markdown/nuxt-theme` 0.2.0), adds a generic MDX preset, and lets `create-graphql-markdown-docs` scaffold plain Markdown and MDX projects.

## 0.1.3 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 0.1.2 - 2026-10-08

Released in [GraphQL-Markdown 1.38.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.1).

1.38.1 fixes `@graphql-markdown/nuxt-theme`, which did not work when installed from npm. If you use the Nuxt theme, upgrade to `0.1.2`. No other package changes.

## 0.1.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

**`@graphql-markdown/nuxt-theme`: a Nuxt layer for API reference sites.** It's built on Nuxt Content and Nuxt UI:
