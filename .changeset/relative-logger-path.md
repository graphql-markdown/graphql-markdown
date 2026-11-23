---
"@graphql-markdown/logger": patch
---

A relative logger module path, such as `./lib/my-logger.mjs`, is now resolved from the current working directory, like `formatter` and `loaders`. It used to be resolved from the `@graphql-markdown/logger` package folder, so the import failed and the run stopped.
