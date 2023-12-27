---
pagination_prev: null
pagination_next: null
---

# Documentation categories

You can group the documentation to provide for an easier user experience to navigate. This is accomplished by adding a directive to all the types you want to have grouped.

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
