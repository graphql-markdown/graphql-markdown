---
"@graphql-markdown/graphql": patch
---

Security fix (GHSA-8r4f-p963-7296): `getFormattedDefaultValue` now prints every string default as an escaped, single-line GraphQL string literal, the same as graphql-js `printSchema`. Before, a newline or a run of backticks in a `String` or `ID` default went into the generated code block unescaped, letting a schema author close the block and inject HTML or MDX. Defaults on non-null types (`String!`, `[String]!`) and string defaults of custom scalars, which were printed raw without quotes, are now quoted and escaped too, and list or object defaults of custom scalars are printed as escaped GraphQL list and object values instead of being joined raw or shown as `[object Object]`.
