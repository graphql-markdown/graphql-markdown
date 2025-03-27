# common

## Functions

### formatDescription()

```ts
function formatDescription(type, replacement): string | MDXString
```

Defined in: [common.ts:55](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L55)

#### Parameters

##### type

`unknown`

##### replacement

`Maybe`\<`string`\> = `NO_DESCRIPTION_TEXT`

#### Returns

`string` \| `MDXString`

***

### printCustomDirectives()

```ts
function printCustomDirectives(type, options?): string
```

Defined in: [common.ts:19](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L19)

#### Parameters

##### type

`unknown`

##### options?

`PrintTypeOptions`

#### Returns

`string`

***

### printDeprecation()

```ts
function printDeprecation(type, options): string
```

Defined in: [common.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L91)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string`

***

### printDescription()

```ts
function printDescription(
   type, 
   options, 
   noText?): string | MDXString
```

Defined in: [common.ts:113](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L113)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

##### noText?

`string`

#### Returns

`string` \| `MDXString`

***

### printWarning()

```ts
function printWarning(__namedParameters, options): string
```

Defined in: [common.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L73)

#### Parameters

##### \_\_namedParameters

###### text?

`string`

###### title?

`string`

##### options

`PrintTypeOptions`

#### Returns

`string`
