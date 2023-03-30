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

This is an example of documentation grouping with GraphQL directive using the `groupByDirective` option (see [documentation](/docs/advanced/group-by-directive)):

```json
{
  "schema": "data/schema_with_grouping.graphql",
  "rootPath": "./docs",
  "baseURL": ".",
  "linkRoot": "/group-by",
  "homepage": "data/groups.md",
  "groupByDirective": {
    "directive": "doc",
    "field": "category",
    "fallback": "Common"
  },
  "docOptions": {
    "index": true
  },
  "printTypeOptions": {
    "parentTypePrefix": false,
    "relatedTypeSection": false,
    "typeBadges": false
  },
  "skipDocDirective": ["@noDoc"]
}
```

<small><i>Generated on ##generated-date-time##.</i></small>
