# section

## Variables

### sectionLevels

```ts
const sectionLevels: SectionLevel[];
```

#### Defined in

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

#### Type Parameters

• **T**

• **V**

#### Parameters

• **type**: `T`

• **values**: `V` \| `V`[] \| readonly `V`[]

• **section**: `string`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[section.ts:145](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L145)

***

### printSection()

```ts
function printSection<V>(
   values, 
   section, 
   options): string | MDXString
```

#### Type Parameters

• **V**

#### Parameters

• **values**: `V`[] \| readonly `V`[]

• **section**: `string`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[section.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L100)

***

### printSectionItem()

```ts
function printSectionItem<T>(type, options): string | MDXString
```

#### Type Parameters

• **T**

#### Parameters

• **type**: `T`

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[section.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L30)

***

### printSectionItems()

```ts
function printSectionItems<V>(values, options): string | MDXString
```

#### Type Parameters

• **V**

#### Parameters

• **values**: `V` \| `V`[]

• **options**: `PrintTypeOptions`

#### Returns

`string` \| `MDXString`

#### Defined in

[section.ts:73](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L73)
