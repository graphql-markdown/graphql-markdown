---
pagination_prev: null
pagination_next: null
---

# Homepage

If you decide to use a custom homepage for the GraphQL-generated documentation, then set the sidebar position to `sidebar_position: 1` to ensure it shows first:

```markdown title="schema.md"
---
id: schema
slug: /schema
title: Schema Documentation
sidebar_position: 1
---

This documentation has been automatically generated from the GraphQL schema.
```

:::tip

If you want to hide the homepage from the sidebar, then set the front matter `sidebar_class_name` (or `className` depending on your Docusaurus version) to `navbar__toggle`.

```markdown {6} title="schema.md"
---
id: schema
slug: /schema
title: Schema Documentation
sidebar_position: 1
sidebar_class_name: navbar__toggle
---
```

:::
