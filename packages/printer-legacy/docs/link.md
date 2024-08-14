# link

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

#### Defined in

[link.ts:45](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L45)

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

[link.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L50)

***

### getLinkApiGroupFolder()

```ts
function getLinkApiGroupFolder(type, groups?): string
```

#### Parameters

• **type**: `unknown`

• **groups?**: `Maybe`\<`boolean` \| `ApiGroupOverrideType`\>

#### Returns

`string`

#### Defined in

[link.ts:110](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L110)

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

[link.ts:72](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L72)

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

[link.ts:121](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L121)

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

[link.ts:198](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L198)

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

[link.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L101)

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

[link.ts:97](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L97)

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

[link.ts:241](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L241)

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

[link.ts:214](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L214)

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

[link.ts:265](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L265)

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

[link.ts:135](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L135)
