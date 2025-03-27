# relation

## Functions

### getRootTypeLocaleFromString()

```ts
function getRootTypeLocaleFromString(text): Maybe<TypeLocale>
```

Defined in: [relation.ts:28](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L28)

#### Parameters

##### text

`string`

#### Returns

`Maybe`\<`TypeLocale`\>

***

### printRelationOf()

```ts
function printRelationOf<T>(
   type, 
   section, 
   getRelation, 
   options): string | MDXString
```

Defined in: [relation.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L42)

#### Type Parameters

##### T

`T`

#### Parameters

##### type

`unknown`

##### section

`unknown`

##### getRelation

`Maybe`\<`IGetRelation`\<`T`\>\>

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

***

### printRelations()

```ts
function printRelations(type, options): string | MDXString
```

Defined in: [relation.ts:103](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L103)

#### Parameters

##### type

`unknown`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`
