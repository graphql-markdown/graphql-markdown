---
"@graphql-markdown/nuxt-theme": patch
"@graphql-markdown/cli": patch
---

Fix GraphQL Config settings being ignored by the Nuxt theme: its default `formatter`, `rootPath`, `baseURL`, `loaders` and `printTypeOptions` now apply only when neither GraphQL Config nor the module options set them. `runGraphQLMarkdown` now returns the resolved configuration.
