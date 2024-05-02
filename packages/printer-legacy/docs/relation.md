# relation

## Functions

### getRootTypeLocaleFromString()

```ts
function getRootTypeLocaleFromString(text): Maybe<TypeLocale>
```

#### Parameters

• **text**: `string`

#### Returns

`Maybe`\<`TypeLocale`\>

#### Source

[relation.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L25)

***

### printRelationOf()

```ts
function printRelationOf<T>(
   type, 
   section, 
   getRelation, 
   options): string | MDXString
```

#### Type parameters

• **T**

#### Parameters

• **type**: `unknown`

• **section**: `unknown`

• **getRelation**: `Maybe`\<`IGetRelation`\<`T`\>\>

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[relation.ts:36](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L36)

***

### printRelations()

```ts
function printRelations(type, options): string | MDXString
```

#### Parameters

• **type**: `unknown`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[relation.ts:91](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L91)
