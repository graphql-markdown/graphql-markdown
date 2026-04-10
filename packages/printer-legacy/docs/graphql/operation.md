# graphql/operation

Module for handling GraphQL operation printing functionality.
Provides utilities to print operation types, metadata, and code representations.

## Functions

### printCodeOperation()

```ts
function printCodeOperation(type, options?): string | MDXString;
```

Defined in: [printer-legacy/src/graphql/operation.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L94)

Prints the code representation of an operation.

#### Parameters

##### type

`unknown`

##### options?

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

---

### printOperationMetadata()

```ts
function printOperationMetadata(type, options): Maybe<PageSection[]>;
```

Defined in: [printer-legacy/src/graphql/operation.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L45)

Prints the operation metadata including arguments and type information.

#### Parameters

##### type

`unknown`

The operation type to print metadata for

##### options

`PrintTypeOptions`

Print type options for customizing output

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)[]&gt;

Ordered operation metadata sections, or undefined when `type` is not an operation

---

### printOperationType()

```ts
function printOperationType(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/graphql/operation.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L24)

Prints the operation type information.

#### Parameters

##### type

`unknown`

The operation type to print

##### options

`PrintTypeOptions`

Print type options for customizing output

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)&gt;

A "Type" PageSection, or undefined when `type` is not an operation
