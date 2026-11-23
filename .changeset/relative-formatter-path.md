---
"@graphql-markdown/core": patch
---

A relative `formatter` path, such as `formatter: "./lib/custom-mdx.cjs"`, is now resolved from the current working directory, like `rootPath` and `homepage`. It used to be resolved from the `@graphql-markdown/core` package folder, so the formatter failed to load and the default formatter was used.
