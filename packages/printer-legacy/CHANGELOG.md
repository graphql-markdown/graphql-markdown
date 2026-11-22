# Changelog

Versions of `@graphql-markdown/printer-legacy`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.20.0

### Minor Changes

- [#3601](https://github.com/graphql-markdown/graphql-markdown/pull/3601) [`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c) - Add the optional `formatMDXTitle` formatter function to print a visible page title after the front matter, for frameworks that do not render the front matter `title`. The DocFX preset uses it to print a `# Title` heading, so generated DocFX pages are no longer missing their title. The title is printed in a new `title` page section, after the front matter whatever the `frontMatter` option, so `print:beforeComposePageType` handlers can change or remove it. `title` is therefore a reserved section id: a decorator with the id `title` is now rejected like the other built-in section ids.

### Patch Changes

- [`d368bb7`](https://github.com/graphql-markdown/graphql-markdown/commit/d368bb793526bf4f0f408d288e3dbfbf62341c20) - Security fix (GHSA-8r4f-p963-7296): the GraphQL code block and the example code block now use a fence longer than any run of backticks in the code, so text from the schema can no longer close the block early and inject HTML or MDX into the page.

- [`510487d`](https://github.com/graphql-markdown/graphql-markdown/commit/510487d9ca9cd7fb206feca9fd45f1f3bbee4d5f) - Security fix (GHSA-6m8m-x9vx-3f84): the built-in "Directives" section now escapes `customDirective` descriptor output with `escapeMDX`, as the description slot already did. Before, a descriptor that put schema values in its text, such as the documented `directiveDescriptor` helper, let a schema author inject HTML, JSX or MDX expressions into the generated page. Descriptor output that relied on being printed as raw MDX is now shown as text.

- [`9383078`](https://github.com/graphql-markdown/graphql-markdown/commit/93830782bb090c7cfe82004ce09e0a5702868d44) - Security fix (GHSA-f7q8-26cc-xx7r): a scalar's `@specifiedBy` URL is now printed only when it is an absolute `http:` or `https:` URL, and it reaches the formatter in its normalized form, with characters such as `"`, `<`, `>` and spaces percent-encoded. Before, the raw schema value went into the generated page, letting a schema author inject HTML or MDX. Any other value, such as a `javascript:` URL or text that is not a URL, now prints no specification link.

- [#3602](https://github.com/graphql-markdown/graphql-markdown/pull/3602) [`f4da8ad`](https://github.com/graphql-markdown/graphql-markdown/commit/f4da8ad30fce5c9e001d082f0580a15968b6fd70) - Print field and argument names without a link when `docOptions.sectionHeaderId` is `false`, instead of a dead `#` link that jumped to the top of the page.
- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c), [`96c28b8`](https://github.com/graphql-markdown/graphql-markdown/commit/96c28b8add8c3ef38f5e884baec3b7d02134733c), [`9383078`](https://github.com/graphql-markdown/graphql-markdown/commit/93830782bb090c7cfe82004ce09e0a5702868d44), [`d368bb7`](https://github.com/graphql-markdown/graphql-markdown/commit/d368bb793526bf4f0f408d288e3dbfbf62341c20), [`51806c8`](https://github.com/graphql-markdown/graphql-markdown/commit/51806c83d6606cf46ee2de44ed6661916570f608), [`c95aef8`](https://github.com/graphql-markdown/graphql-markdown/commit/c95aef84c89655c4b3918de80daa010058f4d1f0), [`8876620`](https://github.com/graphql-markdown/graphql-markdown/commit/8876620093a2d13ba0f11d6f9bee20cada9de941)]:
  - @graphql-markdown/types@1.18.0
  - @graphql-markdown/formatters@1.2.3
  - @graphql-markdown/utils@1.14.3
  - @graphql-markdown/graphql@1.3.6

## 1.19.4 - 2026-11-15

Released in [GraphQL-Markdown 1.42.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.42.0).

## 1.19.3 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.19.2 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.19.1 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.19.0 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.18.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.17.0 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.16.2 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.16.1 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.16.0 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.15.0 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).

- Print event implementations (`PrintCodeEvent`, `PrintTypeEvent`, `BeforeComposePageTypeEvent`) moved to `@graphql-markdown/printer-legacy`.
