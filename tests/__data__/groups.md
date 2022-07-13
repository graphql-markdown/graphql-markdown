---
id: group-by
slug: /group-by
title: Schema Documentation
sidebar_position: 1
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
sidebar_class_name: navbar__toggle
---

This is an example of documentation with grouping by GraphQL directive using the `groupByDirective` option (see [documentation](/#about-groupbydirective)):

```json
{
  "schema": "data/schema_with_grouping.graphql",
  "rootPath": "./docs",
  "baseURL": "group-by",
  "linkRoot": "/",
  "homepage": "data/groups.md",
  "groupByDirective": {
    "directive": "doc",
    "field": "category",
    "fallback": "Common"
  },
  "docOptions": {
    "index": true
  }
}
```

<small><i>Generated on ##generated-date-time##.</i></small>
