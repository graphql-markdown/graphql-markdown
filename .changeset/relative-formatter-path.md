---
"@graphql-markdown/core": patch
"@graphql-markdown/graphql": patch
"@graphql-markdown/utils": patch
---

Relative module paths in the configuration are now resolved from the current working directory, like `rootPath` and `homepage`. This applies to `formatter` (for example `formatter: "./lib/custom-mdx.cjs"`), `loaders` and a custom diff module. They used to be resolved from the installed package folder, so the module failed to load: the default formatter was used, the loader failed, or the diff check was skipped.

`runtimeModuleSpecifier()` in `@graphql-markdown/utils` now returns a relative path as a `file:` URL resolved from `process.cwd()`.
