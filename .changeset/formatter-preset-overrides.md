---
"@graphql-markdown/core": patch
"@graphql-markdown/printer-legacy": patch
"@graphql-markdown/types": patch
---

Formatter functions exported next to a spread preset (`{ ...preset, formatMDXBadge }`) now override the ones built by the preset's `createMDXFormatter`. `formatMDXPermalink` now receives the generator `meta`, so spread Docusaurus presets keep version-aware permalinks.
