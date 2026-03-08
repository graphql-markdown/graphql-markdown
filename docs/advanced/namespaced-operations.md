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
