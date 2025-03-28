# relation

## Functions

### getRootTypeLocaleFromString()

```ts
function getRootTypeLocaleFromString(text): Maybe<TypeLocale>
```

Defined in: [relation.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L30)

Converts a string representation of a root type to its corresponding TypeLocale

#### Parameters

##### text

`string`

The string to convert to a TypeLocale

#### Returns

`Maybe`\<`TypeLocale`\>

The matching TypeLocale if found, undefined otherwise

***

### printRelationOf()

```ts
function printRelationOf<T>(
   type, 
   section, 
   getRelation, 
   options): string | MDXString
```

Defined in: [relation.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L50)

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

`Maybe`\<`IGetRelation`\<`T`\>\>

Function to retrieve relations of type T

##### options

`PrintTypeOptions`

Printing options for type formatting

#### Returns

`string` \| `MDXString`

Formatted MDX string containing the relations or empty string if no relations found

***

### printRelations()

```ts
function printRelations(type, options): string | MDXString
```

Defined in: [relation.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/relation.ts#L114)

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
