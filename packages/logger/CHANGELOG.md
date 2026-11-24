# Changelog

Versions of `@graphql-markdown/logger`. Each version links to the GraphQL-Markdown release that shipped it; see the [full changelog](https://github.com/graphql-markdown/graphql-markdown/blob/main/CHANGELOG.md) for everything else.

## 1.1.7

### Patch Changes

- [#3720](https://github.com/graphql-markdown/graphql-markdown/pull/3720) [`7ecbda9`](https://github.com/graphql-markdown/graphql-markdown/commit/7ecbda98f65ac7e7b25485afb93be3bc362bb003) - A relative logger module path, such as `./lib/my-logger.mjs`, is now resolved from the current working directory, like `formatter` and `loaders`. It used to be resolved from the `@graphql-markdown/logger` package folder, so the import failed and the run stopped.
  
  `@graphql-markdown/logger` now depends on `@graphql-markdown/utils` and re-exports its `runtimeModuleSpecifier()` instead of keeping its own copy.
- Updated dependencies [[`1f860eb`](https://github.com/graphql-markdown/graphql-markdown/commit/1f860eb10a3e522f5ccc9718c05efea95df4dc53), [`074bd7c`](https://github.com/graphql-markdown/graphql-markdown/commit/074bd7c388f687c2efb8d928ba9c62732bf581a2)]:
  - @graphql-markdown/utils@1.14.5

## 1.1.6

### Patch Changes

- Updated dependencies [[`d3bf5c6`](https://github.com/graphql-markdown/graphql-markdown/commit/d3bf5c6358c07fd1e857aa83e84f52eace8a9cd8), [`169ca39`](https://github.com/graphql-markdown/graphql-markdown/commit/169ca39cddd9ef95687065cb70f6ff15aad6e158)]:
  - @graphql-markdown/types@1.19.0

## 1.1.5

### Patch Changes

- Updated dependencies [[`3fab787`](https://github.com/graphql-markdown/graphql-markdown/commit/3fab787444d25e47fb88b4cbb015d662ca76df2c)]:
  - @graphql-markdown/types@1.18.0

## 1.1.4 - 2026-10-29

Released in [GraphQL-Markdown 1.41.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.41.0).

## 1.1.3 - 2026-10-13

Released in [GraphQL-Markdown 1.40.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.40.0).

## 1.1.2 - 2026-10-10

Released in [GraphQL-Markdown 1.39.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.39.0).

## 1.1.1 - 2026-10-08

Released in [GraphQL-Markdown 1.38.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.38.0).

## 1.1.0 - 2026-09-17

Released in [GraphQL-Markdown 1.37.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.37.0).

## 1.0.10 - 2026-09-04

Released in [GraphQL-Markdown 1.36.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.36.0).

## 1.0.9 - 2026-08-30

Released in [GraphQL-Markdown 1.35.2](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.2).

## 1.0.8 - 2026-08-20

Released in [GraphQL-Markdown 1.35.1](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.1).

## 1.0.7 - 2026-05-31

Released in [GraphQL-Markdown 1.35.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.35.0).

## 1.0.6 - 2026-04-10

Released in [GraphQL-Markdown 1.34.0](https://github.com/graphql-markdown/graphql-markdown/releases/tag/1.34.0).
