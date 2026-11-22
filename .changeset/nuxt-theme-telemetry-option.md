---
"@graphql-markdown/nuxt-theme": patch
---

`createGenerateDocs` now forwards every GraphQL-Markdown option it doesn't set itself (for example `telemetry: false`, `pretty`, `force`), instead of silently dropping them.
