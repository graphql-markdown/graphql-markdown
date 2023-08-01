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
directive @auth(requires: Roles = ADMIN) on OBJECT | FIELD_DEFINITION

enum Roles {
  ADMIN
  USER
}

type Query {
  searchRole(roles: [Roles!]! = [ADMIN]): Int! @auth
}
```

## Usage

Add the option [`customDirective`](/docs/settings#customdirective) to the `@graphql-markdown/docusaurus` configuration.

The `descriptor` and `tag` functions receives 2 arguments:

- `directive` of type [`GraphQLDirective`](https://github.com/graphql/graphql-js/blob/main/src/type/directives.ts)
- `node` of type [`GraphQLNamedType`](https://github.com/graphql/graphql-js/blob/main/src/type/definition.ts) or [`ASTNode`](https://github.com/graphql/graphql-js/blob/main/src/language/ast.ts)

```ts
type CustomDirective = {
  [name: string | "*"]: CustomDirectiveOptions | undefined
}

type CustomDirectiveOptions = {
  descriptor: DescriptorFunction?
  tag: TagFunction?
}

type DescriptorFunction = (directive: GraphQLDirective, node: GraphQLNamedType | ASTNode) => string;

type tagFunction = (directive: GraphQLDirective, node: GraphQLNamedType | ASTNode) => Tag;

type Tag = { text: string, classname: string };
```

### `descriptor`

The `descriptor` allows rendering custom directive description applicable to entities.

```js {8-13}
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        auth: {
          descriptor: (directive, node) =>
            directiveDescriptor(
              directive,
              node,
              "This requires the current user to be in `${requires}` role.",
            ),
        }
        // ... other custom directive options
      },
    },
  ],
],
```

### `tag`

The `tag` allows rendering custom badges (tags) based on custom directive applicable to entities.

```js {8}
plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        beta: {
          tag: (directive, node) => ({ text: directive.name, classname: "badge--info" }),
        }
        // ... other custom directive options
      },
    },
  ],
],
```

### Wildcard

You can use **`"*"` as wildcard** for the directive name. This will allow all directives not declared with their name under `customDirective` to be handled by the wildcard `descriptor` and/or `tag`.

```js {11-14}
const { helper } = require("@graphql-markdown/utils");

//...//

plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        "*": {
          descriptor: helper.directiveDescriptor,
          tag: helper.tagDescriptor,
        },
        // ... optionally specific custom directive options
      },
    },
  ],
],
```

## Helpers

The package `@graphql-markdown/utils` provides few helper functions to quick start:

```js
const {
  helper: { directiveDescriptor, tagDescriptor },
  graphql: { getTypeDirectiveArgValue, getTypeDirectiveValues },
} = require("@graphql-markdown/utils");
```

### `directiveDescriptor`

[`helper.directiveDescriptor(directive: GraphQLDirective, node: GraphQLNamedType | ASTNode, template: String?): String`](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/helper.js) interpolates a template-like string using a directive arguments values. It returns the directive description, if `template` is `undefined`.

### `tagDescriptor`

[`helper.tagDescriptor(directive: GraphQLDirective, node: GraphQLNamedType | ASTNode, classname: String?): String`](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/helper.js) returns the directive name, with `classname` defaulted to `badge--secondary`.

### `getTypeDirectiveArgValue`

`graphql.getTypeDirectiveArgValue(directive: GraphQLDirective, node: GraphQLNamedType | ASTNode, arg: String): Any` returns the value of a specific directive argument by name.

### `getTypeDirectiveValues`

`graphql.getTypeDirectiveValues(directive: GraphQLDirective, node: GraphQLNamedType | ASTNode): { [arg: string]: Any }` returns a map of directive arguments and their values.
