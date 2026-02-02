# section

Module responsible for generating Markdown sections for GraphQL schema documentation.
Handles the printing of section items, metadata, and structured documentation content.

## Functions

### printMetadataSection()

```ts
function printMetadataSection<T, V>(
  type,
  values,
  section,
  options,
): string | MDXString;
```

Defined in: [printer-legacy/src/section.ts:170](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L170)

Prints a metadata section with special handling for deprecated items.

#### Type Parameters

##### T

`T`

Type of the parent element

##### V

`V`

Type of the values being printed

#### Parameters

##### type

`T`

The parent type containing the metadata

##### values

Values to include in the metadata section

`V` | `V`[] | readonly `V`[]

##### section

`string`

Section title/header

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the metadata section

---

### printSection()

```ts
function printSection<V>(values, section, options): string | MDXString;
```

Defined in: [printer-legacy/src/section.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L119)

Prints a complete section with title and content.

#### Type Parameters

##### V

`V`

Type of the values being printed

#### Parameters

##### values

Array of values to include in the section

`V`[] | readonly `V`[]

##### section

`string`

Section title/header

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the complete section

---

### printSectionItem()

```ts
function printSectionItem<T>(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/section.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L33)

Prints a single section item with its associated metadata.

#### Type Parameters

##### T

`T`

Type of the GraphQL element being printed

#### Parameters

##### type

`T`

The GraphQL type or field to print

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the section item

---

### printSectionItems()

```ts
function printSectionItems<V>(values, options): string | MDXString;
```

Defined in: [printer-legacy/src/section.ts:83](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/section.ts#L83)

Prints an array of section items with consistent formatting.

#### Type Parameters

##### V

`V`

Type of the values being printed

#### Parameters

##### values

Single value or array of values to print as section items

`V` | `V`[]

##### options

`PrintTypeOptions`

Configuration options for printing

#### Returns

`string` \| `MDXString`

Formatted MDX string containing all section items
