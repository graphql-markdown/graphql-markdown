---
pagination_prev: null
pagination_next: null
---

# Custom directives

For custom directives, you can select which ones to be rendered for the types or in the locations they are declared. Information about the custom directives includes a custom description.

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

Use a helper function to get argument value for a directive. You can create one by yourself or you might import an existing helper function available in `@graphql-markdown/utils` package like below:

```js
const { helper: { directiveDescriptor } } = require("@graphql-markdown/utils");
```
