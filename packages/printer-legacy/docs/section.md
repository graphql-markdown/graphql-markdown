# section

## Variables

### sectionLevels

```ts
const sectionLevels: SectionLevel[];
```

#### Source

[section.ts:24](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L24)

## Functions

### printMetadataSection()

```ts
function printMetadataSection<T, V>(
   type, 
   values, 
   section, 
   options): string | MDXString
```

#### Type parameters

• **T**

• **V**

#### Parameters

• **type**: `T`

• **values**: `V` \| `V`[] \| readonly `V`[]

• **section**: `string`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[section.ts:143](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L143)

***

### printSection()

```ts
function printSection<V>(
   values, 
   section, 
   options): string | MDXString
```

#### Type parameters

• **V**

#### Parameters

• **values**: `V`[] \| readonly `V`[]

• **section**: `string`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[section.ts:98](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L98)

***

### printSectionItem()

```ts
function printSectionItem<T>(type, options): string | MDXString
```

#### Type parameters

• **T**

#### Parameters

• **type**: `T`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[section.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L30)

***

### printSectionItems()

```ts
function printSectionItems<V>(values, options): string | MDXString
```

#### Type parameters

• **V**

#### Parameters

• **values**: `V` \| `V`[]

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Source

[section.ts:71](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L71)
