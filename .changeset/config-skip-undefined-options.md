---
"@graphql-markdown/core": patch
---

An option set to `undefined`, for example from an unset environment variable, no longer overrides a default or a value set in GraphQL Config. It is now ignored, as if the option were not set.

```ts
const config = await buildConfig({
  schema: "./schema.graphql",
  // When DOCS_ROOT is not set, rootPath comes from GraphQL Config or the default
  rootPath: process.env.DOCS_ROOT,
});
```
