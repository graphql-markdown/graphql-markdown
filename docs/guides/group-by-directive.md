---
sidebar_position: 60
pagination_prev: null
pagination_next: null
description: Organize GraphQL documentation into categories using directives. Group queries, mutations, and types for better navigation.
keywords:
  - GraphQL documentation categories
  - group by directive
  - organize documentation
  - navigation structure
  - type grouping
---

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

# Documentation categories

You can group the documentation to provide an easier user experience to navigate. This is accomplished by adding a directive to all the types you want to have grouped.

For example, we have two mutations called `addCourse` and `dropCourse`, and we want to group them under a category called `Courses`.

```graphql
type Mutation {
  AddCourse(input: String): String
  DropCourse(input: String): String
}
```

## Usage

We can accomplish this by adding a directive called `doc` with a field `category` to each mutation.

```graphql
type Mutation {
  AddCourse(input: String): String @doc(category: "Course")
  DropCourse(input: String): String @doc(category: "Course")
}
```

We can add a fallback option called `Common` which is for types that we don't explicitly add a directive to.

It can be set either with the command line flag `--groupByDirective`:

<Tabs groupId="package-manager" queryString>
<TabItem value="npm" label="npm" default>

```shell
npx gqlmd graphql-to-doc --groupByDirective "@doc(category|=Common)"
```

</TabItem>
<TabItem value="pnpm" label="pnpm">

```shell
pnpm exec gqlmd graphql-to-doc --groupByDirective "@doc(category|=Common)"
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn gqlmd graphql-to-doc --groupByDirective "@doc(category|=Common)"
```

</TabItem>
<TabItem value="bun" label="bun">

```shell
bunx gqlmd graphql-to-doc --groupByDirective "@doc(category|=Common)"
```

</TabItem>
</Tabs>

or the configuration option `groupByDirective`:

```yaml title=".graphqlrc"
schema: ./schema.graphql
extensions:
  graphql-markdown:
    # highlight-start
    groupByDirective:
      directive: "doc"
      field: "category"
      fallback: "Common" # default is Miscellaneous
    # highlight-end
```
