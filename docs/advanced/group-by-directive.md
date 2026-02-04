---
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

# Documentation categories

You can group the documentation to provide an easier user experience to navigate. This is accomplished by adding a directive to all the types you want to have grouped.

For example, we have two mutations called `addCourse` and `dropCourse`, and we want to group them under a category called `Courses`.

```graphql
type Mutation {
  AddCourse(input: String): String
}

type Mutation {
  DropCourse(input: String): String
}
```

## Usage

We can accomplish this by adding a directive called `doc` with a field `category` to each mutation.

```graphql
type Mutation {
  AddCourse(input: String): String @doc(category: "Course")
}

type Mutation {
  DropCourse(input: String): String @doc(category: "Course")
}
```

We can add a fallback option called `Common` which is for types that we don't explicitly add a directive to.

It can be set either with the command line flag `--groupByDirective`:

```shell
npx docusaurus graphql-to-doc --groupByDirective "@doc(category|=Common)"
```

or the plugin configuration `groupByDirective`:

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // ... other options
      // highlight-start
      groupByDirective: {
        directive: "doc",
        field: "category",
        fallback: "Common", // default is Miscellaneous
      }
      // highlight-end
    },
  ],
],
```
