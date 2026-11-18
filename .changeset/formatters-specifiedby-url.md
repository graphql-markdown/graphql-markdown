---
"@graphql-markdown/formatters": patch
---

Security fix (GHSA-f7q8-26cc-xx7r): `formatMDXSpecifiedByLink` now encodes the specification URL for where it is written. The shared MDX formatter and the Docusaurus formatter escape it as HTML character references inside the attribute, and the MkDocs and HonKit formatters percent-encode characters that could end a Markdown link or start markup. Before, a `"` in a scalar's `@specifiedBy` URL closed the attribute and let a schema author inject HTML or MDX into the generated page.
