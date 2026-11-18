---
"@graphql-markdown/printer-legacy": patch
---

Security fix (GHSA-8r4f-p963-7296): the GraphQL code block and the example code block now use a fence longer than any run of backticks in the code, so text from the schema can no longer close the block early and inject HTML or MDX into the page.
