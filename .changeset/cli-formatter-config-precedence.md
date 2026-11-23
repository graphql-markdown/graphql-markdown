---
"@graphql-markdown/core": patch
"@graphql-markdown/cli": patch
---

Fix `formatter` set in GraphQL Config being ignored by the Docusaurus plugin: its default formatter now applies only when neither GraphQL Config nor the plugin options set one.
