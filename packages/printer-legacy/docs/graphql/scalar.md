# graphql/scalar

Provides utility functions for handling GraphQL scalar types in markdown generation.

## Functions

### printCodeScalar()

```ts
function printCodeScalar(type, options?): string;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L57)

Generates the GraphQL SDL representation of a scalar type.

#### Parameters

##### type

`unknown`

The GraphQL scalar type object

##### options?

`PrintTypeOptions`

Options for printing type information (unused)

#### Returns

`string`

SDL string representation of the scalar type

---

### printScalarMetadata()

```ts
function printScalarMetadata(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:44](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L44)

Prints metadata information for a scalar type.
Currently only includes the specification URL if available.

#### Parameters

##### type

`unknown`

The GraphQL scalar type object

##### options

`PrintTypeOptions`

Options for printing type information

#### Returns

`string` \| `MDXString`

Markdown string containing the scalar metadata

---

### printSpecification()

```ts
function printSpecification(type, options): string | MDXString;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:18](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L18)

Generates markdown documentation for a scalar type's specification URL.

#### Parameters

##### type

`unknown`

The GraphQL scalar type object

##### options

`PrintTypeOptions`

Options for printing type information

#### Returns

`string` \| `MDXString`

Markdown string containing the specification link, or empty string if no URL exists
