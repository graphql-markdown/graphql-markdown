---
pagination_prev: null
pagination_next: null
description: Document namespaced GraphQL operations for nested query fields.
keywords:
  - namespaced operations
  - GraphQL Query namespaces
  - operation grouping

---

# Namespaced operations

Grouping also works with namespaced operations (for example, `Query.analytics.*`).

If a root operation returns a namespace object, nested fields are generated as operation pages and can be grouped with `@doc(category: ...)` the same way as top-level operations.

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

When `groupByDirective` is enabled, these namespaced operations are still grouped by their directive category.
