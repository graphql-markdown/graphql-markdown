---
"@graphql-markdown/core": patch
"@graphql-markdown/utils": minor
---

A relative `formatter` path, such as `formatter: "./lib/custom-mdx.cjs"`, is now resolved from the current working directory, like `rootPath` and `homepage`. It used to be resolved from the `@graphql-markdown/core` package folder, so the formatter failed to load and the default formatter was used.

`@graphql-markdown/utils` adds `resolveRelativeSpecifier()`, which turns a relative module path into a `file:` URL resolved from a base folder (the current working directory by default), for dynamic `import()`.
