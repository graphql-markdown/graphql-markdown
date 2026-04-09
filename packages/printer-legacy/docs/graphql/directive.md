# graphql/directive

Module for handling GraphQL directive printing and formatting.
Provides utilities to generate string representations of GraphQL directives
including their metadata, arguments, and locations.

## Functions

### printCodeDirective()

```ts
function printCodeDirective(type, options?): string;
```

Defined in: [printer-legacy/src/graphql/directive.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/directive.ts#L67)

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
function printDirectiveMetadata(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/graphql/directive.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/directive.ts#L49)

Prints metadata information for a GraphQL directive, focusing on its arguments.

#### Parameters

##### type

`GraphQLDirective`

The GraphQL directive to process

##### options

`PrintDirectiveOptions`

Configuration options for printing directive metadata

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)&gt;

An "Arguments" PageSection, or undefined when no arguments are available
