# graphql/object

GraphQL Object Type printing utilities

## Functions

### printCodeObject()

```ts
function printCodeObject(type, options): string;
```

Defined in: [printer-legacy/src/graphql/object.ts:108](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L108)

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

Defined in: [printer-legacy/src/graphql/object.ts:68](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L68)

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
function printObjectMetadata(type, options): Maybe<PageSection[]>;
```

Defined in: [printer-legacy/src/graphql/object.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/printer-legacy/src/graphql/object.ts#L46)

Prints the complete metadata section for a GraphQL object type

#### Parameters

##### type

`unknown`

The GraphQL type object to process

##### options

`PrintTypeOptions`

Printing options

#### Returns

`Maybe`&lt;[`PageSection`](../events.md#pagesection)[]&gt;

Ordered metadata sections for fields and interfaces
