# common

## Functions

### formatDescription()

```ts
function formatDescription(type, replacement): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **replacement**: `Maybe`\<`string`\>= `NO_DESCRIPTION_TEXT`

#### Returns

`string` \| `MDXString`

#### Source

[common.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L54)

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

#### Source

[common.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L105)

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

#### Source

[common.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L21)

***

### printDeprecation()

```ts
function printDeprecation(type): string
```

#### Parameters

• **type**: `unknown`

#### Returns

`string`

#### Source

[common.ts:81](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L81)

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

#### Source

[common.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L94)

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

#### Source

[common.ts:69](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/common.ts#L69)
