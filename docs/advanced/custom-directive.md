---
id: custom-directive
pagination_prev: null
pagination_next: null
---

# Custom schema directives handling

For directives applied to the schema, you can select which ones to be rendered for the types or in the locations they are declared. Information about the custom directives includes a custom description.

For example, we have one query called `searchRole`, and we want to limit access to `ADMIN` user roles only.

We can accomplish this by adding a directive called `auth` with an argument `requires` to the query.

```graphql
directive @auth(
  requires: Roles = ADMIN
) on OBJECT | FIELD_DEFINITION

enum Roles {
  ADMIN
  USER
}

type Query {
  searchRole(roles: [Roles!]! = [ADMIN]): Int! @auth
}
```

Add the option `customDirective` to the `docusaurus2-graphql-doc-generator` configuration.

```js {6-19}
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        auth: {
          descriptor: (directive, type) => {
            // get value for argument "requires"
            const value = directiveDescriptor(
              directive,
              type,
              "This requires the current user to be in ${requires} role."
            );
          },
        },
        // ... other custom directive options
      },
    },
  ],
],
```

The `descriptor` helper receives 2 arguments:
- `directive` of type [`GraphQLDirective`](https://github.com/graphql/graphql-js/blob/main/src/type/directives.ts)
- `type` of type [`GraphQLNamedType`](https://github.com/graphql/graphql-js/blob/main/src/type/definition.ts) or [`ASTNode`](https://github.com/graphql/graphql-js/blob/main/src/language/ast.ts)

:::info
The package `@graphql-markdown/utils` provides some functions to quick start:
```js
const { 
  helper: { directiveDescriptor }, 
  graphql: { getTypeDirectiveArgValue, getTypeDirectiveValues } 
} = require("@graphql-markdown/utils");
```

- [`helper.directiveDescriptor(directive: GraphQLDirective, type: GraphQLNamedType | ASTNode, template: String): String`](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/helper.js) interpolates a template-like string using a directive arguments values. It returns the directive description, if `template` is `undefined`.
- `graphql.getTypeDirectiveArgValue(directive: GraphQLDirective, type: GraphQLNamedType | ASTNode, arg: String): Any` returns the value of a specific directive argument by name
- `graphql.getTypeDirectiveValues(directive: GraphQLDirective, type: GraphQLNamedType | ASTNode): { [arg: string]: Any }` returns a map of directive arguments and their values

:::
