# graphql/union

Module for handling GraphQL Union type printing operations.

## Functions

### printCodeUnion()

```ts
function printCodeUnion(type, options?): string;
```

Defined in: [printer-legacy/src/graphql/union.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/union.ts#L42)

Generates GraphQL SDL code representation of a Union type.

#### Parameters

##### type

`unknown`

The GraphQL type to process

##### options?

`PrintTypeOptions`

Configuration options for printing (unused)

#### Returns

`string`

SDL string representation of the union type

---

### printUnionMetadata()

```ts
function printUnionMetadata(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/graphql/union.ts:22](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/union.ts#L22)

Generates metadata documentation for a GraphQL Union type.

#### Parameters

##### type

`unknown`

The GraphQL type to process

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the union type's possible types
