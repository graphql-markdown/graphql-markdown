---
pagination_prev: null
pagination_next: null
description: Add usage examples to your GraphQL type documentation using the @example directive. Show real-world usage patterns.
keywords:
  - GraphQL examples
  - example directive
  - usage examples
  - code samples
  - documentation examples
---

# Examples

Examples are added to types documentation as soon as the schema declares an `@example` directive. The option [`printTypeOptions.exampleSection`](/docs/settings#printtypeoptions) is only needed when the directive name, its field, or the value parsing has to be customized (see [advanced options](#advanced-options)).

## Usage

**1. Add a type definition directive `@example` to the schema**

  ```graphql
  directive @example(
    value: String
  ) on OBJECT | INPUT_OBJECT | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION | SCALAR
  ```

**2. Add examples to the schema**

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

  type Query {
    course(id: ID!): Course @example(value: "{ course(id: \"1\") { title } }")
  }
  ```

Examples can be inherited, this is why in the above example there is no example explicitly set for the type `Semester`, and it will render as the following

![examples](/img/docs/examples.png)

## Advanced options

Example directive definition and parser behavior can be customized through the configuration by setting `printTypeOptions.exampleSection` to a `TypeExampleSectionOption` object (any other value is ignored, and the defaults `@example(value: ...)` apply):

```ts
interface TypeExampleSectionOption {
  directive?: string; // customize the directive name
  field?: string; // customize the directive's field name
  parser?: (value?: unknown, type?: unknown) => unknown; // customize the field's value parsing
}
```

For example, if the GraphQL schema already supports examples using the `@spectaql` directive.

```graphql
type CustomExampleDirective {
  myField: String @spectaql(options: [{ key: "undocumented", value: "true" }])
  myFieldOtherField: String @spectaql(options: [{ key: "example", value: "An Example from the Directive" }])
  myFieldOtherOtherField: String @spectaql(options: [{ key: "examples", value: "[\"Example 1 from the Directive\", \"Example 2 from the Directive\"]" }])
}
```

```js title="docusaurus.config.js"
plugins: [
  [
    "@graphql-markdown/docusaurus",
    /** @type {import('@graphql-markdown/types').ConfigOptions} */
    {
      // ... other options
      printTypeOptions: {
        exampleSection: {
          directive: "spectaql",
          field: "options",
          /* simplified parser for @spectaql (non production ready) */
          parser: (options, type) => {
            if (!options) {
              return undefined;
            }

            const example = options.find(
              (option) => {
                return ["example", "examples"].includes(option.key);
              },
            );

            if (!example) {
              return undefined;
            }

            if (example.key === "example") {
              return example.value;
            }

            return JSON.parse(example.value)[0];
          }
        }
      }
    }
  ]
]
```
