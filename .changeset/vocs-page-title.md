---
"@graphql-markdown/formatters": patch
---

The Vocs preset now prints the visible `# Title` page heading with `formatMDXTitle` instead of appending it to the front matter. The heading now follows the MDX declaration, and is printed only once when the `frontMatter` option is `false`.
