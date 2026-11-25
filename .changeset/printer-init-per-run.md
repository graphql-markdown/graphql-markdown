---
"@graphql-markdown/printer-legacy": patch
---

Each generation run now uses its own options. A second run in the same Node.js process, such as a script that renders two GraphQL Config projects one after the other, no longer reuses the first run's formatter and settings.
