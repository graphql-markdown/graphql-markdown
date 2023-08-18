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

The `descriptor` and `tag` functions receive 2 arguments:

- `directive` of type [`GraphQLDirective`](https://github.com/graphql/graphql-js/blob/main/src/type/directives.ts)
- `node` of type [`GraphQLNamedType`](https://github.com/graphql/graphql-js/blob/main/src/type/definition.ts) or [`ASTNode`](https://github.com/graphql/graphql-js/blob/main/src/language/ast.ts)

```ts
type DirectiveName = string & { _opaque: typeof DirectiveName };

type CustomDirective = {
  [name: DirectiveName]: {
    descriptor?: (directive?: GraphQLDirective, node?: unknown): string;
    tag?: (directive?: GraphQLDirective, node?: unknown): Badge;
  };
};

type Badge = {
  text: string | TypeLocale;
  classname: string;
};
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
const { directiveDescriptor, tagDescriptor } = require("@graphql-markdown/helpers");

//...//

plugins: [
  [
    "@graphql-markdown/docusaurus",
    {
      // ... other options
      customDirective: {
        "*": {
          descriptor: directiveDescriptor,
          tag: tagDescriptor,
        },
        // ... optionally specific custom directive options
      },
    },
  ],
],
```

## Helpers

The packages `@graphql-markdown/helpers` and `@graphql-markdown/utils` provide few helper functions to quick start:

```ts
import { directiveDescriptor, tagDescriptor } from "@graphql-markdown/helpers";
import {
  getTypeDirectiveArgValue,
  getTypeDirectiveValues,
} from "@graphql-markdown/utils";
```

:::info
`@graphql-markdown/helpers` is an optional peer dependency, and it needs to be installed before using it.

```shell
npm i @graphql-markdown/helpers
```

:::

### `@graphql-markdown/helpers`

- <code><b>directiveDescriptor</b>(directive: GraphQLDirective, type?: unknown, template?: string): string</code> interpolates a template-like string using a directive arguments values. It returns the directive description, if `template` is `undefined`.

- <code><b>tagDescriptor</b>(directive: GraphQLDirective, type?: unknown, classname?: string): Badge</code> returns the directive badge, with `classname` defaulted to `badge--secondary`.

### `@graphql-markdown/utils`

- <code><b>getTypeDirectiveArgValue</b>(directive: GraphQLDirective, node: unknown, argName: string): Record&lt;string, unknown&gt; | undefined</code> returns the value of a specific directive argument by name.

- <code><b>getTypeDirectiveValues</b>(directive: GraphQLDirective, node: unknown): Record&lt;string, unknown&gt; | undefined</code> returns a map of directive arguments and their values.
