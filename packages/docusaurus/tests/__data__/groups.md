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

This is an example of documentation grouping with GraphQL directive using the `groupByDirective` option (see [documentation](/docs/advanced/group-by-directive)):

```js
{
  schema: "data/schema_with_grouping.graphql",
  baseURL: ".",
  linkRoot: "/examples/group-by",
  homepage: "data/groups.md",
  groupByDirective: {
    directive: "doc",
    field: "category",
    fallback: "Common"
  },
  docOptions: {
    index: true
  },
  printTypeOptions: {
    parentTypePrefix: false,
    relatedTypeSection: false,
    typeBadges: true,
    deprecated: "group"
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

<small><i>Generated on ##generated-date-time##.</i></small>
