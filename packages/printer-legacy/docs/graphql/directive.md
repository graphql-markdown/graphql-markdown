# graphql/directive

Module for handling GraphQL directive printing and formatting.
Provides utilities to generate string representations of GraphQL directives
including their metadata, arguments, and locations.

## Functions

### printCodeDirective()

```ts
function printCodeDirective(type, options?): string;
```

Defined in: [graphql/directive.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/directive.ts#L66)

Generates a string representation of a complete GraphQL directive definition.

#### Parameters

##### type

`GraphQLDirective`

The GraphQL directive to process

##### options?

`PrintDirectiveOptions`

Configuration options for printing the directive (optional)

#### Returns

`string`

A formatted string containing the complete directive definition

---

### printDirectiveMetadata()

```ts
function printDirectiveMetadata(type, options): Promise<string | MDXString>;
```

Defined in: [graphql/directive.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/directive.ts#L48)

Prints metadata information for a GraphQL directive, focusing on its arguments.

#### Parameters

##### type

`GraphQLDirective`

The GraphQL directive to process

##### options

`PrintDirectiveOptions`

Configuration options for printing directive metadata

#### Returns

`Promise`&lt;`string` \| `MDXString`&gt;

Formatted metadata string in MDX format or empty string if no arguments
