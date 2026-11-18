---
"@graphql-markdown/printer-legacy": patch
---

Security fix (GHSA-f7q8-26cc-xx7r): a scalar's `@specifiedBy` URL is now printed only when it is an absolute `http:` or `https:` URL, and it reaches the formatter in its normalized form, with characters such as `"`, `<`, `>` and spaces percent-encoded. Before, the raw schema value went into the generated page, letting a schema author inject HTML or MDX. Any other value, such as a `javascript:` URL or text that is not a URL, now prints no specification link.
