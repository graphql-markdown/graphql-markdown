# relation

This module provides functionality to print relationships between GraphQL types,
including return types, member fields, and implementations, in a formatted MDX string output.

## Functions

### getRootTypeLocaleFromString()

```ts
function getRootTypeLocaleFromString(text): Maybe<TypeLocale>;
```

Defined in: [printer-legacy/src/relation.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L40)

Converts a string representation of a root type to its corresponding `TypeLocale`

#### Parameters

##### text

`string`

The string to convert to a `TypeLocale`

#### Returns

`Maybe`&lt;`TypeLocale`&gt;

The matching `TypeLocale` if found, `undefined` otherwise

#### Example

```ts
const locale = getRootTypeLocaleFromString("Query");
```

---

### printRelationOf()

```ts
function printRelationOf<T>(
  type,
  section,
  getRelation,
  options,
): string | MDXString;
```

Defined in: [printer-legacy/src/relation.ts:65](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L65)

Prints the relation section for a specific type and relation category

#### Type Parameters

##### T

`T`

Type of the relation

#### Parameters

##### type

`unknown`

The GraphQL type to get relations for

##### section

`unknown`

The section title for the relation

##### getRelation

`Maybe`&lt;`IGetRelation`&lt;`T`&gt;&gt;

Function to retrieve relations of type T

##### options

`PrintTypeOptions`

Printing options for type formatting

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the relations or empty string if no relations found

#### Throws

If the schema is not provided in options

#### Example

```ts
const mdx = printRelationOf(type, "Member Of", getRelationOfField, options);
```

---

### printRelations()

```ts
function printRelations(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/relation.ts:134](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L134)

Prints all relations (return types, member fields, and implementations) for a given type

#### Parameters

##### type

`unknown`

The GraphQL type to get all relations for

##### options

`PrintTypeOptions`

Printing options for type formatting

#### Returns

`string` \| `MDXString`

Formatted MDX string containing all relations or empty string if no relations found

#### Throws

If the schema is not provided in options

#### Example

```ts
const relations = printRelations(myType, {
  schema,
  formatMDXBullet: () => "* ",
});
```
