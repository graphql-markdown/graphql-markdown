# graphql/object

GraphQL Object Type printing utilities

## Functions

### printCodeObject()

```ts
function printCodeObject(type, options): string;
```

Defined in: [graphql/object.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L104)

Prints a GraphQL object type definition as a code block

#### Parameters

##### type

`unknown`

The GraphQL type object to process

##### options

`PrintTypeOptions`

Printing options

#### Returns

`string`

GraphQL object type definition as a code block string

---

### printCodeType()

```ts
function printCodeType(type, entity, options): string;
```

Defined in: [graphql/object.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L64)

Prints the GraphQL type definition as a code block

#### Parameters

##### type

`unknown`

The GraphQL type object to process

##### entity

`string`

The entity type identifier (e.g., "type", "interface")

##### options

`PrintTypeOptions`

Printing options

#### Returns

`string`

GraphQL type definition as a code block string

---

### printObjectMetadata()

```ts
function printObjectMetadata(type, options): string;
```

Defined in: [graphql/object.ts:42](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L42)

Prints the complete metadata section for a GraphQL object type

#### Parameters

##### type

`unknown`

The GraphQL type object to process

##### options

`PrintTypeOptions`

Printing options

#### Returns

`string`

Markdown formatted string containing fields and interfaces metadata
