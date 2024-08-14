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

This is an example of documentation grouping with GraphQL directive using the `groupByDirective` option (see [documentation](/docs/advanced/group-by-directive)):

<Tabs groupId="config">
<TabItem value="docusaurus" label="Docusaurus (JS/TS)">

```js
{
  schema: "data/schema_with_grouping.graphql",
  baseURL: ".",
  linkRoot: "/examples/group-by",
  homepage: "data/groups.md",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
  },
  groupByDirective: {
    directive: "doc",
    field: "category",
    fallback: "Common"
  },
  docOptions: {
    index: true,
  },
  printTypeOptions: {
    deprecated: "group",
    exampleSection: true,
    parentTypePrefix: false,
    relatedTypeSection: false,
    typeBadges: true,
    hierarchy: "entity",
  },
  skipDocDirective: ["@noDoc"],
  customDirective: {
    auth: {
      descriptor: (directive, type) =>
        directiveDescriptor(
          directive,
          type,
          "This requires the current user to be in `${requires}` role.",
        ),
    },
    beta: {
      tag: (directive) => ({
        text: directive?.name?.toUpperCase(),
        classname: "badge--danger",
      }),
    },
    complexity: {
      descriptor: (directive, type) => {
        const { value, multipliers } = getTypeDirectiveValues(directive, type);
        const multiplierDescription = multipliers
          ? ` per ${multipliers.map((v) => `\`${v}\``).join(", ")}`
          : "";
        return `This has an additional cost of \`${value}\` points${multiplierDescription}.`;
      },
    },
  },
}
```

</TabItem>
<TabItem value="graphql-config" label="GraphQL Config (JS/TS)">

```js
{
  schema: "data/schema_with_grouping.graphql",
  extensions: {
    "graphql-markdown": {
      baseURL: ".",
      linkRoot: "/examples/group-by",
      homepage: "data/groups.md",
      loaders: {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
      },
      groupByDirective: {
        directive: "doc",
        field: "category",
        fallback: "Common"
      },
      docOptions: {
        index: true,
      },
      printTypeOptions: {
        deprecated: "group",
        exampleSection: true,
        parentTypePrefix: false,
        relatedTypeSection: false,
        typeBadges: true,
        hierarchy: "entity",
      },
      skipDocDirective: ["@noDoc"],
      customDirective: {
        auth: {
          descriptor: (directive, type) =>
            directiveDescriptor(
              directive,
              type,
              "This requires the current user to be in `${requires}` role.",
            ),
        },
        beta: {
          tag: (directive) => ({
            text: directive?.name?.toUpperCase(),
            classname: "badge--danger",
          }),
        },
        complexity: {
          descriptor: (directive, type) => {
            const { value, multipliers } = getTypeDirectiveValues(directive, type);
            const multiplierDescription = multipliers
              ? ` per ${multipliers.map((v) => `\`${v}\``).join(", ")}`
              : "";
            return `This has an additional cost of \`${value}\` points${multiplierDescription}.`;
          },
        },
      },
    },
  },
}
```

</TabItem>
<TabItem value="cli" label="CLI">

```bash
npx docusaurus graphql-to-doc \
    --homepage data/groups.md \
    --schema data/schema_with_grouping.graphql \
    --groupByDirective @doc(category|=Common) \
    --base . \
    --link /examples/group-by \
    --skip @noDoc \
    --index \
    --noParentType \
    --noRelatedType \
    --deprecated group \
    --hierarchy entity
```

</TabItem>
</Tabs>

<small><i>Generated on ##generated-date-time##.</i></small>
