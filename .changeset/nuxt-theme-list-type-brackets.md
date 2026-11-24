---
"@graphql-markdown/nuxt-theme": patch
---

List types keep their brackets in field and argument headings. Nuxt Content read `[Project!]` as an inline span, so a field typed `[Project!]!` was shown as `Project!!`; it now reads `[Project!]!`.
