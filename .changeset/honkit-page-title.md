---
"@graphql-markdown/formatters": patch
---

The HonKit preset now prints the visible `# Title` page heading with `formatMDXTitle` instead of appending it to the front matter. Line breaks in the title are still collapsed and surrounding whitespace trimmed. The heading is printed only once when the `frontMatter` option is `false`.
