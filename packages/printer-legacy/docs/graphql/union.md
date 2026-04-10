# graphql/union

Module for handling GraphQL Union type printing operations.

## Functions

### printCodeUnion()

```ts
function printCodeUnion(type, options?): string;
```

Defined in: [printer-legacy/src/graphql/union.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/union.ts#L43)

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
function printUnionMetadata(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/graphql/union.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/union.ts#L23)

Generates metadata documentation for a GraphQL Union type.

#### Parameters

##### type

`unknown`

The GraphQL type to process

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)&gt;

A "Possible types" PageSection, or undefined when `type` is not a union
