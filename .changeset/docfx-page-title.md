---
"@graphql-markdown/types": minor
"@graphql-markdown/printer-legacy": minor
"@graphql-markdown/core": minor
"@graphql-markdown/formatters": patch
---

Add the optional `formatMDXTitle` formatter function to print a visible page title after the front matter, for frameworks that do not render the front matter `title`. The DocFX preset uses it to print a `# Title` heading, so generated DocFX pages are no longer missing their title.
