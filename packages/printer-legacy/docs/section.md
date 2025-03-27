# section

## Functions

### printMetadataSection()

```ts
function printMetadataSection<T, V>(
   type, 
   values, 
   section, 
   options): string | MDXString
```

Defined in: [section.ts:135](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L135)

#### Type Parameters

##### T

`T`

##### V

`V`

#### Parameters

##### type

`T`

##### values

`V` | `V`[] | readonly `V`[]

##### section

`string`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

***

### printSection()

```ts
function printSection<V>(
   values, 
   section, 
   options): string | MDXString
```

Defined in: [section.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L93)

#### Type Parameters

##### V

`V`

#### Parameters

##### values

`V`[] | readonly `V`[]

##### section

`string`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

***

### printSectionItem()

```ts
function printSectionItem<T>(type, options): string | MDXString
```

Defined in: [section.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L21)

#### Type Parameters

##### T

`T`

#### Parameters

##### type

`T`

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`

***

### printSectionItems()

```ts
function printSectionItems<V>(values, options): string | MDXString
```

Defined in: [section.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L65)

#### Type Parameters

##### V

`V`

#### Parameters

##### values

`V` | `V`[]

##### options

`PrintTypeOptions`

#### Returns

`string` \| `MDXString`
