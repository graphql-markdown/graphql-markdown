---
sidebar_position: 10
id: custom-directive
pagination_prev: null
pagination_next: null
description: Handle custom GraphQL schema directives in your documentation. Configure which directives to render and customize their display.
keywords:
  - GraphQL directives
  - custom directives
  - schema directives
  - directive documentation
  - auth directive
---

# Custom schema directives handling

Use `customDirective` to render a custom description or badge for the directives applied in your schema.

:::caution

`customDirective` is deprecated in favor of [`decorators`](/docs/customize/decorators), which supersedes it. See [migrating from `customDirective`](/docs/customize/decorators#migrating-from-customdirective).

:::

You can select which directives are rendered for the types or locations where they are declared, with a custom description for each.

For example, a query called `searchRole` should be limited to `ADMIN` user roles. We can express this by adding a directive called `auth` with an argument `requires` to the query.

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

Add the option [`customDirective`](/docs/reference/settings#customdirective) to the GraphQL-Markdown configuration.

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

The `descriptor` allows rendering the custom directive's description applicable to entities.

```js title=".graphqlrc.js"
module.exports = {
  schema: "./schema.graphql",
  extensions: {
    "graphql-markdown": {
      // ... other options
      customDirective: {
        auth: {
          // highlight-start
          descriptor: (directive, node) =>
            directiveDescriptor(
              directive,
              node,
              "This requires the current user to be in `${requires}` role.",
            ),
          // highlight-end
        },
        // ... other custom directive options
      },
    },
  },
};
```

The descriptor output is printed as text: MDX special characters (`{ } < > _ *`) are escaped, so a descriptor cannot inject HTML, JSX or MDX into the page.

### `tag`

The `tag` allows rendering custom badges (tags) based on the custom directive applicable to entities.

```js title=".graphqlrc.js"
module.exports = {
  schema: "./schema.graphql",
  extensions: {
    "graphql-markdown": {
      // ... other options
      customDirective: {
        beta: {
          // highlight-next-line
          tag: (directive, node) => ({
            text: directive.name,
            classname: "badge--info",
          }),
        },
        // ... other custom directive options
      },
    },
  },
};
```

### Wildcard

You can use **`"*"` as a wildcard** for the directive name. This will allow all directives not declared with their name under `customDirective` to be handled by the wildcard `descriptor` and/or `tag`.

```js title=".graphqlrc.js"
const {
  directiveDescriptor,
  directiveTag,
} = require("@graphql-markdown/helpers");

//...//

module.exports = {
  schema: "./schema.graphql",
  extensions: {
    "graphql-markdown": {
      // ... other options
      customDirective: {
        // highlight-start
        "*": {
          descriptor: directiveDescriptor,
          tag: directiveTag,
        },
        // highlight-end
        // ... optionally specific custom directive options
      },
    },
  },
};
```

## Helpers

The packages `@graphql-markdown/helpers` and `@graphql-markdown/graphql` provide a few helper functions to quickly start.

`@graphql-markdown/helpers` is an optional peer dependency, and it needs to be installed before using it.

```shell title="shell"
npm i @graphql-markdown/helpers
```

### `@graphql-markdown/helpers`

- [`directiveDescriptor`](/api/helpers/directives/descriptor)
- [`directiveTag`](/api/helpers/directives/tag)

### `@graphql-markdown/graphql`

- [`getTypeDirectiveValues`](/api/graphql/introspection#gettypedirectivevalues)
- [`getTypeDirectiveArgValue`](/api/graphql/introspection#gettypedirectiveargvalue)
