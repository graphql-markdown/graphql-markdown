# link

## Functions

### getCategoryLocale()

```ts
function getCategoryLocale(type): Maybe<TypeLocale>
```

#### Parameters

• **type**: `unknown`

#### Returns

`Maybe`\<`TypeLocale`\>

#### Defined in

[link.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L41)

***

### getLinkApiGroupFolder()

```ts
function getLinkApiGroupFolder(type): string
```

#### Parameters

• **type**: `unknown`

#### Returns

`string`

#### Defined in

[link.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L101)

***

### getLinkCategoryFolder()

```ts
function getLinkCategoryFolder(type, operationLocale?): Maybe<string>
```

#### Parameters

• **type**: `unknown`

• **operationLocale?**: `Maybe`\<`TypeLocale`\>

#### Returns

`Maybe`\<`string`\>

#### Defined in

[link.ts:63](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L63)

***

### getLinkDeprecatedFolder()

```ts
function getLinkDeprecatedFolder(type, option): string
```

#### Parameters

• **type**: `unknown`

• **option**: `Maybe`\<`TypeDeprecatedOption`\>

#### Returns

`string`

#### Defined in

[link.ts:105](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L105)

***

### getRelationLink()

```ts
function getRelationLink(
   category, 
   type, 
options): Maybe<TypeLink>
```

#### Parameters

• **category**: `Maybe`\<`TypeLocale`\>

• **type**: `unknown`

• **options**: `PrintLinkOptions`

#### Returns

`Maybe`\<`TypeLink`\>

#### Defined in

[link.ts:162](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L162)

***

### hasOptionParentType()

```ts
function hasOptionParentType(options): boolean
```

#### Parameters

• **options**: `PrintLinkOptions`

#### Returns

`boolean`

#### Defined in

[link.ts:92](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L92)

***

### hasOptionWithAttributes()

```ts
function hasOptionWithAttributes(options): boolean
```

#### Parameters

• **options**: `PrintLinkOptions`

#### Returns

`boolean`

#### Defined in

[link.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L88)

***

### printLink()

```ts
function printLink(type, options): string
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintLinkOptions`

#### Returns

`string`

#### Defined in

[link.ts:205](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L205)

***

### printLinkAttributes()

```ts
function printLinkAttributes(type, text): string
```

#### Parameters

• **type**: `unknown`

• **text**: `Maybe`\<`string`\> = `""`

#### Returns

`string`

#### Defined in

[link.ts:178](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L178)

***

### printParentLink()

```ts
function printParentLink(type, options): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintLinkOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[link.ts:229](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L229)

***

### toLink()

```ts
function toLink(
   type, 
   name, 
   operation, 
   options): TypeLink
```

#### Parameters

• **type**: `unknown`

• **name**: `string`

• **operation**: `Maybe`\<`TypeLocale`\>

• **options**: `PrintLinkOptions`

#### Returns

`TypeLink`

#### Defined in

[link.ts:112](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L112)
