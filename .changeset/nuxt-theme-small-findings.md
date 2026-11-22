---
"@graphql-markdown/nuxt-theme": patch
---

- Keep straight quotes and other entity-producing characters out of search snippets.
  - Search now drops straight double quotes and indexes `'`, `&`, `<` and `>` as `’`, `+`, `‹` and `›`, so a search for those exact characters no longer matches.
- Name deprecated sidebar entries for screen readers with an `aria-label`.
- Add the site title to reference page titles.
