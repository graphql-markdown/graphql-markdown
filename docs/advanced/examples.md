---
pagination_prev: null
pagination_next: null
---

# Examples

Using the option [`printTypeOptions.exampleSection`](/docs/settings#printtypeoptions), you can add examples to types documentation.

## Usage

**1. Add a type definition directive `@example` to the schema**

  ```graphql
  directive @example(
    value: String
  ) on OBJECT | INPUT_OBJECT | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION | SCALAR
  ```

**2. Enrich your types definitions with examples**

  ```graphql
  scalar Date @example(value: "1970-01-01")

  interface Record {
    id: ID! @example(value: "1")
  }

  type Course implements Record @example(value: "{ \"id\": 2, \"title\": \"GraphQL\" }") {
    id: ID!
    title: String!
  } 

  type Semester implements Record {
    id: ID!
    startDate: Date
    withdrawDate: Date @deprecated
    endDate: Date
    courses: [Course!]!
  }
  ```

Examples can be inherited, this is why in the above example there is no example explicitly set for the type `Semester`, and it will render as following

![examples](/img/docs/examples.png)
