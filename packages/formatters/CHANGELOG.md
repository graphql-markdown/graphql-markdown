# Changelog

Versions of `@graphql-markdown/formatters`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.2.3

### Patch Changes

- [#3601](https://github.com/graphql-markdown/graphql-markdown/pull/3601) [`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c) Thanks [@edno](https://github.com/edno)! - Add the optional `formatMDXTitle` formatter function to print a visible page title after the front matter, for frameworks that do not render the front matter `title`. The DocFX preset uses it to print a `# Title` heading, so generated DocFX pages are no longer missing their title. The title is printed in a new `title` page section, after the front matter whatever the `frontMatter` option, so `print:beforeComposePageType` handlers can change or remove it. `title` is therefore a reserved section id: a decorator with the id `title` is now rejected like the other built-in section ids.

- [`9383078`](https://github.com/graphql-markdown/graphql-markdown/commit/93830782bb090c7cfe82004ce09e0a5702868d44) Thanks [@edno](https://github.com/edno)! - Security fix (GHSA-f7q8-26cc-xx7r): `formatMDXSpecifiedByLink` now encodes the specification URL for where it is written. The shared MDX formatter and the Docusaurus formatter escape it as HTML character references inside the attribute, and the MkDocs and HonKit formatters percent-encode characters that could end a Markdown link or start markup. Before, a `"` in a scalar's `@specifiedBy` URL closed the attribute and let a schema author inject HTML or MDX into the generated page.

- [#3611](https://github.com/graphql-markdown/graphql-markdown/pull/3611) [`51806c8`](https://github.com/graphql-markdown/graphql-markdown/commit/51806c83d6606cf46ee2de44ed6661916570f608) Thanks [@edno](https://github.com/edno)! - The HonKit preset now prints the visible `# Title` page heading with `formatMDXTitle` instead of appending it to the front matter. Line breaks in the title are still collapsed and surrounding whitespace trimmed. The heading is printed only once when the `frontMatter` option is `false`.

- [#3612](https://github.com/graphql-markdown/graphql-markdown/pull/3612) [`c95aef8`](https://github.com/graphql-markdown/graphql-markdown/commit/c95aef84c89655c4b3918de80daa010058f4d1f0) Thanks [@edno](https://github.com/edno)! - The mdBook preset now prints the visible `# Title` page heading with `formatMDXTitle`; `formatMDXFrontmatter` only suppresses the front matter and returns an empty string.

- [#3610](https://github.com/graphql-markdown/graphql-markdown/pull/3610) [`8876620`](https://github.com/graphql-markdown/graphql-markdown/commit/8876620093a2d13ba0f11d6f9bee20cada9de941) Thanks [@edno](https://github.com/edno)! - The Vocs preset now prints the visible `# Title` page heading with `formatMDXTitle` instead of appending it to the front matter. The heading now follows the MDX declaration, and is printed only once when the `frontMatter` option is `false`.
- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c), [`96c28b8`](https://github.com/graphql-markdown/graphql-markdown/commit/96c28b8add8c3ef38f5e884baec3b7d02134733c)]:
  - @graphql-markdown/types@1.18.0
  - @graphql-markdown/utils@1.14.3
  - @graphql-markdown/helpers@1.2.6

## 1.2.2 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 1.2.1 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.2.0 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

**Generic MDX preset.** `@graphql-markdown/formatters/mdx` writes framework-neutral `.mdx` pages: plain HTML, no components, and internal links relative to each page ([#3443](https://github.com/graphql-markdown/graphql-markdown/pull/3443)).

## 1.1.3 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.1.2 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.1.1 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.1.0 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.0.2 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.0.1 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.0.0 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

Examples: `@graphql-markdown/formatters/hugo`, `@graphql-markdown/formatters/docusaurus`, `@graphql-markdown/formatters/starlight`.

formatter: "@graphql-markdown/formatters/hugo"
