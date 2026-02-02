# graphql/operation

Module for handling GraphQL operation printing functionality.
Provides utilities to print operation types, metadata, and code representations.

## Functions

### printOperationMetadata()

```ts
function printOperationMetadata(type, options): Promise<string | MDXString>;
```

Defined in: [graphql/operation.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L39)

Prints the operation metadata including arguments and type information.

#### Parameters

##### type

`unknown`

The operation type to print metadata for

##### options

`PrintTypeOptions`

Print type options for customizing output

#### Returns

`Promise`&lt;`string` \| `MDXString`&gt;

Formatted string containing operation metadata or empty string if invalid

---

### printOperationType()

```ts
function printOperationType(type, options): Promise<string | MDXString>;
```

Defined in: [graphql/operation.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L18)

Prints the operation type information.

#### Parameters

##### type

`unknown`

The operation type to print

##### options

`PrintTypeOptions`

Print type options for customizing output

#### Returns

`Promise`&lt;`string` \| `MDXString`&gt;

Formatted string representation of the operation type or empty string if invalid
