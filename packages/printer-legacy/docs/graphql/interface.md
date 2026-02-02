# graphql/interface

Contains utilities for printing GraphQL interface types as Markdown documentation.

## Functions

### printCodeInterface()

```ts
function printCodeInterface(type, options): string;
```

Defined in: [printer-legacy/src/graphql/interface.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/interface.ts#L23)

Generates a code block representation of a GraphQL interface type.

#### Parameters

##### type

`unknown`

The GraphQL interface type to print

##### options

`PrintTypeOptions`

Configuration options for printing the type

#### Returns

`string`

A string containing the Markdown code block representation
