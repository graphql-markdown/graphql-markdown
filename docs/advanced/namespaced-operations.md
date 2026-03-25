---
pagination_prev: null
pagination_next: null
description: Documents namespaced GraphQL operations for nested query, mutation, and subscription fields.
keywords:
  - namespaced operations
  - GraphQL operation namespaces
  - operation grouping
---

# Namespaced operations

Grouping also works with namespaced operations (for example, `Query.analytics.*`, `Mutation.admin.*`, or `Subscription.events.*`).

If a root operation returns a namespace object, nested fields are generated as operation pages.

Namespace object type names must follow the corresponding operation suffix convention (`*Query`, `*Mutation`, `*Subscription`).

```graphql
type Query {
  analytics: AnalyticsQuery @doc(category: "Grade")
}

type AnalyticsQuery @doc(category: "Grade") {
  semesterGPA(semesterId: ID!): Int @doc(category: "Grade")
  coursesByDepartment(departmentId: ID!): [Course!]! @doc(category: "Course")
}
```

Generated operation pages include nested paths such as:

- `operations/queries/analytics/semester-gpa`
- `operations/queries/analytics/courses-by-department`

When [`groupByDirective`](/docs/advanced/group-by-directive) is enabled, these namespaced operations are still grouped by their directive category.

Generated code snippet for these namespaced operations will be wrapped into the namespace:

```graphql
# highlight-next-line
analytics {
  coursesByDepartment(
    departmentId: ID!
  ): [Course!]!
}
```

## Disable namespace wrapping with hooks

If you want to keep nested output paths but render operation code blocks without the namespace wrapper, use `beforePrintCodeHook` in your custom MDX module.

This hook runs before the code block is generated, so you can clear `operationNamespaceParts` only for the printed snippet.

```js title="custom-mdx.mjs"
import { isOperation } from "@graphql-markdown/graphql";

const beforePrintCodeHook = async (event) => {
  const { type } = event.data;

  if (!isOperation(type)) {
    return;
  }

  // highlight-next-line
  event.data.options.operationNamespaceParts = null;
};

export { beforePrintCodeHook };
```

Then register the module with `mdxParser` as described in [Hooks Recipes](/docs/advanced/hook-recipes) and [Integration with Frameworks](/docs/advanced/integration-with-frameworks).

With this hook enabled, a namespaced operation page can still be generated at `operations/queries/analytics/courses-by-department`, but its code block will render without the namespace wrapper:

```graphql
coursesByDepartment(
  departmentId: ID!
): [Course!]!
```
