# Module: introspection

## Functions

### \_\_getFields

```ts
__getFields<T, V>(
  type,
  processor?,
  fallback?): GraphQLFieldMap< unknown, unknown > | GraphQLInputFieldMap | V
```

Returns the fields from a GraphQL schema type.

see [getOperation](introspection.md#getoperation), [getFields](introspection.md#getfields)

#### Type parameters

| Parameter |
| :------ |
| `T` |
| `V` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type` | `T` | the GraphQL schema type to parse. |
| `processor`? | (`fieldMap`) => `V` | optional callback function to parse the fields map. |
| `fallback`? | `V` | optional fallback value, `undefined` if not set. |

#### Returns

`GraphQLFieldMap`\< `unknown`, `unknown` \> \| `GraphQLInputFieldMap` \| `V`

a map of fields as k/v records, or `fallback` value if no fields available.

#### Defined In

[packages/graphql/src/introspection.ts:234](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L234)

***

### getDirective

```ts
getDirective(entity, directives): GraphQLDirective[]
```

Returns a schema entity's list of directives matching a defined set.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `unknown` | a GraphQL schema entity. |
| `directives` | `Maybe`\< `string` \| `string`[] \> | a directive name or a list of directive names. |

#### Returns

`GraphQLDirective`[]

a list of GraphQL directives matching the set, else `false`.

#### Defined In

[packages/graphql/src/introspection.ts:136](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L136)

***

### getFields

```ts
getFields(type): unknown[]
```

Returns fields map for a GraphQL schema type.

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `type` | `unknown` | the GraphQL schema type to parse. |

#### Returns

`unknown`[]

a list of fields of type object.

#### Defined In

[packages/graphql/src/introspection.ts:299](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L299)

***

### getOperation

```ts
getOperation(operationType?): Record< string, GraphQLOperationType >
```

Returns fields map for a GraphQL operation type (query, mutation, subscription...).

see [getSchemaMap](introspection.md#getschemamap)

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `operationType`? | `unknown` | the operation type to parse. |

#### Returns

`Record`\< `string`, `GraphQLOperationType` \>

a map of fields as k/v records.

#### Defined In

[packages/graphql/src/introspection.ts:275](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L275)

***

### getSchemaMap

```ts
getSchemaMap(schema): SchemaMap
```

Returns an introspection map of the GraphQL schema.
This is the entry point for GraphQL-Markdown schema parsing features.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schema` | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema. |

#### Returns

`SchemaMap`

a schema map by GraphQL entities (see SchemaEntity).

#### Example

```js
import { buildSchema } from "graphql";
import { getSchemaMap } from "@graphql-markdown/utils/graphql";

const schema = buildSchema(`
  interface Record {
    id: String!
  }
  type StudyItem implements Record {
    id: String!
    subject: String!
    duration: Int!
  }
  type Query {
    getStudyItems(subject: String): [StudyItem!]
    getStudyItem(id: String!): StudyItem
  }
  type Mutation {
    addStudyItem(subject: String!, duration: Int!): StudyItem
  }
  type Subscription {
    listStudyItems: [StudyItem!]
  }
`);

const schemaTypeMap = getSchemaMap(schema);

// expected result: {
//   queries: {
//     getStudyItems: GraphQLField,
//     getStudyItem: GraphQLField,
//   },
//   mutations: {
//     addStudyItem: GraphQLField,
//   },
//   subscriptions: {
//     listStudyItems: GraphQLField,
//   }
//   directives: {
//     include: GraphQLDirective,
//     skip: GraphQLDirective,
//     deprecated: GraphQLDirective,
//     specifiedBy: GraphQLDirective,
//   objects: {
//     StudyItem: GraphQLObjectType,
//   unions: {},
//   interfaces: {
//     Record: GraphQLInterfaceType,
//   enums: {},
//   inputs: {},
//   scalars: {
//     String: GraphQLScalarType,
//     Int: GraphQLScalarType,
//     Boolean: GraphQLScalarType,
//   }
// }
```

#### Defined In

[packages/graphql/src/introspection.ts:404](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L404)

***

### getTypeDirectiveArgValue

```ts
getTypeDirectiveArgValue(
  directive,
  node,
  argName): Maybe< Record< string, unknown > >
```

Returns one directive's argument's value linked to a GraphQL schema type.
It calls [getTypeDirectiveValues](introspection.md#gettypedirectivevalues) and returns a matching record.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema. |
| `node` | `unknown` | - |
| `argName` | `string` | the name of the GraphQL directive argument to fetch the value from. |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with `argName` as key and the argument's value.

#### Defined In

[packages/graphql/src/introspection.ts:177](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L177)

***

### getTypeDirectiveValues

```ts
getTypeDirectiveValues(directive, type): Maybe< Record< string, unknown > >
```

Returns all directive's arguments' values linked to a GraphQL schema type.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `directive` | `GraphQLDirective` | a GraphQL directive defined in the schema. |
| `type` | `unknown` | the GraphQL schema type to parse. |

#### Returns

`Maybe`\< `Record`\< `string`, `unknown` \> \>

a record k/v with arguments' name as keys and arguments' value.

#### Defined In

[packages/graphql/src/introspection.ts:200](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L200)

***

### getTypeFromSchema

```ts
getTypeFromSchema<T>(schema, type): Maybe< Record< string, T > >
```

Returns a map of GraphQL named types from a schema for a defined GraphQL type.
When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.

#### Type parameters

| Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schema` | `Maybe`\< `GraphQLSchema` \> | a GraphQL schema. |
| `type` | `unknown` | a GraphQL type, eg `GraphQLObjectType`. |

#### Returns

`Maybe`\< `Record`\< `string`, `T` \> \>

a map of GraphQL named types for the matching GraphQL type, or undefined if no match.

#### See

[getSchemaMap](introspection.md#getschemamap)

#### Defined In

[packages/graphql/src/introspection.ts:51](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L51)

***

### getTypeName

```ts
getTypeName(type, defaultName = ""): string
```

Resolves the name of a GraphQL schema type.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `type` | `unknown` | `undefined` | - |
| `defaultName` | `string` | `""` | optional fallback value if the name resolution fails. |

#### Returns

`string`

the type's name, or `defaultName`.

#### Defined In

[packages/graphql/src/introspection.ts:320](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L320)

***

### hasAstNode

```ts
hasAstNode<T>(node): node is AstNodeType<T>
```

Type guard for type with an AST node property.

#### Type parameters

| Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `node` | `T` | a GraphQL schema named type. |

#### Returns

`node is AstNodeType<T>`

`true` if the entity has an AST node property, else `false`.

#### Defined In

[packages/graphql/src/introspection.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L93)

***

### hasDirective

```ts
hasDirective(entity, directives): boolean
```

Checks if a schema entity as a directive belonging to a defined set.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `unknown` | a GraphQL schema entity. |
| `directives` | `Maybe`\< `string` \| `string`[] \> | a directive name or a list of directive names. |

#### Returns

`boolean`

`true` if the entity has at least one directive matching, else `false`.

#### Defined In

[packages/graphql/src/introspection.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/introspection.ts#L106)
