---
"@graphql-markdown/graphql": minor
"@graphql-markdown/printer-legacy": minor
---

- `getSchemaEntity` no longer requires print options and unwraps `NonNull`/`List` types. `isEntity` decorator predicates and the decorator context `entity` now resolve wrapped (`List`/`NonNull`) types instead of returning undefined.
- Export `toLink` from `@graphql-markdown/printer-legacy`, so custom formatters can build the same entity links as the printer.
