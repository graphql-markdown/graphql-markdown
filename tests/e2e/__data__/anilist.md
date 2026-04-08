---
id: schema
slug: /
title: Schema Documentation
sidebar_position: 1
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
sidebar_class_name: navbar__toggle
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This documentation has been automatically generated using [AniList APIv2](https://anilist.gitbook.io/anilist-apiv2-docs/) endpoint with following plugin configuration:

<Tabs groupId="config">
<TabItem value="docusaurus" label="Docusaurus (JSON)">

```json
{
  "schema": "https://graphql.anilist.co/",
  "linkRoot": "/examples/default",
  "baseURL": ".",
  "homepage": "data/anilist.md",
  "loaders": {
    "UrlLoader": {
      "module": "@graphql-tools/url-loader",
      "options": { "method": "POST" }
    }
  },
  "docOptions": {
    "frontMatter": {
      "pagination_next": null,
      "pagination_prev": null
    }
  },
  "printTypeOptions": {
    "deprecated": "group"
  }
}
```

</TabItem>
<TabItem value="graphql-config" label="GraphQL Config (YAML)">

```yaml
schema: https://graphql.anilist.co/
extensions:
  graphql-markdown:
    linkRoot: "/examples/default"
    baseURL: "."
    homepage: data/anilist.md
    loaders:
      UrlLoader:
        module: "@graphql-tools/url-loader"
        options:
          method: POST
    docOptions:
      frontMatter:
        pagination_next: null
        pagination_prev: null
    printTypeOptions:
      deprecated: group
```

</TabItem>
<TabItem value="cli" label="CLI">

```bash
npx docusaurus graphql-to-doc \
    --homepage data/anilist.md \
    --schema https://graphql.anilist.co/ \
    --base . \
    --link /examples/default \
    --deprecated group
```

</TabItem>
</Tabs>

<small><i>Generated on ##generated-date-time##.</i></small>
