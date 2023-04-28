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
          descriptor: (directiveType, constDirectiveType) => {
            // get value for argument "requires"
            const value = getDirectiveArgValue(
              directiveType,
              constDirectiveType,
              "requires",
            );
            return `This requires the current user to be in ${value} role.`;
          },
        },
        // ... other custom directive options
      },
    },
  ],
],
```

Use a helper function to get argument value for a directive.

```js
function getDirectiveArgValue(directiveType, constDirectiveType, argName) {
  const args = constDirectiveType.arguments ?? [];
  // get argument in the declared directive node
  const constArg = args.find((arg) => arg.name.value === argName);
  if (constArg) {
    return (
      constArg.value.fields ?? constArg.value.values ?? constArg.value.value
    );
  }
  // fallback to the argument default value in the defined directive type. 
  const defArg = directiveType.args.find((arg) => arg.name === argName);
  if (defArg) {
    return defArg.defaultValue || undefined;
  }

  // expect the argument by name to exist.
  throw new Error(`Argument by name ${argName} is not found!`);
}
```
