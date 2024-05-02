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

#### Source

[link.ts:37](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L37)

***

### getLinkApiGroupFolder()

```ts
function getLinkApiGroupFolder(type): string
```

#### Parameters

• **type**: `unknown`

#### Returns

`string`

#### Source

[link.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L97)

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

#### Source

[link.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L59)

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

#### Source

[link.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L101)

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

#### Source

[link.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L158)

***

### hasOptionParentType()

```ts
function hasOptionParentType(options): boolean
```

#### Parameters

• **options**: `PrintLinkOptions`

#### Returns

`boolean`

#### Source

[link.ts:88](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L88)

***

### hasOptionWithAttributes()

```ts
function hasOptionWithAttributes(options): boolean
```

#### Parameters

• **options**: `PrintLinkOptions`

#### Returns

`boolean`

#### Source

[link.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L84)

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

#### Source

[link.ts:201](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L201)

***

### printLinkAttributes()

```ts
function printLinkAttributes(type, text): string
```

#### Parameters

• **type**: `unknown`

• **text**: `Maybe`\<`string`\>= `""`

#### Returns

`string`

#### Source

[link.ts:174](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L174)

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

#### Source

[link.ts:225](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L225)

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

#### Source

[link.ts:108](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L108)
