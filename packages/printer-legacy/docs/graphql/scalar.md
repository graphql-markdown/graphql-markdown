# graphql/scalar

Provides utility functions for handling GraphQL scalar types in markdown generation.

## Functions

### printCodeScalar()

```ts
function printCodeScalar(type, options?): string;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:62](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L62)

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
function printScalarMetadata(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L49)

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

`Maybe`&lt;[`PageSection`](../events.md#pagesection)&gt;

A scalar metadata PageSection, or undefined when not available

---

### printSpecification()

```ts
function printSpecification(type, options): Maybe<PageSection>;
```

Defined in: [printer-legacy/src/graphql/scalar.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/scalar.ts#L21)

Generates markdown documentation for a scalar type's specification URL.

#### Parameters

##### type

`unknown`

The GraphQL scalar type object

##### options

`PrintTypeOptions`

Options for printing type information

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)&gt;

A specification PageSection, or undefined when no URL exists
