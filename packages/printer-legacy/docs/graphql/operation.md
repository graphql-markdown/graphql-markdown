# graphql/operation

## Variables

### printCodeOperation()

```ts
const printCodeOperation: (type, options?, indentationLevel) => string | MDXString = printCodeField;
```

Defined in: [graphql/operation.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L37)

#### Parameters

##### type

`unknown`

##### options?

`PrintTypeOptions`

##### indentationLevel?

`number` = `0`

#### Returns

`string` \| `MDXString`

## Functions

### printOperationMetadata()

```ts
function printOperationMetadata(type, options): string | MDXString
```

Defined in: [graphql/operation.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L23)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

***

### printOperationType()

```ts
function printOperationType(type, options): string | MDXString
```

Defined in: [graphql/operation.ts:8](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/operation.ts#L8)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`
