# common

## Functions

### formatDescription()

```ts
function formatDescription(type, replacement): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **replacement**: `Maybe`\<`string`\> = `NO_DESCRIPTION_TEXT`

#### Returns

`string` \| `MDXString`

#### Defined in

[common.ts:56](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L56)

***

### hasPrintableDirective()

```ts
function hasPrintableDirective(type, options?): boolean
```

#### Parameters

• **type**: `unknown`

• **options?**: `Pick`\<`PrintTypeOptions`, `"deprecated"` \| `"onlyDocDirectives"` \| `"skipDocDirectives"`\>

#### Returns

`boolean`

#### Defined in

[common.ts:107](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L107)

***

### printCustomDirectives()

```ts
function printCustomDirectives(type, options?): string
```

#### Parameters

• **type**: `unknown`

• **options?**: `PrintTypeOptions`

#### Returns

`string`

#### Defined in

[common.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L23)

***

### printDeprecation()

```ts
function printDeprecation(type): string
```

#### Parameters

• **type**: `unknown`

#### Returns

`string`

#### Defined in

[common.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L83)

***

### printDescription()

```ts
function printDescription(
   type, 
   options?, 
   noText?): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **options?**: `PrintTypeOptions`

• **noText?**: `string`

#### Returns

`string` \| `MDXString`

#### Defined in

[common.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L96)

***

### printWarning()

```ts
function printWarning(text?, title?): string
```

#### Parameters

• **text?**: `string`

• **title?**: `string`

#### Returns

`string`

#### Defined in

[common.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L71)
