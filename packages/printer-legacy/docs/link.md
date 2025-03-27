# link

## Variables

### API\_GROUPS

```ts
const API_GROUPS: Required<ApiGroupOverrideType>;
```

Defined in: [link.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L42)

## Functions

### getCategoryLocale()

```ts
function getCategoryLocale(type): Maybe<TypeLocale>
```

Defined in: [link.ts:86](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L86)

#### Parameters

##### type

`unknown`

#### Returns

`Maybe`\<`TypeLocale`\>

***

### getLinkApiGroupFolder()

```ts
function getLinkApiGroupFolder(type, groups?): string
```

Defined in: [link.ts:158](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L158)

#### Parameters

##### type

`unknown`

##### groups?

`Maybe`\<`boolean` \| `ApiGroupOverrideType`\>

#### Returns

`string`

***

### getLinkCategoryFolder()

```ts
function getLinkCategoryFolder(type, operationLocale?): Maybe<string>
```

Defined in: [link.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L111)

#### Parameters

##### type

`unknown`

##### operationLocale?

`Maybe`\<`TypeLocale`\>

#### Returns

`Maybe`\<`string`\>

***

### getLinkDeprecatedFolder()

```ts
function getLinkDeprecatedFolder(type, option): string
```

Defined in: [link.ts:172](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L172)

#### Parameters

##### type

`unknown`

##### option

`Maybe`\<`TypeDeprecatedOption`\>

#### Returns

`string`

***

### getRelationLink()

```ts
function getRelationLink(
   category, 
   type, 
options): Maybe<TypeLink>
```

Defined in: [link.ts:261](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L261)

#### Parameters

##### category

`Maybe`\<`TypeLocale`\>

##### type

`unknown`

##### options

`PrintLinkOptions`

#### Returns

`Maybe`\<`TypeLink`\>

***

### hasOptionParentType()

```ts
function hasOptionParentType(options): boolean
```

Defined in: [link.ts:146](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L146)

#### Parameters

##### options

`PrintLinkOptions`

#### Returns

`boolean`

***

### hasOptionWithAttributes()

```ts
function hasOptionWithAttributes(options): boolean
```

Defined in: [link.ts:139](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L139)

#### Parameters

##### options

`PrintLinkOptions`

#### Returns

`boolean`

***

### hasPrintableDirective()

```ts
function hasPrintableDirective(type, options?): boolean
```

Defined in: [link.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L50)

#### Parameters

##### type

`unknown`

##### options?

`Pick`\<`PrintTypeOptions`, `"deprecated"` \| `"onlyDocDirectives"` \| `"skipDocDirectives"`\>

#### Returns

`boolean`

***

### printLink()

```ts
function printLink(type, options): string
```

Defined in: [link.ts:310](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L310)

#### Parameters

##### type

`unknown`

##### options

`PrintLinkOptions`

#### Returns

`string`

***

### printLinkAttributes()

```ts
function printLinkAttributes(type, text): string
```

Defined in: [link.ts:280](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L280)

#### Parameters

##### type

`unknown`

##### text

`Maybe`\<`string`\> = `""`

#### Returns

`string`

***

### printParentLink()

```ts
function printParentLink(type, options): string | MDXString
```

Defined in: [link.ts:338](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L338)

#### Parameters

##### type

`unknown`

##### options

`PrintLinkOptions`

#### Returns

`string` \| `MDXString`

***

### toLink()

```ts
function toLink(
   type, 
   name, 
   operation, 
   options): TypeLink
```

Defined in: [link.ts:189](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/link.ts#L189)

#### Parameters

##### type

`unknown`

##### name

`string`

##### operation

`Maybe`\<`TypeLocale`\>

##### options

`PrintLinkOptions`

#### Returns

`TypeLink`
